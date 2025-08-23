const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Know Your Home API',
    status: 'running',
    database: 'connected',
    endpoints: {
      health: '/health',
      api: '/api',
      brands: '/api/brands',
      dbTest: '/api/db-test'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Know Your Home API',
    version: '1.0.0',
    status: 'running',
    database: 'PostgreSQL'
  });
});

// Test database connection
app.get('/api/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      database: 'connected',
      time: result.rows[0].now
    });
  } catch (err) {
    res.status(500).json({
      database: 'error',
      message: err.message
    });
  }
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
  console.log(`Database: ${process.env.DATABASE_URL ? 'configured' : 'not configured'}`);
});
