const http = require('http');
const { Pool } = require('pg');

const PORT = process.env.PORT || 8080;

// Only create pool if DATABASE_URL exists
let pool = null;
if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
}

const server = http.createServer(async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  
  if (req.url === '/health') {
    res.end('OK');
    return;
  }
  
  if (req.url === '/api/db-test') {
    if (!pool) {
      res.end(JSON.stringify({ 
        database: 'not configured',
        error: 'DATABASE_URL not found'
      }));
      return;
    }
    
    try {
      const result = await pool.query('SELECT NOW() as time, version() as version');
      res.end(JSON.stringify({ 
        database: 'connected',
        time: result.rows[0].time,
        version: result.rows[0].version,
        message: 'Database is working!'
      }));
    } catch (err) {
      res.end(JSON.stringify({ 
        database: 'error',
        error: err.message
      }));
    }
    return;
  }
  
  // Default response
  res.end(JSON.stringify({
    message: 'Know Your Home API',
    database_url: process.env.DATABASE_URL ? 'configured' : 'not configured',
    endpoints: {
      health: '/health',
      dbTest: '/api/db-test'
    }
  }));
});

server.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'configured' : 'not configured');
});
