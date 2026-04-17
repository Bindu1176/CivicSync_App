const mongoose = require('mongoose');

const updateRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  module: { type: String, required: true },
  submodule: { type: String, required: true },
  fieldToUpdate: { type: String, required: true },
  oldValue: { type: String },
  newValue: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'In Review', 'Approved', 'Rejected'], default: 'Pending' },
  submittedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  remarks: { type: String }
});

module.exports = mongoose.model('UpdateRequest', updateRequestSchema);
