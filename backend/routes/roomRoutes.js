const express = require('express');
const Room = require('../models/Room');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

// Add a new room (only for hosts)
router.post('/add', authenticate, async (req, res) => {
  if (req.user.role !== 'host') return res.status(403).json({ message: 'Only hosts can add rooms' });

  const { title, description, price, location, amenities } = req.body;

  try {
    const room = new Room({ title, description, price, location, amenities, host: req.user.userId });
    await room.save();
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: 'Error creating room' });
  }
});

// Get all rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rooms' });
  }
});

module.exports = router;
