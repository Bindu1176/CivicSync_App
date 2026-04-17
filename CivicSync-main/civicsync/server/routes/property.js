const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Property = require('../models/Property');

router.get('/', auth, async (req, res) => {
  try {
    const data = await Property.findOne({ userId: req.userId });
    if (!data) return res.status(404).json({ message: 'No property data found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:submodule', auth, async (req, res) => {
  try {
    const data = await Property.findOne({ userId: req.userId });
    if (!data) return res.status(404).json({ message: 'No property data found' });
    const map = {
      ownedProperties: 'ownedProperties', saleDeeds: 'saleDeeds',
      encumbranceCertificates: 'encumbranceCertificates',
      propertyTaxReceipts: 'propertyTaxReceipts'
    };
    const key = map[req.params.submodule];
    if (!key) return res.status(404).json({ message: 'Submodule not found' });
    res.json(data[key]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
