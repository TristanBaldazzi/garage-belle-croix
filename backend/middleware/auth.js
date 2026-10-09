import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Non authentifié' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide' });
  }
};

function getClientIp(req) {
  const raw = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.headers['x-real-ip'] || req.socket?.remoteAddress || req.ip || 'inconnue';
  // Afficher en IPv4 : extraire si format IPv4-mapped (::ffff:1.2.3.4)
  if (raw && raw.startsWith('::ffff:')) {
    return raw.slice(7);
  }
  return raw;
}

export const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès refusé' });
  }
  const ip = getClientIp(req);
  console.log(`[Admin] Requête ${req.method} ${req.originalUrl} — IP: ${ip}`);
  next();
};



