require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/identity', require('./routes/identity'));
app.use('/api/health', require('./routes/health'));
app.use('/api/transport', require('./routes/transport'));
app.use('/api/bills', require('./routes/bills'));
app.use('/api/certificates', require('./routes/certificates'));
app.use('/api/schemes', require('./routes/schemes'));
app.use('/api/property', require('./routes/property'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/eligibility', require('./routes/eligibility'));
app.use('/api/chatbot', require('./routes/chatbot'));
app.use('/api/progress', require('./routes/progress'));

// Health check
app.get('/api/health-check', (req, res) => {
  res.json({ status: 'OK', message: 'CivicSync API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 CivicSync Server running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api/health-check\n`);
});
