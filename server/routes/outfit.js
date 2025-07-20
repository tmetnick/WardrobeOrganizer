const express = require('express');
const router = express.Router();
const Outfit = require('../models/Outfit');
const jwt = require('jsonwebtoken');

// POST /api/outfits/create
router.post('/create', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { name, clothingItems } = req.body;
    if (!name || !clothingItems || clothingItems.length === 0) {
      return res.status(400).json({ message: 'Missing name or clothing items' });
    }

    const outfit = new Outfit({
      name,
      clothingItems,
      userEmail: decoded.email
    });

    await outfit.save();
    res.json({ message: 'Outfit saved!', outfit });
  } catch (err) {
    console.error('Error saving outfit:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

