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
            'Content-Type': 'application/json'
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