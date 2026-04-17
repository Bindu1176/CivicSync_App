const mongoose = require('mongoose');

const identitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  aadhaar: {
    number: String, name: String, dob: String, gender: String,
    address: String, photo: String, issueDate: String
  },
  pan: {
    number: String, name: String, dob: String, fatherName: String,
    issueDate: String, type: { type: String, default: 'Individual' }
  },
  passport: {
    number: String, name: String, dob: String, nationality: String,
    issueDate: String, expiryDate: String, placeOfIssue: String
  },
  voterID: {
    number: String, name: String, fatherName: String, gender: String,
    constituency: String, state: String, issueDate: String
  },
  rationCard: {
    number: String, headOfFamily: String, category: String,
    members: [{ name: String, age: Number, relation: String }],
    issueDate: String
  },
  abha: {
    number: String, name: String, dob: String, gender: String,
    linkedHospitals: [String], createdDate: String
  }
});

module.exports = mongoose.model('Identity', identitySchema);
