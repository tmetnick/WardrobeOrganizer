require('dotenv').config();
const mongoose = require('mongoose');
const ClothingItem = require('./models/ClothingItem');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
  return ClothingItem.insertMany([
    {
      name: 'Blue Jeans',
      status: 'pending',
      userEmail: 'user1@example.com'
    },
    {
      name: 'Gray Hoodie',
      status: 'pending',
      userEmail: 'user2@example.com'
    },
    {
      name: 'Black Nike Sneakers',
      status: 'approved',
      userEmail: 'admin@example.com'
    }
  ]);
}).then(() => {
  console.log('Dummy clothing items inserted!');
  process.exit();
}).catch(err => {
  console.error('Error inserting dummy data:', err);
  process.exit(1);
});