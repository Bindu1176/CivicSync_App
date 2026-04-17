const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Identity = require('../models/Identity');
const UpdateRequest = require('../models/UpdateRequest');
const Notification = require('../models/Notification');

// GET /api/identity — Get all identity documents
router.get('/', auth, async (req, res) => {
  try {
    const data = await Identity.findOne({ userId: req.userId });
    if (!data) return res.status(404).json({ message: 'No identity data found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/identity/:submodule — Get specific identity document
router.get('/:submodule', auth, async (req, res) => {
  try {
    const data = await Identity.findOne({ userId: req.userId });
    if (!data) return res.status(404).json({ message: 'No identity data found' });
    const subData = data[req.params.submodule];
    if (!subData) return res.status(404).json({ message: 'Submodule not found' });
    res.json(subData);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/identity/update-request — Request document update
router.post('/update-request', auth, async (req, res) => {
  try {
    const { submodule, fieldToUpdate, oldValue, newValue, password } = req.body;
    // Re-authentication by verifying password
    const User = require('../models/User');
    const bcrypt = require('bcryptjs');
    const user = await User.findById(req.userId);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Authentication failed. Wrong password.' });

    const request = new UpdateRequest({
      userId: req.userId, module: 'identity', submodule,
      fieldToUpdate, oldValue, newValue
    });
    await request.save();

    await new Notification({
      userId: req.userId, title: 'Update Request Submitted',
      message: `Your request to update ${fieldToUpdate} in ${submodule} has been submitted and is pending review.`,
      type: 'update', link: `/progress`
    }).save();

    res.json({ message: 'Update request submitted successfully', requestId: request._id, status: request.status });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
