const express = require('express');
const router = express.Router();
const User = require('../models/User');
const isAdmin = require('../middleware/isAdmin');

// View all users
router.get('/users', isAdmin, async (req, res) => {
  const users = await User.find({}, '-password'); // exclude password
  res.json(users);
});

// Update user (activate/deactivate, role change)
router.patch('/users/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  const { isActive, role } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { isActive, role },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user' });
  }
});

// Delete a user
router.delete('/users/:id', isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    await User.findByIdAndDelete(id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

module.exports = router;