const mongoose = require('mongoose');

const vehicleRCSchema = new mongoose.Schema({
  number: String, ownerName: String, vehicleModel: String,
  vehicleType: String, fuelType: String, registrationDate: String,
  expiryDate: String, engineNumber: String, chassisNumber: String,
  color: String
});

const challanSchema = new mongoose.Schema({
  id: String, date: String, vehicleNumber: String, offence: String,
  amount: Number, location: String, status: String, paidDate: String
});

const transactionSchema = new mongoose.Schema({
  id: String, date: String, tollPlaza: String, amount: Number, balance: Number
});

const bookingSchema = new mongoose.Schema({
  id: String, type: String, from: String, to: String,
  date: String, passengers: Number, status: String,
  pnr: String, fare: Number, seatNumbers: [String]
});
const transportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  drivingLicense: {
    number: String, name: String, dob: String, bloodGroup: String,
    issueDate: String, expiryDate: String, vehicleClasses: [String],
    rtoCode: String, address: String
  },
  vehicleRC: [vehicleRCSchema],
  challans: [challanSchema],
  fastag: {
    id: String, vehicleNumber: String, bankName: String, balance: Number,
    transactions: [transactionSchema]
  },
  bookings: [bookingSchema]
});

module.exports = mongoose.model('Transport', transportSchema);
