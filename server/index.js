const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const path = require('path');
const app = express(); // ✅ only one app declaration!

app.use(cors());
app.use(express.json());

// ✅ Serve static files from the client folder
app.use(express.static(path.join(__dirname, '../client')));

// ✅ Auth routes
const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);

// ✅ Admin routes
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

// ✅ Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB connected');
  app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
  });
})
.catch(err => console.log(err));

