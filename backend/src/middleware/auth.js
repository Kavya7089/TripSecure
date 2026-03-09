const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');
const supabase = require('../config/db');

async function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: 'Missing auth' });

    const token = header.split(' ')[1];
    const payload = jwt.verify(token, jwtSecret);

    const { data: user, error } = await supabase.from('users').select('*').eq('id', payload.id || payload.sub).single();
    
    if (error || !user) return res.status(401).json({ message: 'Invalid token user' });

    req.user = user; // attach user to request
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized', error: err.message });
  }
}

module.exports = authMiddleware;
