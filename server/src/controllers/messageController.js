import pkg from 'express';
const { Request, Response } = pkg;
import { z } from 'zod';
import pool from '../db.js';

const sendMessageSchema = z.object({
  receiverId: z.number().min(1, 'Receiver is required'),
  workerId: z.number().optional(),
  content: z.string().min(1, 'Message content is required'),
});

export const sendMessage = async (req, res) => {
  try {
    const data = sendMessageSchema.parse(req.body);

    const result = await pool.query(
      'INSERT INTO messages ("senderId", "receiverId", "workerId", content) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.userId, data.receiverId, data.workerId || null, data.content]
    );

    res.status(201).json({
      message: 'Message sent successfully',
      data: result.rows[0]
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getInbox = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT m.*, u.email as senderEmail, wp."firstName", wp."lastName" 
       FROM messages m 
       JOIN users u ON m."senderId" = u.id 
       LEFT JOIN worker_profiles wp ON m."workerId" = wp.id
       WHERE m."receiverId" = $1 
       ORDER BY m."createdAt" DESC`,
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get inbox error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getSent = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT m.*, u.email as receiverEmail, wp."firstName", wp."lastName" 
       FROM messages m 
       JOIN users u ON m."receiverId" = u.id 
       LEFT JOIN worker_profiles wp ON m."workerId" = wp.id
       WHERE m."senderId" = $1 
       ORDER BY m."createdAt" DESC`,
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get sent error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      `SELECT * FROM messages 
       WHERE ("senderId" = $1 AND "receiverId" = $2) OR ("senderId" = $2 AND "receiverId" = $1)
       ORDER BY "createdAt" ASC`,
      [req.user.userId, userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('UPDATE messages SET "isRead" = true WHERE id = $1 AND "receiverId" = $2', [id, req.user.userId]);
    res.json({ message: 'Message marked as read' });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await pool.query('SELECT "senderId" FROM messages WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }
    if (existing.rows[0].senderId !== req.user.userId && existing.rows[0].receiverId !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    await pool.query('DELETE FROM messages WHERE id = $1', [id]);
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT COUNT(*) as count FROM messages WHERE "receiverId" = $1 AND "isRead" = false',
      [req.user.userId]
    );
    res.json({ count: parseInt(result.rows[0].count) });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};