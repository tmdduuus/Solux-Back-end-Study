// 웹서버 코드
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => { // server 만들기
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => { // server가 listen 하도록 인자들을 전달
  console.log(`Server running at http://${hostname}:${port}/`);
});