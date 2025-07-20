const mongoose = require('mongoose');

const OutfitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  clothingItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ClothingItem' }],
  userEmail: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Outfit', OutfitSchema);