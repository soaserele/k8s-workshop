const http = require('http');
const { URL } = require('url');

const params = ['hostname', 'port', 'pathname', 'search'];

const handler = (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(params.map(param => `<strong>${param}</strong>: ${url[param]}`).join('<br/>'));
  res.end();
}

http
  .createServer(handler)
  .listen(8080, () => console.log('Echo server started'));