const express = require('express');
const router = express.Router();
const ClothingItem = require('../models/ClothingItem');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const isAdmin = require('../middleware/isAdmin'); // ✅ Needed for admin routes

// Ensure upload folder exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer config
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

/**
 * POST /upload
 * Upload a clothing item with image
 */
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const imageUrl = `/uploads/${req.file.filename}`;

    console.log(' Decoded token email:', decoded.email);
    console.log(' req.body:', req.body);
    console.log(' Uploaded file:', req.file);

    const item = new ClothingItem({
      name: req.body.name,
      imageUrl,
      category: req.body.category.toLowerCase(),
      color: req.body.color,
      userEmail: decoded.email,
      status: 'approved' // You can change this to 'pending' if moderation is required before approval
    });

    await item.save();
    res.json({ message: 'Clothing item uploaded!', item });
  } catch (err) {
    console.error('Error uploading clothing item:', err);
    res.status(500).json({ message: 'Upload failed' });
  }
});

/**
 * PATCH /:id/moderate
 * Admin updates status of clothing item (approve/reject)
 */
router.patch('/:id/moderate', isAdmin, async (req, res) => {
  try {
    const item = await ClothingItem.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update item status' });
  }
});

/**
 * DELETE /admin/clothes/:id
 * Admin deletes a clothing item
 */
router.delete('/admin/clothes/:id', isAdmin, async (req, res) => {
  try {
    await ClothingItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete item' });
  }
});

/**
 * GET /admin/clothes
 * Admin fetches all clothing items
 */
router.get('/admin/clothes', isAdmin, async (req, res) => {
  try {
    const items = await ClothingItem.find();
    res.json(items);
  } catch (err) {
    console.error('Error fetching clothing items:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /user/:email
 * User or admin fetches clothing items by user email
 */
router.get('/user/:email', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.email !== req.params.email && decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

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