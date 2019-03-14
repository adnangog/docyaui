var hummus = require('hummus');
var emptyFileName = __dirname + '/output/MongoDB.pdf';

var pdfWriter = hummus.createWriter(__dirname + '/output/YeniDosya.pdf');
pdfWriter.appendPDFPagesFromPDF(emptyFileName, {type:hummus.eRangeTypeSpecific,specificRanges: [ [ 1,1 ]]});
pdfWriter.end();