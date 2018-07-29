var fs = require('fs');

var imageAsBase64 = fs.readFileSync('./kanvas.jpg', 'base64');

console.log(imageAsBase64);