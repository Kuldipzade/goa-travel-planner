require('dotenv').config();
const dns = require('dns');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Use Google DNS to resolve MongoDB Atlas SRV records
// (local DNS server can't resolve them)
dns.setServers(['8.8.8.8', '8.8.4.4']);
const stopsRouter = require('./routes/stops');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/stops', stopsRouter);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'Goa Travel Planner API running 🌴' }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
