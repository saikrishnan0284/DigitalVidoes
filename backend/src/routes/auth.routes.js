const express = require('express');
const router = express.Router();

// Mock OTP storage (in-memory for development)
const otpStore = new Map();

// Send OTP
router.post('/send-otp', async (req, res) => {
  try {
    const { phoneOrEmail } = req.body;

    if (!phoneOrEmail) {
      return res.status(400).json({
        status: 'error',
        message: 'Phone number or email is required'
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP (expires in 10 minutes)
    otpStore.set(phoneOrEmail, {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000
    });

    // Log OTP to console (for development)
    console.log(`\n🔐 OTP for ${phoneOrEmail}: ${otp}\n`);

    res.json({
      status: 'success',
      message: 'OTP sent successfully',
      data: {
        phoneOrEmail,
        expiresIn: '10 minutes'
      }
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to send OTP'
    });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { phoneOrEmail, otp } = req.body;

    if (!phoneOrEmail || !otp) {
      return res.status(400).json({
        status: 'error',
        message: 'Phone/email and OTP are required'
      });
    }

    const storedData = otpStore.get(phoneOrEmail);

    if (!storedData) {
      return res.status(400).json({
        status: 'error',
        message: 'OTP not found or expired'
      });
    }

    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(phoneOrEmail);
      return res.status(400).json({
        status: 'error',
        message: 'OTP has expired'
      });
    }

    if (storedData.otp !== otp) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid OTP'
      });
    }

    // OTP verified successfully
    otpStore.delete(phoneOrEmail);

    // Generate mock JWT token
    const token = Buffer.from(JSON.stringify({
      phoneOrEmail,
      timestamp: Date.now()
    })).toString('base64');

    const user = {
      _id: Date.now().toString(),
      name: phoneOrEmail.split('@')[0] || 'User',
      phoneOrEmail,
      createdAt: new Date().toISOString()
    };

    res.json({
      status: 'success',
      message: 'Login successful',
      data: {
        user,
        token,
        refreshToken: token
      }
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to verify OTP'
    });
  }
});

// Get current user
router.get('/me', (req, res) => {
  res.json({
    status: 'success',
    data: {
      _id: '1',
      name: 'Demo User',
      email: 'demo@celebrationhub.com',
      phoneOrEmail: 'demo@celebrationhub.com'
    }
  });
});

module.exports = router;
