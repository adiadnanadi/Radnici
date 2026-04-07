import pkg from 'express';
const { Request, Response } = pkg;
import { getPool } from '../db.js';

const pool = getPool();

export const getFavorites = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT f.*, wp."firstName", wp."lastName", wp.category, wp.location, wp."avatarUrl", wp.rating 
       FROM favorites f 
       JOIN worker_profiles wp ON f."workerId" = wp.id 
       WHERE f."userId" = $1`,
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const addFavorite = async (req, res) => {
  try {
    const { workerId } = req.params;

    const existing = await pool.query(
      'SELECT id FROM favorites WHERE "userId" = $1 AND "workerId" = $2',
      [req.user.userId, workerId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Worker already in favorites' });
    }

    const result = await pool.query(
      'INSERT INTO favorites ("userId", "workerId") VALUES ($1, $2) RETURNING *',
      [req.user.userId, workerId]
    );

    res.status(201).json({ message: 'Added to favorites', favorite: result.rows[0] });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const { workerId } = req.params;

    const existing = await pool.query(
      'SELECT id FROM favorites WHERE "userId" = $1 AND "workerId" = $2',
      [req.user.userId, workerId]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    await pool.query('DELETE FROM favorites WHERE "userId" = $1 AND "workerId" = $2', [req.user.userId, workerId]);
    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const checkFavorite = async (req, res) => {
  try {
    const { workerId } = req.params;
    const result = await pool.query(
      'SELECT id FROM favorites WHERE "userId" = $1 AND "workerId" = $2',
      [req.user.userId, workerId]
    );
    res.json({ isFavorite: result.rows.length > 0 });
  } catch (error) {
    console.error('Check favorite error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};