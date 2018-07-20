const http = require('http');

module.exports.apiCall = (path, method, params, cb) => {

    const apiUrl = 'localhost';
    var data = JSON.stringify(params);

    const options = {
        host: apiUrl,
        port: 8000,
        path: path,
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbmFuZ29nQGdtYWlsLmNvbSIsInVzZXJJZCI6IjViNTE4ZDlkOTc4YzgwNjM0MGNhZmJlZiIsImlhdCI6MTUzMjA3MTM0OCwiZXhwIjoxNTMyMDc0OTQ4fQ.7Z8cq7PcuGonMAkUX6gVQ-ZjI2ZrqVRi6d7dohEBihI'
        }
    };

    var post_req = http.request(options, function (res) {
        res.setEncoding('utf8');
        let body = '';

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            let result = JSON.parse(body);
            cb(result);
        });
    });

    if(method=='POST')
        post_req.write(data);

    post_req.end();
};