import pkg from 'express';
const { Request, Response } = pkg;

const users = [];
const workerProfiles = [];
const reviews = [];

export const getDashboardStats = (req, res) => {
  try {
    const totalWorkers = workerProfiles.length;
    const totalClients = users.filter(u => u.userType === 'CLIENT').length;
    const totalReviews = reviews.length;
    const verifiedWorkers = workerProfiles.filter(w => w.isVerified).length;

    res.json({
      totalWorkers,
      totalClients,
      totalReviews,
      verifiedWorkers,
      pendingVerification: totalWorkers - verifiedWorkers
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAllWorkersAdmin = (req, res) => {
  try {
    res.json(workerProfiles);
  } catch (error) {
    console.error('Get all workers admin error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAllClients = (req, res) => {
  try {
    const clients = users.filter(u => u.userType === 'CLIENT');
    res.json(clients);
  } catch (error) {
    console.error('Get all clients error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const verifyWorker = (req, res) => {
  try {
    const { id } = req.params;
    const worker = workerProfiles.find(w => w.id === id);

    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    worker.isVerified = true;
    worker.updatedAt = new Date();

    res.json({
      message: 'Worker verified successfully',
      worker
    });
  } catch (error) {
    console.error('Verify worker error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const unverifyWorker = (req, res) => {
  try {
    const { id } = req.params;
    const worker = workerProfiles.find(w => w.id === id);

    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    worker.isVerified = false;
    worker.updatedAt = new Date();

    res.json({
      message: 'Worker unverified successfully',
      worker
    });
  } catch (error) {
    console.error('Unverify worker error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const suspendWorker = (req, res) => {
  try {
    const { id } = req.params;
    const worker = workerProfiles.find(w => w.id === id);

    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    worker.isActive = false;
    worker.updatedAt = new Date();

    res.json({
      message: 'Worker suspended successfully',
      worker
    });
  } catch (error) {
    console.error('Suspend worker error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const activateWorker = (req, res) => {
  try {
    const { id } = req.params;
    const worker = workerProfiles.find(w => w.id === id);

    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    worker.isActive = true;
    worker.updatedAt = new Date();

    res.json({
      message: 'Worker activated successfully',
      worker
    });
  } catch (error) {
    console.error('Activate worker error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteReviewAdmin = (req, res) => {
  try {
    const { id } = req.params;
    const reviewIndex = reviews.findIndex(r => r.id === id);

    if (reviewIndex === -1) {
      return res.status(404).json({ error: 'Review not found' });
    }

    reviews.splice(reviewIndex, 1);

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review admin error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAllReviewsAdmin = (req, res) => {
  try {
    res.json(reviews);
  } catch (error) {
    console.error('Get all reviews admin error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
