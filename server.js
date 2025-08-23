const http = require('http');

const PORT = process.env.PORT || 4000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ 
    message: 'API is working!',
    path: req.url,
    time: new Date().toISOString()
  }));
});

server.listen(PORT, () => {
  console.log('Server started on port ' + PORT);
});
