const mongoose = require('mongoose');

const ClothingItemSchema = new mongoose.Schema({
  name: String,
  imageUrl: String,           // ✅ store the uploaded image path
  category: String,           // ✅ "tops", "bottoms", "shoes", etc.
  color: String,              // ✅ "blue", "black", etc.
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  userEmail: String
});

module.exports = mongoose.model('ClothingItem', ClothingItemSchema);