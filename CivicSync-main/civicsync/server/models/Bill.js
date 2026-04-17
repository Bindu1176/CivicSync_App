const mongoose = require('mongoose');

const utilBillSchema = new mongoose.Schema({
  id: String, provider: String, consumerNumber: String, billDate: String,
  dueDate: String, amount: Number, units: Number, status: String,
  paidDate: String, transactionId: String
});

const gasWaterBillSchema = new mongoose.Schema({
  id: String, provider: String, consumerNumber: String, billDate: String,
  dueDate: String, amount: Number, status: String,
  paidDate: String, transactionId: String
});

const propTaxBillSchema = new mongoose.Schema({
  id: String, propertyId: String, assessmentYear: String, billDate: String,
  dueDate: String, amount: Number, status: String,
  paidDate: String, transactionId: String
});

const broadbandBillSchema = new mongoose.Schema({
  id: String, provider: String, accountNumber: String, plan: String,
  billDate: String, dueDate: String, amount: Number, status: String,
  paidDate: String, transactionId: String
});
const billSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  electricity: [utilBillSchema],
  gas: [gasWaterBillSchema],
  water: [gasWaterBillSchema],
  propertyTax: [propTaxBillSchema],
  broadband: [broadbandBillSchema]
});

module.exports = mongoose.model('Bill', billSchema);
