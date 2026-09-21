import { verifyJWT } from '../config/jwt.js';

export const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // If no token header provided, attach default demo user from request body or fallback
    req.user = req.body?.user || { id: 'user-guest', role: 'patient', full_name: 'Guest User' };
    return next();
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyJWT(token);

  if (!decoded) {
    return res.status(401).json({ error: 'Invalid or expired authorization token' });
  }

  req.user = decoded;
  next();
};

export const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role) && req.user.role !== 'admin') {
      return res.status(403).json({
        error: `Access Denied: Required role '${allowedRoles.join(' or ')}', but your account has role '${req.user.role}'`
      });
    }

    next();
  };
};
