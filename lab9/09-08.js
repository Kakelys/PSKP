var http = require('http');
var fs = require('fs');
const save = fs.createWriteStream('newFile.png');

let options = {
    host: 'localhost',
    path: '/files/img.png',
    port: 5000,
    method: 'GET'
}

const req = http.request(options, (res) => {
    res.pipe(save);
})

req.on('error', (e) => {console.log('An error occurred during request: ', e.message)})
req.end();