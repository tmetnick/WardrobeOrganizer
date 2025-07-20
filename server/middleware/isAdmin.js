const jwt = require('jsonwebtoken');
const User = require('../models/User');

const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      console.warn(' No token provided');
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(' Decoded token:', decoded);

    const userId = decoded.userId || decoded.id; //  Handle both cases
    const user = await User.findById(userId);

    if (!user) {
      console.warn(' User not found');
      return res.status(403).json({ message: 'User not found' });
    }

    if (user.role !== 'admin') {
      console.warn(` Access denied. Role is: ${user.role}`);
      return res.status(403).json({ message: 'Admin access only' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error(' isAdmin error:', err.message);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = isAdmin;