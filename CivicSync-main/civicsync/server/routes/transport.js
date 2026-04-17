const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transport = require('../models/Transport');

router.get('/', auth, async (req, res) => {
  try {
    const data = await Transport.findOne({ userId: req.userId });
    if (!data) return res.status(404).json({ message: 'No transport data found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:submodule', auth, async (req, res) => {
  try {
    const data = await Transport.findOne({ userId: req.userId });
    if (!data) return res.status(404).json({ message: 'No transport data found' });
    const map = { drivingLicense: 'drivingLicense', vehicleRC: 'vehicleRC', challans: 'challans', fastag: 'fastag', bookings: 'bookings' };
    const key = map[req.params.submodule];
    if (!key) return res.status(404).json({ message: 'Submodule not found' });
    res.json(data[key]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/transport/book - Book a ticket
router.post('/book', auth, async (req, res) => {
  try {
    const { type, from, to, date, passengers } = req.body;
    const data = await Transport.findOne({ userId: req.userId });
    const randNum = (len) => { let r = ''; for (let i = 0; i < len; i++) r += Math.floor(Math.random() * 10); return r; };
    const newBooking = {
      id: `BK${randNum(8)}`, type, from, to, date,
      passengers, status: 'Confirmed', pnr: randNum(10),
      fare: Math.floor(Math.random() * 2000 + 500),
      seatNumbers: Array.from({ length: passengers }, (_, i) => `S${Math.floor(Math.random()*6+1)}/${Math.floor(Math.random()*72+1)}`)
    };
    data.bookings.push(newBooking);
    await data.save();
    res.json({ message: 'Ticket booked successfully', booking: newBooking });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
