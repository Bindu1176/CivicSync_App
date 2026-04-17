const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: String, marks: Number
});
const certificateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sslc: {
    number: String, name: String, school: String, board: String,
    year: String, percentage: Number, grade: String, subjects: [subjectSchema]
  },
  puc: {
    number: String, name: String, college: String, board: String,
    year: String, percentage: Number, stream: String, subjects: [subjectSchema]
  },
  degree: {
    number: String, name: String, university: String, college: String,
    year: String, cgpa: Number, degree: String, specialization: String
  },
  birthCertificate: {
    number: String, name: String, dob: String, placeOfBirth: String,
    fatherName: String, motherName: String, registrationDate: String,
    municipality: String
  },
  casteCertificate: {
    number: String, name: String, caste: String, subCaste: String,
    fatherName: String, issueDate: String, issuingAuthority: String,
    district: String, state: String
  },
  incomeCertificate: {
    number: String, name: String, annualIncome: Number, fatherName: String,
    issueDate: String, issuingAuthority: String, purpose: String,
    validUpto: String
  },
  domicileCertificate: {
    number: String, name: String, fatherName: String, address: String,
    district: String, state: String, issueDate: String,
    issuingAuthority: String, residingSince: String
  },
  marriageCertificate: {
    number: String, groomName: String, brideName: String,
    marriageDate: String, placeOfMarriage: String,
    registrationDate: String, registrationPlace: String,
    witnessNames: [String]
  }
});

module.exports = mongoose.model('Certificate', certificateSchema);
