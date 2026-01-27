import express from 'express';
import QuoteRequest from '../models/QuoteRequest.js';
import Offer from '../models/Offer.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Create quote request (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, licensePlate, message, offerId } = req.body;

    if (!name || !email || !message || !offerId || !licensePlate) {
      return res.status(400).json({ 
        message: 'Nom, email, plaque d\'immatriculation, message et offre sont requis' 
      });
    }

    // Verify offer exists
    const offer = await Offer.findById(offerId);
    if (!offer) {
      return res.status(404).json({ message: 'Offre non trouvée' });
    }

    const quoteRequest = new QuoteRequest({
      name,
      email,
      phone,
      licensePlate: licensePlate.toUpperCase().trim(),
      message,
      offerId,
      offerTitle: offer.title
    });

    await quoteRequest.save();
    res.status(201).json({ 
      message: 'Demande de devis envoyée avec succès',
      quoteRequest 
    });
  } catch (error) {
    console.error('Error creating quote request:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Get all quote requests (admin only)
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { isArchived, isRead, search } = req.query;
    const filter = {};
    
    if (isArchived !== undefined) {
      filter.isArchived = isArchived === 'true';
    }
    if (isRead !== undefined) {
      filter.isRead = isRead === 'true';
    }

    // Search in all fields
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { licensePlate: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
        { offerTitle: { $regex: search, $options: 'i' } }
      ];
    }

    const quotes = await QuoteRequest.find(filter)
      .populate('offerId', 'title price')
      .sort({ createdAt: -1 });
    res.json(quotes);
  } catch (error) {
    console.error('Error fetching quote requests:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Get single quote request (admin only)
router.get('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const quote = await QuoteRequest.findById(req.params.id)
      .populate('offerId');
    if (!quote) {
      return res.status(404).json({ message: 'Demande de devis non trouvée' });
    }
    res.json(quote);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Mark as read (admin only)
router.patch('/:id/read', authenticate, requireAdmin, async (req, res) => {
  try {
    const quote = await QuoteRequest.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!quote) {
      return res.status(404).json({ message: 'Demande de devis non trouvée' });
    }
    res.json(quote);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Archive quote request (admin only)
router.patch('/:id/archive', authenticate, requireAdmin, async (req, res) => {
  try {
    const quote = await QuoteRequest.findByIdAndUpdate(
      req.params.id,
      { isArchived: true },
      { new: true }
    );
    if (!quote) {
      return res.status(404).json({ message: 'Demande de devis non trouvée' });
    }
    res.json(quote);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Delete quote request (admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const quote = await QuoteRequest.findByIdAndDelete(req.params.id);
    if (!quote) {
      return res.status(404).json({ message: 'Demande de devis non trouvée' });
    }
    res.json({ message: 'Demande de devis supprimée' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;

