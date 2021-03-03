const http = require('http');
const https = require('https');

const {CURRENCY_PAIR: currencyPair} = process.env;

if (!currencyPair) {
  throw new Error('Cryptocurrency pair is required for this service. Set "CURRENCY_PAIR" environment variable and try again');
}

const handler = (req, res) => {
  const sendResponse = (statusCode, message) => {
    res.writeHead(statusCode, {'Content-Type': 'text/html'});
    message && res.write(message);
    res.end();
  }

  switch (req.url) {
    case '/':
      https.get(`https://api.coinbase.com/v2/prices/${currencyPair.toUpperCase()}/spot`, (incoming) => {
        let buffer = '';
        incoming.on('data', data => buffer += data.toString());
        incoming.on('end', () => {
          const coinbaseResponse = JSON.parse(buffer);

          if (coinbaseResponse.errors) {
            sendResponse(500, coinbaseResponse.errors[0].message)
            return;
          }

          const {data: {base, currency, amount}} = coinbaseResponse;

          sendResponse(200, `<html><head></head><body style="background:#2F323A;height:100vh;color:white;font-size:2.5rem;line-height:4rem;margin:0;overflow:hidden"><div style="height:100vh;max-width:1200px;margin:0 auto;display:flex;flex-direction:row;justify-content:space-evenly;align-items:center"><span>${base} to ${currency}</span><span style="font-size:4rem;font-weight:600;">${amount}</span></div></body></html>`);
        });
      })
      .on("error", (err) => {
        console.error("Error: " + err.message);
        sendResponse(res, 500, err.message);
      });
      break;
      
    default:
      sendResponse(404);
  }
}

http
  .createServer(handler)
  .listen(8080, () => console.log('CCPrice server started'));