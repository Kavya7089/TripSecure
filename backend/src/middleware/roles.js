function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Requires role ' + roles.join(',') });
    }
    next();
  };
}

module.exports = { requireRole };
