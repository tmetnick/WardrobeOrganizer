const mongoose = require('mongoose');

const ClothingItemSchema = new mongoose.Schema({
  name: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  userEmail: String
  // Add other fields like imageURL, tags, etc., as needed
});

module.exports = mongoose.model('ClothingItem', ClothingItemSchema);