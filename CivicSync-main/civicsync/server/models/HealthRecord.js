const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  id: String, date: String, hospital: String, doctor: String,
  diagnosis: String, treatment: String, notes: String
});

const appointmentSchema = new mongoose.Schema({
  id: String, date: String, time: String, hospital: String,
  doctor: String, department: String, status: String
});

const vaccinationSchema = new mongoose.Schema({
  id: String, name: String, date: String, dose: String,
  center: String, batchNumber: String, nextDueDate: String
});

const bloodDonationSchema = new mongoose.Schema({
  id: String, date: String, center: String, bloodGroup: String,
  units: Number, certificate: String
});

const medicineSchema = new mongoose.Schema({
  name: String, dosage: String, duration: String
});

const prescriptionSchema = new mongoose.Schema({
  id: String, date: String, doctor: String, hospital: String,
  medicines: [medicineSchema],
  isActive: Boolean
});
const healthRecordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  records: [recordSchema],
  appointments: [appointmentSchema],
  vaccinations: [vaccinationSchema],
  bloodDonations: [bloodDonationSchema],
  prescriptions: [prescriptionSchema]
});

module.exports = mongoose.model('HealthRecord', healthRecordSchema);
