const http = require('http');

module.exports.apiCall = (token, path, method, params, cb) => {

    const apiUrl = 'localhost';
    const data = JSON.stringify(params);

    const options = {
        host: apiUrl,
        port: 8000,
        path: path,
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };

    let post_req = http.request(options, (res) => {
        res.setEncoding('utf8');
        let body = '';

        res.on('data', (chunk) => {
            body += chunk;
        });

        res.on('end', () => {
            let result = JSON.parse(body);
            cb(result);
        });
    });

    if(method!='GET')
        post_req.write(data);

    post_req.end();
};

module.exports.apiCall2 = (token, path, method, params, cb) => {

    const apiUrl = 'localhost';
    const data = JSON.stringify(params);

    const options = {
        host: apiUrl,
        port: 8000,
        path: path,
        method: method,
        headers: {
            'Content-Type': 'application/form-data',
            'Content-Length': Buffer.byteLength(data),
            'Authorization': `Bearer ${token}`
        }
    };

    let post_req = http.request(options, (res) => {
        res.setEncoding('utf8');
        let body = '';

        res.on('data', (chunk) => {
            body += chunk;
        });

        res.on('end', () => {
            let result = JSON.parse(body);
            cb(result);
        });
    });

    if(method!='GET')
        post_req.write(data);

    post_req.end();
};