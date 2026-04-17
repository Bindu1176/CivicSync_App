const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  dob: { type: Date, required: true },
  username: { type: String, unique: true, sparse: true },
  password: { type: String },
  otp: { type: String },
  otpExpiry: { type: Date },
  isVerified: { type: Boolean, default: false },
  passwordSet: { type: Boolean, default: false },
  eligibility: {
    caste: { type: String, default: '' },
    income: { type: Number, default: 0 },
    disability: { type: Boolean, default: false },
    state: { type: String, default: '' },
    gender: { type: String, default: '' },
    age: { type: Number, default: 0 }
  },
  eligibleSchemes: [{ type: mongoose.Schema.Types.Mixed }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
