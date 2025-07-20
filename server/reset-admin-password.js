require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  console.log("Connected to MongoDB, running password reset...");
  
  const email = 'admin@wardrobeorganizer.com';
  const newPassword = 'admin123';

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const result = await User.updateOne(
    { email },
    { $set: { password: hashedPassword } }
  );

  if (result.modifiedCount > 0) {
    console.log(`✅ Password for ${email} was reset to "${newPassword}"`);
  } else {
    console.log('❌ Failed to reset. Admin not found or already has this password.');
  }

  process.exit();
};

run().catch(console.error);
