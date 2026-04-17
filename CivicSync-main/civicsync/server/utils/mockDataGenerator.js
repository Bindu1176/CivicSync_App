const Identity = require('../models/Identity');
const HealthRecord = require('../models/HealthRecord');
const Transport = require('../models/Transport');
const Bill = require('../models/Bill');
const Certificate = require('../models/Certificate');
const Scheme = require('../models/Scheme');
const Property = require('../models/Property');
const Notification = require('../models/Notification');

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randEl = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randAlpha = (len) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let r = '';
  for (let i = 0; i < len; i++) r += chars[Math.floor(Math.random() * chars.length)];
  return r;
};
const randNum = (len) => {
  let r = '';
  for (let i = 0; i < len; i++) r += Math.floor(Math.random() * 10);
  return r;
};
const randDate = (startYear, endYear) => {
  const y = rand(startYear, endYear);
  const m = String(rand(1, 12)).padStart(2, '0');
  const d = String(rand(1, 28)).padStart(2, '0');
  return `${y}-${m}-${d}`;
};
const futureDate = (yearsAhead) => {
  const y = new Date().getFullYear() + rand(1, yearsAhead);
  const m = String(rand(1, 12)).padStart(2, '0');
  const d = String(rand(1, 28)).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const hospitals = ['Apollo Hospital', 'AIIMS Delhi', 'Fortis Healthcare', 'Max Super Specialty', 'Narayana Health', 'Manipal Hospital'];
const doctors = ['Dr. Sharma', 'Dr. Patel', 'Dr. Reddy', 'Dr. Gupta', 'Dr. Nair', 'Dr. Iyer', 'Dr. Singh'];
const cities = ['Bengaluru', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune'];
const states = ['Karnataka', 'Maharashtra', 'Delhi', 'Tamil Nadu', 'Telangana', 'West Bengal'];
const banks = ['SBI', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'PNB', 'Bank of Baroda'];
const providers = { electricity: ['BESCOM', 'TPDDL', 'MSEDCL'], gas: ['Indane', 'HP Gas', 'Bharat Gas'], water: ['BWSSB', 'Delhi Jal Board', 'MCGM'], broadband: ['BSNL', 'Airtel', 'JioFiber', 'ACT Fibernet'] };
const tollPlazas = ['Hoskote Toll', 'Tumkur Toll', 'Ramanagara Toll', 'Nelamangala Toll', 'Attibele Toll'];
const vehicleModels = ['Maruti Swift', 'Hyundai Creta', 'Tata Nexon', 'Honda City', 'Mahindra XUV700', 'Toyota Innova'];
const offences = ['Over Speeding', 'Signal Jumping', 'No Helmet', 'Wrong Parking', 'No Seat Belt'];

async function generateMockData(userId, userData) {
  const { fullName, dob, mobile, email } = userData;
  const dobStr = new Date(dob).toISOString().split('T')[0];
  const city = randEl(cities);
  const state = randEl(states);
  const fatherName = `${randEl(['Ramesh', 'Suresh', 'Mahesh', 'Rajesh', 'Ganesh'])} ${fullName.split(' ').pop() || 'Kumar'}`;
  const motherName = `${randEl(['Lakshmi', 'Saraswati', 'Padma', 'Anita', 'Sunita'])} ${fullName.split(' ').pop() || 'Devi'}`;
  const gender = randEl(['Male', 'Female']);
  const bloodGroup = randEl(['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-']);
  const address = `${rand(1,999)}, ${randEl(['MG Road', 'Brigade Road', 'Residency Road', 'Church Street', 'Lalbagh Road'])}, ${city}, ${state} - ${randNum(6)}`;

  // ====== IDENTITY ======
  const identity = new Identity({
    userId,
    aadhaar: {
      number: `${randNum(4)}-${randNum(4)}-${randNum(4)}`,
      name: fullName, dob: dobStr, gender, address,
      photo: 'aadhaar_photo', issueDate: randDate(2015, 2022)
    },
    pan: {
      number: `${randAlpha(5)}${randNum(4)}${randAlpha(1)}`,
      name: fullName, dob: dobStr, fatherName,
      issueDate: randDate(2010, 2022), type: 'Individual'
    },
    passport: {
      number: `${randAlpha(1)}${randNum(7)}`,
      name: fullName, dob: dobStr, nationality: 'Indian',
      issueDate: randDate(2018, 2023), expiryDate: futureDate(8),
      placeOfIssue: city
    },
    voterID: {
      number: `${randAlpha(3)}${randNum(7)}`,
      name: fullName, fatherName, gender,
      constituency: `${city} ${randEl(['North', 'South', 'East', 'West'])}`,
      state, issueDate: randDate(2015, 2023)
    },
    rationCard: {
      number: `RC${randNum(10)}`,
      headOfFamily: fullName, category: randEl(['APL', 'BPL', 'AAY', 'PHH']),
      members: [
        { name: fullName, age: rand(25, 55), relation: 'Self' },
        { name: fatherName, age: rand(55, 75), relation: 'Father' },
        { name: motherName, age: rand(50, 70), relation: 'Mother' }
      ],
      issueDate: randDate(2015, 2022)
    },
    abha: {
      number: `${randNum(2)}-${randNum(4)}-${randNum(4)}-${randNum(4)}`,
      name: fullName, dob: dobStr, gender,
      linkedHospitals: [randEl(hospitals), randEl(hospitals)],
      createdDate: randDate(2021, 2023)
    }
  });
  await identity.save();

  // ====== HEALTH RECORDS ======
  const healthRecord = new HealthRecord({
    userId,
    records: Array.from({ length: 4 }, (_, i) => ({
      id: `HR${randNum(6)}`, date: randDate(2020, 2024),
      hospital: randEl(hospitals), doctor: randEl(doctors),
      diagnosis: randEl(['Common Cold', 'Viral Fever', 'Migraine', 'Hypertension', 'Type 2 Diabetes', 'Allergic Rhinitis']),
      treatment: randEl(['Medication prescribed', 'Rest and fluids', 'Lab tests ordered', 'Follow-up in 2 weeks']),
      notes: 'Regular check-up completed'
    })),
    appointments: [
      { id: `APT${randNum(5)}`, date: futureDate(1), time: '10:30 AM', hospital: randEl(hospitals), doctor: randEl(doctors), department: 'General Medicine', status: 'Confirmed' },
      { id: `APT${randNum(5)}`, date: futureDate(1), time: '02:00 PM', hospital: randEl(hospitals), doctor: randEl(doctors), department: 'Cardiology', status: 'Pending' }
    ],
    vaccinations: [
      { id: `VAC${randNum(5)}`, name: 'COVID-19 Covishield', date: '2021-05-15', dose: '1st Dose', center: randEl(hospitals), batchNumber: `CV${randNum(8)}`, nextDueDate: '2021-07-15' },
      { id: `VAC${randNum(5)}`, name: 'COVID-19 Covishield', date: '2021-08-20', dose: '2nd Dose', center: randEl(hospitals), batchNumber: `CV${randNum(8)}`, nextDueDate: '2022-08-20' },
      { id: `VAC${randNum(5)}`, name: 'COVID-19 Booster', date: '2022-04-10', dose: 'Precautionary', center: randEl(hospitals), batchNumber: `CV${randNum(8)}`, nextDueDate: 'N/A' },
      { id: `VAC${randNum(5)}`, name: 'Influenza', date: '2023-10-05', dose: 'Annual', center: randEl(hospitals), batchNumber: `IF${randNum(6)}`, nextDueDate: '2024-10-05' }
    ],
    bloodDonations: [
      { id: `BD${randNum(5)}`, date: randDate(2021, 2023), center: `${randEl(cities)} Blood Bank`, bloodGroup, units: 1, certificate: `BDC${randNum(8)}` },
      { id: `BD${randNum(5)}`, date: randDate(2023, 2024), center: `Red Cross ${randEl(cities)}`, bloodGroup, units: 1, certificate: `BDC${randNum(8)}` }
    ],
    prescriptions: [
      {
        id: `PRE${randNum(5)}`, date: randDate(2024, 2024), doctor: randEl(doctors), hospital: randEl(hospitals),
        medicines: [
          { name: 'Paracetamol 500mg', dosage: '1 tablet twice daily', duration: '5 days' },
          { name: 'Cetirizine 10mg', dosage: '1 tablet at night', duration: '7 days' }
        ],
        isActive: true
      },
      {
        id: `PRE${randNum(5)}`, date: randDate(2023, 2024), doctor: randEl(doctors), hospital: randEl(hospitals),
        medicines: [
          { name: 'Amoxicillin 250mg', dosage: '1 capsule thrice daily', duration: '7 days' },
          { name: 'Omeprazole 20mg', dosage: '1 capsule before breakfast', duration: '14 days' }
        ],
        isActive: false
      }
    ]
  });
  await healthRecord.save();

  // ====== TRANSPORT ======
  const vehicleNum = `${randAlpha(2)}${randNum(2)}${randAlpha(2)}${randNum(4)}`;
  const transport = new Transport({
    userId,
    drivingLicense: {
      number: `${randAlpha(2)}${randNum(13)}`,
      name: fullName, dob: dobStr, bloodGroup,
      issueDate: randDate(2015, 2022), expiryDate: futureDate(10),
      vehicleClasses: ['LMV', 'MCWG'],
      rtoCode: `${randAlpha(2)}${randNum(2)}`, address
    },
    vehicleRC: [{
      number: vehicleNum, ownerName: fullName,
      vehicleModel: randEl(vehicleModels), vehicleType: 'LMV',
      fuelType: randEl(['Petrol', 'Diesel', 'Electric', 'CNG']),
      registrationDate: randDate(2018, 2023), expiryDate: futureDate(12),
      engineNumber: `ENG${randAlpha(2)}${randNum(8)}`,
      chassisNumber: `CHS${randAlpha(3)}${randNum(10)}`,
      color: randEl(['White', 'Black', 'Silver', 'Red', 'Blue'])
    }],
    challans: Array.from({ length: 3 }, () => ({
      id: `CH${randNum(8)}`, date: randDate(2022, 2024),
      vehicleNumber: vehicleNum, offence: randEl(offences),
      amount: randEl([500, 1000, 2000, 5000]),
      location: `${randEl(['MG Road', 'Ring Road', 'NH44', 'Outer Ring Road'])}, ${city}`,
      status: randEl(['Paid', 'Paid', 'Unpaid']),
      paidDate: randDate(2022, 2024)
    })),
    fastag: {
      id: `FT${randNum(10)}`, vehicleNumber: vehicleNum,
      bankName: randEl(banks), balance: rand(200, 5000),
      transactions: Array.from({ length: 5 }, () => ({
        id: `FTX${randNum(8)}`, date: randDate(2023, 2024),
        tollPlaza: randEl(tollPlazas), amount: rand(50, 250),
        balance: rand(500, 5000)
      }))
    },
    bookings: [
      {
        id: `BK${randNum(8)}`, type: 'Train', from: city, to: randEl(cities.filter(c => c !== city)),
        date: futureDate(1), passengers: rand(1, 4), status: 'Confirmed',
        pnr: randNum(10), fare: rand(500, 3000), seatNumbers: [`S${rand(1,6)}/${rand(1,72)}`]
      },
      {
        id: `BK${randNum(8)}`, type: 'Bus', from: city, to: randEl(cities.filter(c => c !== city)),
        date: futureDate(1), passengers: rand(1, 3), status: 'Confirmed',
        pnr: `BUS${randNum(8)}`, fare: rand(200, 1500), seatNumbers: [`${rand(1,40)}`]
      }
    ]
  });
  await transport.save();

  // ====== BILLS ======
  const billMonths = ['2024-01', '2024-02', '2024-03', '2023-12', '2023-11'];
  const bill = new Bill({
    userId,
    electricity: billMonths.map((m, i) => ({
      id: `EB${randNum(8)}`, provider: randEl(providers.electricity),
      consumerNumber: `EC${randNum(10)}`, billDate: `${m}-05`,
      dueDate: `${m}-20`, amount: rand(800, 3500), units: rand(100, 500),
      status: i < 2 ? 'Unpaid' : 'Paid', paidDate: i < 2 ? '' : `${m}-18`,
      transactionId: i < 2 ? '' : `TXN${randNum(12)}`
    })),
    gas: billMonths.slice(0, 3).map((m, i) => ({
      id: `GB${randNum(8)}`, provider: randEl(providers.gas),
      consumerNumber: `GC${randNum(8)}`, billDate: `${m}-10`,
      dueDate: `${m}-25`, amount: rand(400, 1200),
      status: i < 1 ? 'Unpaid' : 'Paid', paidDate: i < 1 ? '' : `${m}-22`,
      transactionId: i < 1 ? '' : `TXN${randNum(12)}`
    })),
    water: billMonths.slice(0, 3).map((m, i) => ({
      id: `WB${randNum(8)}`, provider: randEl(providers.water),
      consumerNumber: `WC${randNum(8)}`, billDate: `${m}-01`,
      dueDate: `${m}-15`, amount: rand(200, 800),
      status: i < 1 ? 'Unpaid' : 'Paid', paidDate: i < 1 ? '' : `${m}-14`,
      transactionId: i < 1 ? '' : `TXN${randNum(12)}`
    })),
    propertyTax: [{
      id: `PT${randNum(8)}`, propertyId: `PROP${randNum(6)}`,
      assessmentYear: '2024-25', billDate: '2024-04-01',
      dueDate: '2024-06-30', amount: rand(5000, 25000),
      status: 'Unpaid', paidDate: '', transactionId: ''
    }],
    broadband: billMonths.slice(0, 3).map((m, i) => ({
      id: `BB${randNum(8)}`, provider: randEl(providers.broadband),
      accountNumber: `BB${randNum(10)}`, plan: randEl(['100 Mbps', '200 Mbps', '300 Mbps']),
      billDate: `${m}-01`, dueDate: `${m}-10`, amount: rand(600, 2000),
      status: i < 1 ? 'Unpaid' : 'Paid', paidDate: i < 1 ? '' : `${m}-08`,
      transactionId: i < 1 ? '' : `TXN${randNum(12)}`
    }))
  });
  await bill.save();

  // ====== CERTIFICATES ======
  const certificate = new Certificate({
    userId,
    sslc: {
      number: `SSLC${randNum(8)}`, name: fullName,
      school: `${randEl(['St. Joseph', 'DPS', 'KV', 'Vidya Mandir', 'Ryan International'])} School, ${city}`,
      board: randEl(['CBSE', 'ICSE', 'State Board']), year: String(rand(2005, 2015)),
      percentage: rand(60, 98), grade: randEl(['A1', 'A2', 'B1', 'B2']),
      subjects: [
        { name: 'Mathematics', marks: rand(60, 100) }, { name: 'Science', marks: rand(60, 100) },
        { name: 'English', marks: rand(60, 100) }, { name: 'Social Studies', marks: rand(60, 100) },
        { name: 'Hindi', marks: rand(60, 100) }
      ]
    },
    puc: {
      number: `PUC${randNum(8)}`, name: fullName,
      college: `${randEl(['MES', 'Christ', 'St. Xavier', 'Loyola', 'Presidency'])} College, ${city}`,
      board: randEl(['CBSE', 'State PU Board']), year: String(rand(2007, 2017)),
      percentage: rand(55, 96), stream: randEl(['Science', 'Commerce', 'Arts']),
      subjects: [
        { name: 'Physics', marks: rand(50, 100) }, { name: 'Chemistry', marks: rand(50, 100) },
        { name: 'Mathematics', marks: rand(50, 100) }, { name: 'English', marks: rand(50, 100) }
      ]
    },
    degree: {
      number: `DEG${randNum(8)}`, name: fullName,
      university: randEl(['Bangalore University', 'VTU', 'Mumbai University', 'Anna University', 'Delhi University']),
      college: `${randEl(['BMS', 'RV', 'PES', 'BITS', 'NIT'])} College of Engineering`,
      year: String(rand(2012, 2022)), cgpa: (rand(60, 95) / 10).toFixed(1),
      degree: randEl(['B.Tech', 'B.E.', 'B.Sc', 'B.Com', 'BBA']),
      specialization: randEl(['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Information Science'])
    },
    birthCertificate: {
      number: `BC${randNum(10)}`, name: fullName, dob: dobStr,
      placeOfBirth: `${randEl(['Government Hospital', 'District Hospital', 'City Hospital'])}, ${city}`,
      fatherName, motherName, registrationDate: dobStr,
      municipality: `${city} Municipal Corporation`
    },
    casteCertificate: {
      number: `CC${randNum(8)}`, name: fullName,
      caste: randEl(['General', 'OBC', 'SC', 'ST']),
      subCaste: randEl(['Category A', 'Category B', 'Category 1']),
      fatherName, issueDate: randDate(2018, 2023),
      issuingAuthority: `Tahsildar, ${city}`, district: city, state
    },
    incomeCertificate: {
      number: `IC${randNum(8)}`, name: fullName,
      annualIncome: randEl([150000, 250000, 450000, 600000, 800000]),
      fatherName, issueDate: randDate(2023, 2024),
      issuingAuthority: `Revenue Department, ${city}`,
      purpose: 'General Purpose', validUpto: futureDate(1)
    },
    domicileCertificate: {
      number: `DC${randNum(8)}`, name: fullName, fatherName,
      address, district: city, state,
      issueDate: randDate(2018, 2023),
      issuingAuthority: `District Magistrate, ${city}`,
      residingSince: String(rand(1990, 2015))
    },
    marriageCertificate: {
      number: `MC${randNum(8)}`,
      groomName: gender === 'Male' ? fullName : `${randEl(['Rahul', 'Amit', 'Vikram', 'Arjun'])} Kumar`,
      brideName: gender === 'Female' ? fullName : `${randEl(['Priya', 'Ananya', 'Deepika', 'Sneha'])} Sharma`,
      marriageDate: randDate(2015, 2023),
      placeOfMarriage: `${randEl(['Convention Center', 'Temple', 'Community Hall'])}, ${city}`,
      registrationDate: randDate(2015, 2023),
      registrationPlace: `Sub-Registrar Office, ${city}`,
      witnessNames: [`${randEl(['Vikram', 'Sunil', 'Anil'])} Singh`, `${randEl(['Meera', 'Kavita', 'Rekha'])} Devi`]
    }
  });
  await certificate.save();

  // ====== SCHEMES ======
  const scheme = new Scheme({
    userId,
    scholarships: [
      { id: `SCH${randNum(6)}`, name: 'National Merit Scholarship', provider: 'Ministry of Education', amount: 50000, status: 'Active', appliedDate: randDate(2023, 2024), validTill: futureDate(2), category: 'Merit', description: 'For students with exceptional academic performance' },
      { id: `SCH${randNum(6)}`, name: 'Post-Matric Scholarship for SC/ST', provider: 'Ministry of Social Justice', amount: 30000, status: 'Active', appliedDate: randDate(2023, 2024), validTill: futureDate(1), category: 'Category', description: 'Financial assistance for higher education' },
      { id: `SCH${randNum(6)}`, name: 'State Merit Scholarship', provider: `${state} Govt.`, amount: 25000, status: 'Disbursed', appliedDate: randDate(2022, 2023), validTill: randDate(2023, 2024), category: 'Merit', description: 'State level merit-based scholarship' }
    ],
    govtSchemes: [
      { id: `GS${randNum(6)}`, name: 'PM Kisan Samman Nidhi', ministry: 'Ministry of Agriculture', description: 'Direct income support to farmer families', benefits: '₹6,000 per year in 3 installments', eligibility: 'Small and marginal farmers', status: 'Active', appliedDate: randDate(2022, 2024), amount: 6000, category: 'Agriculture' },
      { id: `GS${randNum(6)}`, name: 'Ayushman Bharat PMJAY', ministry: 'Ministry of Health', description: 'Health insurance scheme for poor families', benefits: 'Up to ₹5,00,000 health cover', eligibility: 'Below poverty line families', status: 'Active', appliedDate: randDate(2021, 2023), amount: 500000, category: 'Health' },
      { id: `GS${randNum(6)}`, name: 'PM Awas Yojana', ministry: 'Ministry of Housing', description: 'Affordable housing for all', benefits: 'Subsidy up to ₹2,67,000', eligibility: 'EWS/LIG/MIG categories', status: 'Applied', appliedDate: randDate(2023, 2024), amount: 267000, category: 'Housing' }
    ],
    pension: {
      id: `PEN${randNum(6)}`, type: 'Atal Pension Yojana', pensionNumber: `APY${randNum(10)}`,
      amount: rand(1000, 5000), startDate: randDate(2020, 2023),
      bankAccount: `${randNum(4)}XXXX${randNum(4)}`, status: 'Active',
      lastCredited: randDate(2024, 2024), frequency: 'Monthly'
    },
    agriculturalSubsidies: [
      { id: `AGS${randNum(6)}`, name: 'Fertilizer Subsidy', amount: rand(5000, 15000), season: 'Kharif', year: '2024', status: 'Disbursed', disbursedDate: randDate(2024, 2024), landArea: `${rand(1, 10)} acres`, crop: randEl(['Rice', 'Wheat', 'Cotton', 'Sugarcane']) },
      { id: `AGS${randNum(6)}`, name: 'Seed Subsidy', amount: rand(2000, 8000), season: 'Rabi', year: '2024', status: 'Pending', disbursedDate: '', landArea: `${rand(1, 5)} acres`, crop: randEl(['Mustard', 'Gram', 'Lentil']) }
    ]
  });
  await scheme.save();

  // ====== PROPERTY ======
  const propId1 = `PROP${randNum(8)}`;
  const propId2 = `PROP${randNum(8)}`;
  const property = new Property({
    userId,
    ownedProperties: [
      { id: propId1, propertyType: 'Residential', address: `${rand(1,100)}, ${randEl(['Jayanagar', 'Koramangala', 'Indiranagar', 'Whitefield', 'Bandra'])}, ${city}`, area: `${rand(800, 2400)} sq.ft`, surveyNumber: `SY${randNum(5)}/${randNum(2)}`, registrationNumber: `REG${randNum(10)}`, registrationDate: randDate(2010, 2022), marketValue: rand(3000000, 15000000), ownerName: fullName, district: city, state },
      { id: propId2, propertyType: 'Agricultural', address: `Survey No. ${randNum(3)}, ${randEl(['Tumkur', 'Mandya', 'Hassan', 'Mysore'])} Taluk`, area: `${rand(1, 10)} acres`, surveyNumber: `SY${randNum(5)}/${randNum(2)}`, registrationNumber: `REG${randNum(10)}`, registrationDate: randDate(2005, 2020), marketValue: rand(1000000, 8000000), ownerName: fullName, district: city, state }
    ],
    saleDeeds: [{
      id: `SD${randNum(8)}`, propertyId: propId1, deedNumber: `SD${randNum(10)}`,
      date: randDate(2015, 2022), sellerName: `${randEl(['Mohan', 'Ravi', 'Prakash'])} ${randEl(['Kumar', 'Singh', 'Reddy'])}`,
      buyerName: fullName, saleAmount: rand(2000000, 12000000),
      registrationOffice: `Sub-Registrar Office, ${city}`, stampDuty: rand(100000, 500000)
    }],
    encumbranceCertificates: [{
      id: `EC${randNum(8)}`, propertyId: propId1, ecNumber: `EC${randNum(10)}`,
      fromDate: randDate(2010, 2015), toDate: randDate(2023, 2024),
      issueDate: randDate(2024, 2024),
      transactions: [
        { type: 'Sale', date: randDate(2015, 2020), parties: `${fullName} / Previous Owner`, details: 'Sale deed registered' },
        { type: 'Mortgage', date: randDate(2020, 2023), parties: `${fullName} / ${randEl(banks)}`, details: 'Home loan mortgage' }
      ],
      status: 'Encumbered'
    }],
    propertyTaxReceipts: [
      { id: `PTR${randNum(8)}`, propertyId: propId1, receiptNumber: `PTR${randNum(10)}`, assessmentYear: '2023-24', amount: rand(5000, 20000), paidDate: randDate(2023, 2024), paymentMode: 'Online', status: 'Paid' },
      { id: `PTR${randNum(8)}`, propertyId: propId1, receiptNumber: `PTR${randNum(10)}`, assessmentYear: '2024-25', amount: rand(5000, 20000), paidDate: '', paymentMode: '', status: 'Unpaid' }
    ]
  });
  await property.save();

  // ====== WELCOME NOTIFICATIONS ======
  const notifications = [
    { userId, title: 'Welcome to CivicSync!', message: 'Your digital civic identity has been created. Explore all 7 modules to manage your documents, bills, and more.', type: 'general' },
    { userId, title: 'Scheme Eligibility Available', message: 'Check your eligibility for government schemes by clicking the "Check Eligibility" button on the dashboard.', type: 'scheme' },
    { userId, title: 'Pending Bills', message: 'You have unpaid electricity and gas bills. Visit Pay Bills to clear them.', type: 'payment' }
  ];
  await Notification.insertMany(notifications);

  console.log(`[MOCK DATA] Generated all mock data for user: ${fullName} (${userId})`);
}

module.exports = generateMockData;
