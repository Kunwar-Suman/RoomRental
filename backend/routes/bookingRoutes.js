const express = require('express');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

// Create a booking
router.post('/book', authenticate, async (req, res) => {
  const { roomId, checkInDate, checkOutDate } = req.body;

  try {
    // Check if room exists
    const room = await Room.findById(roomId);
    if (!room || !room.available) return res.status(400).json({ message: 'Room is not available' });

    // Create booking
    const booking = new Booking({
      guest: req.user.userId,
      room: roomId,
      checkInDate,
      checkOutDate,
      status: 'pending'
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking' });
  }
});

// Get user bookings
router.get('/', authenticate, async (req, res) => {
  try {
    const bookings = await Booking.find({ guest: req.user.userId }).populate('room');
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

module.exports = router;
