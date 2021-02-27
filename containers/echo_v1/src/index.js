const http = require('http');

const handler = (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(req.url);
  res.end();
}

http
  .createServer(handler)
  .listen(8080, () => console.log('Echo server started'));