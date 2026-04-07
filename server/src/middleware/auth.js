import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user.userType !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied. Admin only.' });
  }
  next();
};

export const isWorker = (req, res, next) => {
  if (req.user.userType !== 'WORKER') {
    return res.status(403).json({ error: 'Access denied. Workers only.' });
  }
  next();
};

export const isClient = (req, res, next) => {
  if (req.user.userType !== 'CLIENT') {
    return res.status(403).json({ error: 'Access denied. Clients only.' });
  }
  next();
};
