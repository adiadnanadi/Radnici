import pkg from 'express';
const { Request, Response } = pkg;
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { getPool } from '../db.js';

const pool = getPool();

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  userType: z.enum(['WORKER', 'CLIENT']),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  phone: z.string().optional(),
  location: z.string().optional(),
  category: z.string().optional(),
});

export const register = async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);
    
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [data.email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);
    
    const userResult = await pool.query(
      'INSERT INTO users (email, password, "userType") VALUES ($1, $2, $3) RETURNING id, email, "userType"',
      [data.email, hashedPassword, data.userType]
    );
    const user = userResult.rows[0];

    if (data.userType === 'WORKER') {
      await pool.query(
        `INSERT INTO worker_profiles ("userId", "firstName", "lastName", phone, location, category, availability)
         VALUES ($1, $2, $3, $4, $5, $6, 'AVAILABLE')`,
        [user.id, data.firstName, data.lastName, data.phone || '', data.location || '', data.category || '']
      );
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, userType: user.userType },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        userType: user.userType
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = userResult.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    let workerProfile = null;
    if (user.userType === 'WORKER') {
      const profileResult = await pool.query('SELECT * FROM worker_profiles WHERE "userId" = $1', [user.id]);
      workerProfile = profileResult.rows[0] || null;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, userType: user.userType },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        userType: user.userType,
        firstName: workerProfile?.firstName || '',
        lastName: workerProfile?.lastName || '',
        workerProfileId: workerProfile?.id || null
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getMe = async (req, res) => {
  try {
    const userResult = await pool.query('SELECT id, email, "userType", "createdAt" FROM users WHERE id = $1', [req.user.userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const user = userResult.rows[0];

    let workerProfile = null;
    if (user.userType === 'WORKER') {
      const profileResult = await pool.query('SELECT * FROM worker_profiles WHERE "userId" = $1', [user.id]);
      workerProfile = profileResult.rows[0] || null;
    }

    res.json({ user, workerProfile });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};