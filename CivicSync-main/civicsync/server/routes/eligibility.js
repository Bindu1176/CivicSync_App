const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Notification = require('../models/Notification');

// All available schemes for eligibility matching
const allSchemes = [
  { id: 'sch1', name: 'PM Kisan Samman Nidhi', category: 'Agriculture', income: 300000, description: '₹6,000/year for farmer families', icon: '🌾' },
  { id: 'sch2', name: 'Ayushman Bharat PMJAY', category: 'Health', income: 500000, description: 'Health cover up to ₹5 lakhs', icon: '🏥' },
  { id: 'sch3', name: 'PM Awas Yojana', category: 'Housing', income: 600000, description: 'Affordable housing subsidy', icon: '🏠' },
  { id: 'sch4', name: 'Ujjwala Yojana', category: 'Welfare', income: 200000, description: 'Free LPG connection for BPL families', icon: '🔥' },
  { id: 'sch5', name: 'Post-Matric SC/ST Scholarship', category: 'Education', caste: ['SC', 'ST'], description: 'Scholarship for SC/ST students', icon: '📚' },
  { id: 'sch6', name: 'OBC Pre-Matric Scholarship', category: 'Education', caste: ['OBC'], description: 'Scholarship for OBC students', icon: '🎓' },
  { id: 'sch7', name: 'Disability Pension Scheme', category: 'Disability', disability: true, description: 'Monthly pension for disabled persons', icon: '♿' },
  { id: 'sch8', name: 'Sukanya Samriddhi Yojana', category: 'Savings', gender: 'Female', description: 'Savings scheme for girl child', icon: '👧' },
  { id: 'sch9', name: 'PM Vishwakarma Yojana', category: 'Skill', income: 400000, description: 'Support for traditional artisans', icon: '🔧' },
  { id: 'sch10', name: 'National Social Assistance Programme', category: 'Welfare', income: 200000, description: 'Social security for elderly/disabled/widows', icon: '🤝' },
  { id: 'sch11', name: 'Atal Pension Yojana', category: 'Pension', income: 500000, description: 'Pension scheme for unorganized sector', icon: '💰' },
  { id: 'sch12', name: 'PM Mudra Yojana', category: 'Business', income: 500000, description: 'Micro loans up to ₹10 lakhs', icon: '📈' }
];

router.post('/check', auth, async (req, res) => {
  try {
    const { caste, income, disability, state, gender, age } = req.body;

    const eligible = allSchemes.filter(scheme => {
      let match = true;
      if (scheme.income && income > scheme.income) match = false;
      if (scheme.caste && !scheme.caste.includes(caste)) match = false;
      if (scheme.disability && !disability) match = false;
      if (scheme.gender && gender !== scheme.gender) match = false;
      return match;
    });

    // Save to user profile
    const user = await User.findById(req.userId);
    user.eligibility = { caste, income, disability, state, gender, age };
    user.eligibleSchemes = eligible;
    await user.save();

    await new Notification({
      userId: req.userId,
      title: 'Eligibility Check Complete',
      message: `You are eligible for ${eligible.length} government schemes! Check your dashboard for details.`,
      type: 'scheme'
    }).save();

    res.json({ eligible, totalMatched: eligible.length });
  } catch (error) {
    console.error('Eligibility check error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/results', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json({ eligible: user.eligibleSchemes || [], eligibility: user.eligibility });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
