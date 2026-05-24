const express = require('express');
const router = express.Router();

// Mock vendors data
const mockVendors = [
  {
    _id: '1',
    name: 'Elite Decorators',
    category: 'Decorators',
    description: 'Professional event decoration services',
    rating: 4.8,
    reviews: 125,
    location: 'New York, NY',
    price: '$$$',
    phone: '+1234567890'
  },
  {
    _id: '2',
    name: 'Gourmet Catering Co.',
    category: 'Food Caterers',
    description: 'Premium catering services for all occasions',
    rating: 4.9,
    reviews: 203,
    location: 'New York, NY',
    price: '$$$$',
    phone: '+1234567891'
  }
];

// Get all vendors
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    data: mockVendors
  });
});

// Get single vendor
router.get('/:id', (req, res) => {
  const vendor = mockVendors.find(v => v._id === req.params.id);

  if (!vendor) {
    return res.status(404).json({
      status: 'error',
      message: 'Vendor not found'
    });
  }

  res.json({
    status: 'success',
    data: vendor
  });
});

module.exports = router;
