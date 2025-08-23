const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Know Your Home API',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/health', (req, res) => {
  res.send('OK');
});

// API info
app.get('/api', (req, res) => {
  res.json({
    name: 'Know Your Home API',
    version: '1.0.0'
  });
});

// Brands
app.get('/api/brands', (req, res) => {
  res.json([
    { id: 1, name: 'Samsung' },
    { id: 2, name: 'LG' },
    { id: 3, name: 'Whirlpool' }
  ]);
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle shutdown gracefully
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server closed');
  });
});
