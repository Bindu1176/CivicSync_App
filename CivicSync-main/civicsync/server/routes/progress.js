const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const UpdateRequest = require('../models/UpdateRequest');

// GET /api/progress — Get all update requests and their status
router.get('/', auth, async (req, res) => {
  try {
    const requests = await UpdateRequest.find({ userId: req.userId }).sort({ submittedAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Simulate status progression
router.post('/simulate/:id', auth, async (req, res) => {
  try {
    const request = await UpdateRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    const statusFlow = ['Pending', 'In Review', 'Approved'];
    const currentIndex = statusFlow.indexOf(request.status);
    if (currentIndex < statusFlow.length - 1) {
      request.status = statusFlow[currentIndex + 1];
      request.updatedAt = new Date();
      await request.save();
    }
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
