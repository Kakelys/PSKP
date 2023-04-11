var http = require('http');
let query = require('qs');


let params = query.stringify({x:1, y:5});
let path = `/parameter?${params}`; 

let options = {
    host: 'localhost',
    path: path,
    port: 5000,
    method: 'GET'
}

const req = http.request(options, (res) => {
    let data = '';

    console.log(res.url);
    console.log('status code: ', res.statusCode);
    console.log('status message: ', res.statusMessage);
    console.log('remote ip: ', res.socket.remoteAddress);
    console.log('remote port: ', res.socket.remotePort);

    res.on('data', chunk => {data += chunk;});
    res.on('end', () => {console.log('body: ',data)});
})

req.on('error', (e) => {console.log('An error occurred during request: ', e.message)})
req.end();