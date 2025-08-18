const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Know Your Home API',
    version: '1.0.0',
    status: 'running'
  });
});

// Basic routes
app.get('/api/brands', (req, res) => {
  res.json([
    { id: 1, name: 'Samsung', helpline: '1800-40-7267864' },
    { id: 2, name: 'LG', helpline: '1800-315-9999' },
    { id: 3, name: 'Whirlpool', helpline: '1800-208-1800' }
  ]);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API running on port ${PORT}`);
});
