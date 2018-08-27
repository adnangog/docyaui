const fs = require('fs');
const server = require('http').createServer();

server.on('request', (req, res) => {
  const src = fs.createReadStream('./uploads/787fd52b2b258370e2392b6c3197504e');
  src.pipe(res);
});

server.listen(9000);
