const mongoose = require('mongoose');

const ownedPropertySchema = new mongoose.Schema({
  id: String, propertyType: String, address: String, area: String,
  surveyNumber: String, registrationNumber: String,
  registrationDate: String, marketValue: Number,
  ownerName: String, district: String, state: String
});

const saleDeedSchema = new mongoose.Schema({
  id: String, propertyId: String, deedNumber: String, date: String,
  sellerName: String, buyerName: String, saleAmount: Number,
  registrationOffice: String, stampDuty: Number
});

const transactionSchema = new mongoose.Schema({
  type: { type: String }, date: String, parties: String, details: String
});

const ecSchema = new mongoose.Schema({
  id: String, propertyId: String, ecNumber: String, fromDate: String,
  toDate: String, issueDate: String, transactions: [transactionSchema],
  status: String
});

const ptReceiptSchema = new mongoose.Schema({
  id: String, propertyId: String, receiptNumber: String,
  assessmentYear: String, amount: Number, paidDate: String,
  paymentMode: String, status: String
});
const propertySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ownedProperties: [ownedPropertySchema],
  saleDeeds: [saleDeedSchema],
  encumbranceCertificates: [ecSchema],
  propertyTaxReceipts: [ptReceiptSchema]
});

module.exports = mongoose.model('Property', propertySchema);
