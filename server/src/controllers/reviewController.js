import pkg from 'express';
const { Request, Response } = pkg;
import { z } from 'zod';
import { getPool } from '../db.js';

const pool = getPool();

const createReviewSchema = z.object({
  workerId: z.number().min(1, 'Worker ID is required'),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  projectType: z.string().optional(),
});

export const createReview = async (req, res) => {
  try {
    const data = createReviewSchema.parse(req.body);

    const existingReview = await pool.query(
      'SELECT id FROM reviews WHERE "workerId" = $1 AND "clientId" = $2',
      [data.workerId, req.user.userId]
    );

    if (existingReview.rows.length > 0) {
      return res.status(400).json({ error: 'You have already reviewed this worker' });
    }

    const result = await pool.query(
      'INSERT INTO reviews ("workerId", "clientId", rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
      [data.workerId, req.user.userId, data.rating, data.comment || '']
    );

    const review = result.rows[0];

    const avgResult = await pool.query(
      'SELECT AVG(rating) as avgRating, COUNT(*) as count FROM reviews WHERE "workerId" = $1',
      [data.workerId]
    );

    await pool.query(
      'UPDATE worker_profiles SET rating = $1, "reviewCount" = $2 WHERE id = $3',
      [avgResult.rows[0].avgrating || 0, avgResult.rows[0].count, data.workerId]
    );

    res.status(201).json({
      message: 'Review submitted successfully',
      review,
      newAverageRating: avgResult.rows[0].avgrating
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Create review error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getWorkerReviews = async (req, res) => {
  try {
    const { workerId } = req.params;
    const result = await pool.query(
      'SELECT r.*, u.email as clientEmail FROM reviews r JOIN users u ON r."clientId" = u.id WHERE r."workerId" = $1 ORDER BY r."createdAt" DESC',
      [workerId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get worker reviews error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await pool.query('SELECT "clientId" FROM reviews WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (existing.rows[0].clientId !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await pool.query('DELETE FROM reviews WHERE id = $1', [id]);
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};