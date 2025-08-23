const http = require('http');
const port = process.env.PORT || 8080;

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  
  const response = {
    message: 'Welcome to Know Your Home API!',
    description: 'Manage your home appliances and warranties',
    endpoints: {
      health: '/health',
      api: '/api',
      brands: '/api/brands'
    },
    status: 'running',
    timestamp: new Date().toISOString()
  };
  
  if (req.url === '/health') {
    res.end('OK');
  } else if (req.url === '/api/brands') {
    res.end(JSON.stringify([
      { id: 1, name: 'Samsung', helpline: '1800-40-7267864' },
      { id: 2, name: 'LG', helpline: '1800-315-9999' },
      { id: 3, name: 'Whirlpool', helpline: '1800-208-1800' }
    ]));
  } else {
    res.end(JSON.stringify(response));
  }
}).listen(port);

console.log('Server running on port ' + port);
