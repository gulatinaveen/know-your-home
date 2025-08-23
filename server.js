const http = require('http');

// Railway sets PORT to 8080
const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  res.writeHead(200, { 
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(JSON.stringify({ 
    message: 'Know Your Home API is running!',
    path: req.url,
    port: PORT,
    time: new Date().toISOString()
  }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
