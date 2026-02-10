import express from 'express';
import OpeningHours from '../models/OpeningHours.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get opening hours (public)
router.get('/', async (req, res) => {
  try {
    const hours = await OpeningHours.getOrCreate();
    res.json(hours);
  } catch (error) {
    console.error('Error fetching opening hours:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Update opening hours (admin only)
router.put('/', authenticate, requireAdmin, async (req, res) => {
  try {
    let hours = await OpeningHours.findOne();
    
    if (!hours) {
      hours = new OpeningHours(req.body);
    } else {
      Object.assign(hours, req.body);
    }
    
    await hours.save();
    res.json(hours);
  } catch (error) {
    console.error('Error updating opening hours:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;



