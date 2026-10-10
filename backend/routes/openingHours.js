import express from 'express';
import OpeningHours, { OPENING_DAYS } from '../models/OpeningHours.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
const MAX_SLOTS = 4;

const DAY_LABELS = {
  monday: 'lundi', tuesday: 'mardi', wednesday: 'mercredi', thursday: 'jeudi',
  friday: 'vendredi', saturday: 'samedi', sunday: 'dimanche'
};

// Valide et normalise un jour envoyé par l'admin. Renvoie { day } ou { error }.
function sanitizeDay(key, input = {}) {
  const isClosed = !!input.isClosed;
  // Compatibilité : un ancien client n'envoie que open/close
  let slots = Array.isArray(input.slots) && input.slots.length
    ? input.slots
    : [{ open: input.open, close: input.close }];

  slots = slots.map((s) => ({ open: String(s?.open || ''), close: String(s?.close || '') }));

  if (!isClosed) {
    if (slots.length > MAX_SLOTS) return { error: `Maximum ${MAX_SLOTS} plages par jour (${DAY_LABELS[key]})` };
    for (const s of slots) {
      if (!TIME.test(s.open) || !TIME.test(s.close)) return { error: `Heure invalide le ${DAY_LABELS[key]}` };
      if (s.open >= s.close) return { error: `Le ${DAY_LABELS[key]}, une plage se termine avant de commencer (${s.open} → ${s.close})` };
    }
    slots.sort((a, b) => a.open.localeCompare(b.open));
    for (let i = 1; i < slots.length; i++) {
      if (slots[i].open < slots[i - 1].close) return { error: `Le ${DAY_LABELS[key]}, deux plages se chevauchent` };
    }
  } else {
    // Jour fermé : on conserve les plages valides pour les retrouver à la réouverture
    slots = slots.filter((s) => TIME.test(s.open) && TIME.test(s.close) && s.open < s.close);
    if (!slots.length) slots = [{ open: '08:00', close: '18:00' }];
  }

  return { day: { isClosed, slots, open: slots[0].open, close: slots[slots.length - 1].close } };
}

// Get opening hours (public)
router.get('/', async (req, res) => {
  try {
    const hours = await OpeningHours.getOrCreate();
    res.json(hours.toPublicJSON());
  } catch (error) {
    console.error('Error fetching opening hours:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Update opening hours (admin only)
router.put('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const update = {};
    for (const key of OPENING_DAYS) {
      if (!req.body?.[key]) continue;
      const { day, error } = sanitizeDay(key, req.body[key]);
      if (error) return res.status(400).json({ message: error });
      update[key] = day;
    }

    let hours = await OpeningHours.findOne();
    if (!hours) {
      hours = new OpeningHours(update);
    } else {
      Object.assign(hours, update);
    }

    await hours.save();
    res.json(hours.toPublicJSON());
  } catch (error) {
    console.error('Error updating opening hours:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;
