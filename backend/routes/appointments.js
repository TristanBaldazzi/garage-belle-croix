import express from 'express';
import Appointment from '../models/Appointment.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { formLimiter, honeypot } from '../middleware/formProtection.js';
import { notifyGarage } from '../utils/mailer.js';

const router = express.Router();

const SLOT_LABELS = { matin: 'Matin', 'apres-midi': 'Après-midi' };

const todayString = () => {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

// Create appointment request (public)
router.post('/', formLimiter, honeypot, async (req, res) => {
  try {
    const { name, phone, email, vehicleType, vehicle, licensePlate, service, preferredDate, preferredSlot, message } = req.body;

    if (!name || !phone || !service || !preferredDate || !preferredSlot) {
      return res.status(400).json({
        message: 'Nom, téléphone, prestation, date et créneau sont requis'
      });
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(preferredDate) || preferredDate < todayString()) {
      return res.status(400).json({ message: 'La date souhaitée est invalide' });
    }

    const appointment = new Appointment({
      name,
      phone,
      email,
      vehicleType,
      vehicle,
      licensePlate: licensePlate?.toUpperCase().trim(),
      service,
      preferredDate,
      preferredSlot,
      message
    });

    await appointment.save();

    const [y, m, d] = preferredDate.split('-');
    notifyGarage(`Nouvelle demande de rendez-vous — ${name}`, [
      ['Nom', name],
      ['Téléphone', phone],
      ['Email', email],
      ['Prestation', service],
      ['Véhicule', `${vehicleType === 'moto' ? 'Moto' : 'Voiture'}${vehicle ? ` — ${vehicle}` : ''}`],
      ['Immatriculation', licensePlate],
      ['Date souhaitée', `${d}/${m}/${y} (${SLOT_LABELS[preferredSlot]})`],
      ['Message', message]
    ], email);

    res.status(201).json({
      message: 'Demande de rendez-vous envoyée avec succès',
      appointment
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Données invalides' });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Get all appointments (admin only)
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { isArchived, isRead, status } = req.query;
    const filter = {};

    if (isArchived !== undefined) {
      filter.isArchived = isArchived === 'true';
    }
    if (isRead !== undefined) {
      filter.isRead = isRead === 'true';
    }
    if (status) {
      filter.status = status;
    }

    const appointments = await Appointment.find(filter)
      .sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Mark as read (admin only)
router.patch('/:id/read', authenticate, requireAdmin, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Update status (admin only)
router.patch('/:id/status', authenticate, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['en_attente', 'confirme', 'annule'].includes(status)) {
      return res.status(400).json({ message: 'Statut invalide' });
    }
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status, isRead: true },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Archive appointment (admin only)
router.patch('/:id/archive', authenticate, requireAdmin, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { isArchived: true },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Delete appointment (admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }
    res.json({ message: 'Rendez-vous supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;
