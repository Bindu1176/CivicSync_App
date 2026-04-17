const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const HealthRecord = require('../models/HealthRecord');

router.get('/', auth, async (req, res) => {
  try {
    const data = await HealthRecord.findOne({ userId: req.userId });
    if (!data) return res.status(404).json({ message: 'No health records found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:submodule', auth, async (req, res) => {
  try {
    const data = await HealthRecord.findOne({ userId: req.userId });
    if (!data) return res.status(404).json({ message: 'No health records found' });
    const map = { records: 'records', appointments: 'appointments', vaccinations: 'vaccinations', bloodDonations: 'bloodDonations', prescriptions: 'prescriptions' };
    const key = map[req.params.submodule];
    if (!key) return res.status(404).json({ message: 'Submodule not found' });
    res.json(data[key]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
