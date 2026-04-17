const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateOTP } = require('../utils/otpService');
const generateMockData = require('../utils/mockDataGenerator');

// Generate unique username like CS-XXXXXX
const generateUsername = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = 'CS-';
  for (let i = 0; i < 6; i++) id += chars.charAt(Math.floor(Math.random() * chars.length));
  return id;
};

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { fullName, mobile, email, dob, captcha } = req.body;
    if (!fullName || !mobile || !email || !dob) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    // Mock captcha verification
    if (!captcha || captcha.length < 1) {
      return res.status(400).json({ message: 'Please complete the captcha' });
    }
    const existingUser = await User.findOne({ $or: [{ mobile }, { email }] });
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: 'User already exists with this mobile or email' });
    }
    if (existingUser && !existingUser.isVerified) {
      await User.deleteOne({ _id: existingUser._id });
    }
    const otp = generateOTP(mobile);
    const user = new User({ fullName, mobile, email, dob, otp, otpExpiry: Date.now() + 5 * 60 * 1000 });
    await user.save();
    res.status(200).json({ message: 'OTP sent successfully', mobile, otp_hint: `Mock OTP: ${otp}` });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    const user = await User.findOne({ mobile });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    if (user.otp !== otp || Date.now() > user.otpExpiry) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    let username;
    let isUnique = false;
    while (!isUnique) {
      username = generateUsername();
      const exists = await User.findOne({ username });
      if (!exists) isUnique = true;
    }

    user.isVerified = true;
    user.username = username;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Generate mock data for the user
    await generateMockData(user._id, { fullName: user.fullName, dob: user.dob, mobile: user.mobile, email: user.email });

    res.status(200).json({ message: 'OTP verified successfully', username });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Server error during OTP verification' });
  }
});

// POST /api/auth/set-password
router.post('/set-password', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Username and password required' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.passwordSet = true;
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ message: 'Password set successfully', token, user: { id: user._id, fullName: user.fullName, username: user.username, email: user.email, mobile: user.mobile } });
  } catch (error) {
    console.error('Set password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.passwordSet) return res.status(400).json({ message: 'Please set your password first' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ token, user: { id: user._id, fullName: user.fullName, username: user.username, email: user.email, mobile: user.mobile } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { mobile } = req.body;
    const user = await User.findOne({ mobile, isVerified: true });
    if (!user) return res.status(404).json({ message: 'No verified account found with this mobile' });

    const otp = generateOTP(mobile);
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();
    res.status(200).json({ message: 'OTP sent to registered mobile', mobile, otp_hint: `Mock OTP: ${otp}` });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { mobile, otp, newPassword } = req.body;
    const user = await User.findOne({ mobile });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    if (user.otp !== otp || Date.now() > user.otpExpiry) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    res.status(200).json({ message: 'Password reset successfully', username: user.username });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/auth/me
router.get('/me', require('../middleware/auth'), async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password -otp -otpExpiry');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
