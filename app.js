let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
//app.listen(port);

const http = require('http');

const hostname = '127.0.0.1';

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});