import express from 'express';
import CategoryOrder from '../models/CategoryOrder.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all categories with order
router.get('/', async (req, res) => {
  try {
    const categories = await CategoryOrder.find().sort({ order: 1 });
    
    // If no categories in DB, initialize with defaults
    if (categories.length === 0) {
      const defaultCategories = [
        { category: 'entretien', order: 1, label: 'Entretien' },
        { category: 'reparation', order: 2, label: 'Réparation' },
        { category: 'pneu', order: 3, label: 'Pneus' },
        { category: 'vidange', order: 4, label: 'Vidange' },
        { category: 'autre', order: 5, label: 'Autre' }
      ];
      
      await CategoryOrder.insertMany(defaultCategories);
      const newCategories = await CategoryOrder.find().sort({ order: 1 });
      return res.json(newCategories);
    }
    
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Update category order (admin only)
router.put('/order', authenticate, requireAdmin, async (req, res) => {
  try {
    const { categories } = req.body; // Array of { category, order, label }
    
    if (!Array.isArray(categories)) {
      return res.status(400).json({ message: 'Categories doit être un tableau' });
    }

    // Update each category
    const updates = categories.map(({ category, order, label }) =>
      CategoryOrder.findOneAndUpdate(
        { category },
        { order, label },
        { upsert: true, new: true }
      )
    );

    await Promise.all(updates);
    
    const updatedCategories = await CategoryOrder.find().sort({ order: 1 });
    res.json(updatedCategories);
  } catch (error) {
    console.error('Error updating category order:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;



