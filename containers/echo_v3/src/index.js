const http = require('http');
const { URL } = require('url');
const crypto = require('crypto');
const { performance } = require('perf_hooks');

const algorithm = 'sha512';
const rounds = 32 * 1024;

const params = ['hostname', 'port', 'pathname', 'search'];

const handler = (req, res) => {
  const start = performance.now();

  let hash = req.url;
  for (let i = 0; i < rounds; i++) {
    hash = crypto.createHash(algorithm).update(hash).digest('hex')
  }
  
  const url = new URL(req.url, `http://${req.headers.host}`);

  const end = performance.now();

  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(params.map(param => `<strong>${param}</strong>: ${url[param]}<br/>`).join(''));
  res.write(`<strong>Checksum</strong>: ${hash}<br/>`);
  res.write(`<strong>Page generated in</strong>: ${end - start} milliseconds<br/>`);
  res.end();
}

http
  .createServer(handler)
  .listen(8080, () => console.log('Echo server started'));