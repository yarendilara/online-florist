const User = require('../models/User');

const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Please login first' });
  }
  next();
};

const requireAdmin = (req, res, next) => {
  if (!req.session.user || !req.session.user.is_admin) {
    return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
  }
  next();
};

const checkAuth = (req, res, next) => {
  // Middleware to check if user is authenticated, but don't require it
  if (req.session.user) {
    res.locals.user = req.session.user;
  }
  next();
};

module.exports = {
  requireLogin,
  requireAdmin,
  checkAuth
};
