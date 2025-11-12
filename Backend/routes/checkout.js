import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Get user info for checkout
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('name email address phone');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user info', detail: err.message })
  }
});

export default router;