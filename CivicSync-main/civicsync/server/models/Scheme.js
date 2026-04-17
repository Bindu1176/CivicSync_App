const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema({
  id: String, name: String, provider: String, amount: Number,
  status: String, appliedDate: String, validTill: String,
  category: String, description: String
});

const govtSchemeSchema = new mongoose.Schema({
  id: String, name: String, ministry: String, description: String,
  benefits: String, eligibility: String, status: String,
  appliedDate: String, amount: Number, category: String
});

const pensionSchema = new mongoose.Schema({
  id: String, type: { type: String }, pensionNumber: String, amount: Number,
  startDate: String, bankAccount: String, status: String,
  lastCredited: String, frequency: String
});

const agriSubsidySchema = new mongoose.Schema({
  id: String, name: String, amount: Number, season: String,
  year: String, status: String, disbursedDate: String,
  landArea: String, crop: String
});
const schemeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scholarships: [scholarshipSchema],
  govtSchemes: [govtSchemeSchema],
  pension: pensionSchema,
  agriculturalSubsidies: [agriSubsidySchema]
});

module.exports = mongoose.model('Scheme', schemeSchema);
