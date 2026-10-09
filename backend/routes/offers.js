import express from 'express';
import Offer from '../models/Offer.js';
import CategoryOrder from '../models/CategoryOrder.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { processImage } from '../middleware/imageProcessor.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Get all active offers grouped by category (public)
router.get('/', async (req, res) => {
  try {
    // Les offres dont la date de fin est passée ne sont plus affichées
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const offers = await Offer.find({
      isActive: true,
      $or: [{ validUntil: null }, { validUntil: { $gte: startOfToday } }]
    })
      .sort({ createdAt: -1 });
    
    // Get category order
    const categoryOrders = await CategoryOrder.find().sort({ order: 1 });
    const categoryMap = new Map();
    categoryOrders.forEach(cat => {
      categoryMap.set(cat.category, { order: cat.order, label: cat.label });
    });

    // Default labels if not in database
    const defaultLabels = {
      entretien: 'Entretien',
      reparation: 'Réparation',
      pneu: 'Pneus',
      vidange: 'Vidange',
      autre: 'Autre'
    };

    // Group offers by category
    const groupedOffers = {};
    offers.forEach(offer => {
      if (!groupedOffers[offer.category]) {
        groupedOffers[offer.category] = {
          category: offer.category,
          label: categoryMap.get(offer.category)?.label || defaultLabels[offer.category] || offer.category,
          order: categoryMap.get(offer.category)?.order || 999,
          offers: []
        };
      }
      groupedOffers[offer.category].offers.push(offer);
    });

    // Convert to array and sort by order
    const result = Object.values(groupedOffers)
      .filter(group => group.offers.length > 0) // Only categories with offers
      .sort((a, b) => a.order - b.order);

    res.json(result);
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Get all offers (admin only)
router.get('/all', authenticate, requireAdmin, async (req, res) => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 });
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Get single offer
router.get('/:id', async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ message: 'Offre non trouvée' });
    }
    res.json(offer);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Upload image route
router.post('/upload', authenticate, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucune image fournie' });
    }

    // Traiter l'image
    const processedPath = await processImage(req.file.path);
    const filename = path.basename(processedPath);
    
    // Retourner l'URL de l'image
    const imageUrl = `/uploads/${filename}`;
    res.json({ imageUrl, filename });
  } catch (error) {
    console.error('Upload error:', error);
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    res.status(500).json({ message: 'Erreur lors de l\'upload de l\'image' });
  }
});

// Create offer (admin only)
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const offer = new Offer(req.body);
    await offer.save();
    res.status(201).json(offer);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Update offer (admin only)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    // Si une nouvelle image est fournie et qu'il y avait une ancienne, supprimer l'ancienne
    if (req.body.image && req.body.oldImage) {
      const oldImagePath = path.join(__dirname, '../uploads', path.basename(req.body.oldImage));
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    const offer = await Offer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!offer) {
      return res.status(404).json({ message: 'Offre non trouvée' });
    }
    res.json(offer);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Delete offer (admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ message: 'Offre non trouvée' });
    }

    // Supprimer l'image associée si elle existe
    if (offer.image) {
      const imagePath = path.join(__dirname, '../uploads', path.basename(offer.image));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Offer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Offre supprimée' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;
