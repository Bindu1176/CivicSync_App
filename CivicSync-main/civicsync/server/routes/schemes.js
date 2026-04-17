const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Scheme = require('../models/Scheme');

router.get('/', auth, async (req, res) => {
  try {
    const data = await Scheme.findOne({ userId: req.userId });
    if (!data) return res.status(404).json({ message: 'No scheme data found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:submodule', auth, async (req, res) => {
  try {
    const data = await Scheme.findOne({ userId: req.userId });
    if (!data) return res.status(404).json({ message: 'No scheme data found' });
    const key = req.params.submodule;
    if (!data[key]) return res.status(404).json({ message: 'Scheme type not found' });
    res.json(data[key]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
