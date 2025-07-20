require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const email = 'testuser@example.com';
  const newPassword = 'test123';

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const result = await User.updateOne(
    { email },
    { $set: { password: hashedPassword } }
  );

  if (result.modifiedCount > 0) {
    console.log(`✅ Password for ${email} was reset to "${newPassword}"`);
  } else {
    console.log('❌ Test user not found or password unchanged.');
  }

  process.exit();
};

run().catch(console.error);
