const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Certificate = require('../models/Certificate');

router.get('/', auth, async (req, res) => {
  try {
    const data = await Certificate.findOne({ userId: req.userId });
    if (!data) return res.status(404).json({ message: 'No certificate data found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:submodule', auth, async (req, res) => {
  try {
    const data = await Certificate.findOne({ userId: req.userId });
    if (!data) return res.status(404).json({ message: 'No certificate data found' });
    const key = req.params.submodule;
    if (!data[key]) return res.status(404).json({ message: 'Certificate type not found' });
    res.json(data[key]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
