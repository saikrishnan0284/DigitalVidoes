const express = require('express');
const router = express.Router();

// Health check route
router.get('/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'CelebrationHub API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Placeholder routes for different modules
router.use('/auth', require('./auth.routes'));
router.use('/events', require('./event.routes'));
router.use('/vendors', require('./vendor.routes'));

module.exports = router;
