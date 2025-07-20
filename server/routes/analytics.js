const express = require('express');
const router = express.Router();
const User = require('../models/User');
const ClothingItem = require('../models/ClothingItem');

router.get('/user-stats', async (req, res) => {
  const total = await User.countDocuments();
  const active = await User.countDocuments({ isActive: true });
  const inactive = total - active;
  res.json({ total, active, inactive });
});

router.get('/user-registrations', async (req, res) => {
  const data = await User.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
  res.json(data);
});

router.get('/clothing-stats', async (req, res) => {
  const totalItems = await ClothingItem.countDocuments();
  const categories = await ClothingItem.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } }
  ]);
  res.json({ totalItems, categories });
});

module.exports = router;