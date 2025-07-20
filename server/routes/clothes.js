const express = require('express');
const router = express.Router();
const ClothingItem = require('../models/ClothingItem');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload folder exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// Upload route
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const imageUrl = `/uploads/${req.file.filename}`;

    console.log('🔐 Decoded token email:', decoded.email);
    console.log('📦 req.body:', req.body);
    console.log('🖼 Uploaded file:', req.file);

    const item = new ClothingItem({
      name: req.body.name,
      imageUrl,
      category: req.body.category.toLowerCase(),
      color: req.body.color,
      userEmail: decoded.email,
      status: 'approved'
    });

    await item.save();
    res.json({ message: 'Clothing item uploaded!', item });
  } catch (err) {
    console.error('Error uploading clothing item:', err);
    res.status(500).json({ message: 'Upload failed' });
  }
});

// Get items by user
router.get('/user/:email', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.email !== req.params.email && decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // ✅ Only fetch approved clothing
    const clothes = await ClothingItem.find({ 
      userEmail: req.params.email, 
      status: 'approved' 
    });
    res.json(clothes);
  } catch (err) {
    console.error('Error fetching clothes:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;