import rateLimit from 'express-rate-limit';

// Limite les envois de formulaires publics (anti-spam)
export const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 10,
  message: { message: 'Trop de demandes envoyées. Merci de réessayer plus tard ou de nous appeler directement.' }
});

// Champ piège invisible : les robots le remplissent, pas les humains
export const honeypot = (req, res, next) => {
  if (req.body?.website) {
    return res.status(201).json({ message: 'Demande envoyée avec succès' });
  }
  next();
};
