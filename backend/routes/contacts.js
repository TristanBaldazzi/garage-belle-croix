import express from 'express';
import Contact from '../models/Contact.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { formLimiter, honeypot } from '../middleware/formProtection.js';
import { notifyGarage } from '../utils/mailer.js';

const router = express.Router();

// Create contact request (public)
router.post('/', formLimiter, honeypot, async (req, res) => {
  try {
    const { name, email, phone, message, subject } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ 
        message: 'Nom, email et message sont requis' 
      });
    }

    const contact = new Contact({
      name,
      email,
      phone,
      message,
      subject
    });

    await contact.save();

    notifyGarage(`Nouveau message — ${subject || name}`, [
      ['Nom', name],
      ['Téléphone', phone],
      ['Email', email],
      ['Sujet', subject],
      ['Message', message]
    ], email);
    res.status(201).json({ 
      message: 'Demande de contact envoyée avec succès',
      contact 
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Get all contacts (admin only)
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { isArchived, isRead } = req.query;
    const filter = {};
    
    if (isArchived !== undefined) {
      filter.isArchived = isArchived === 'true';
    }
    if (isRead !== undefined) {
      filter.isRead = isRead === 'true';
    }

    const contacts = await Contact.find(filter)
      .sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Get single contact (admin only)
router.get('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact non trouvé' });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Mark as read (admin only)
router.patch('/:id/read', authenticate, requireAdmin, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!contact) {
      return res.status(404).json({ message: 'Contact non trouvé' });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Archive contact (admin only)
router.patch('/:id/archive', authenticate, requireAdmin, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { isArchived: true },
      { new: true }
    );
    if (!contact) {
      return res.status(404).json({ message: 'Contact non trouvé' });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Delete contact (admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact non trouvé' });
    }
    res.json({ message: 'Contact supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;



