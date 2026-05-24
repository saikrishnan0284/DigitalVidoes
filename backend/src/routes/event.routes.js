const express = require('express');
const router = express.Router();

// Mock events data
const mockEvents = [
  {
    _id: '1',
    title: 'Wedding Ceremony',
    description: 'John & Jane Wedding',
    date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'Grand Hotel, New York',
    type: 'wedding',
    status: 'upcoming',
    createdAt: new Date().toISOString()
  },
  {
    _id: '2',
    title: 'Birthday Party',
    description: 'Sarah\'s 25th Birthday',
    date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'Home',
    type: 'birthday',
    status: 'upcoming',
    createdAt: new Date().toISOString()
  }
];

// Get all events
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    data: mockEvents
  });
});

// Get single event
router.get('/:id', (req, res) => {
  const event = mockEvents.find(e => e._id === req.params.id);

  if (!event) {
    return res.status(404).json({
      status: 'error',
      message: 'Event not found'
    });
  }

  res.json({
    status: 'success',
    data: event
  });
});

// Create event
router.post('/', (req, res) => {
  const newEvent = {
    _id: (mockEvents.length + 1).toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };

  mockEvents.push(newEvent);

  res.status(201).json({
    status: 'success',
    message: 'Event created successfully',
    data: newEvent
  });
});

module.exports = router;
