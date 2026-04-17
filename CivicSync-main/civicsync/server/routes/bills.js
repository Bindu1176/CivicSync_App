const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Bill = require('../models/Bill');
const Notification = require('../models/Notification');

router.get('/', auth, async (req, res) => {
  try {
    const data = await Bill.findOne({ userId: req.userId });
    if (!data) return res.status(404).json({ message: 'No bill data found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:submodule', auth, async (req, res) => {
  try {
    const data = await Bill.findOne({ userId: req.userId });
    if (!data) return res.status(404).json({ message: 'No bill data found' });
    const key = req.params.submodule;
    if (!data[key]) return res.status(404).json({ message: 'Submodule not found' });
    res.json(data[key]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/bills/pay — Mock UPI payment
router.post('/pay', auth, async (req, res) => {
  try {
    const { billType, billId, upiPin } = req.body;
    // Mock UPI PIN validation (any 4-6 digit PIN works)
    if (!upiPin || upiPin.length < 4) {
      return res.status(400).json({ message: 'Invalid UPI PIN' });
    }

    const data = await Bill.findOne({ userId: req.userId });
    if (!data) return res.status(404).json({ message: 'Bill data not found' });

    const bills = data[billType];
    if (!bills) return res.status(404).json({ message: 'Bill type not found' });

    const bill = Array.isArray(bills) ? bills.find(b => b.id === billId) : null;
    if (!bill) return res.status(404).json({ message: 'Bill not found' });

    const randNum = (len) => { let r = ''; for (let i = 0; i < len; i++) r += Math.floor(Math.random() * 10); return r; };
    bill.status = 'Paid';
    bill.paidDate = new Date().toISOString().split('T')[0];
    bill.transactionId = `TXN${randNum(12)}`;
    await data.save();

    await new Notification({
      userId: req.userId,
      title: 'Payment Successful',
      message: `Your ${billType} bill of ₹${bill.amount} has been paid successfully. Transaction ID: ${bill.transactionId}`,
      type: 'payment'
    }).save();

    res.json({
      message: 'Payment successful',
      transactionId: bill.transactionId,
      amount: bill.amount,
      billType,
      paidDate: bill.paidDate
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ message: 'Payment failed. Server error.' });
  }
});

module.exports = router;
