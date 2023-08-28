const http = require('http');
const fs = require('fs');
const path = require('path');

const sendMainPage = (res) => {
  fs.readFile('./index.html', (err, data) => {
    if (err) {
      return sendNotFound();
    }
    res.setHeader('Content-Type', 'text/html');
    res.statusCode = 200;
    res.end(data);
  });
};

const sendNotFound = (res) => {
  res.setHeader('Content-Type', 'text/html');
  fs.readFile('./404.html', (err, data) => {
    res.statusCode = 404;
    res.end(data);
  });
};

const logRequest = (req) => {
  const logPath = path.join(__dirname, 'log.txt');
  const reqBody = [];
  // getting the request body
  req.on('data', (chunk) => {
    reqBody.push(chunk);
  });
  // end of request body
  req.on('end', () => {
    const parseBody = Buffer.concat(reqBody).toString('utf-8');
    const message = decodeURIComponent(
      parseBody.split('=')[1].replace(/\+/g, ' ')
    );
    fs.writeFileSync(logPath, `${new Date()} - ${message} \n`, { flag: 'a' });
  });
};

const server = http.createServer((req, res) => {
  const { url, method } = req;
  if (url === '/') {
    return sendMainPage(res);
  } else if (url === '/send_message' && method === 'POST') {
    logRequest(req);
    res.statusCode = 302;
    res.setHeader('Location', '/');
    return res.end();
  }
  sendNotFound(res);
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
