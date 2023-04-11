var http = require('http');
var fs = require('fs');
var parseString = require('xml2js').parseString;



let bound = 'asdgfsghrt';
let body = `--${bound}\r\n`;
    body += 'Content-Disposition:form-data; name="file"; filename="MyFile.txt"\r\n';
    body += 'Content-Type:text/plain\r\n\r\n';
    body += fs.readFileSync('./MyFile.txt');
    body += `\r\n--${bound}--\r\n`;

    

let options = {
    host: 'localhost',
    path: '/upload',
    port: 5000,
    method: 'POST',
    headers: {
        'Content-Type': `multipart/form-data; boundary=${bound}`
    }
}

let req = http.request(options, function(res) {
    let body = '';
    res.on('data', data => { body += data;})

    res.on('end', () => {
        console.log(body);
        parseString(body, function (err, result) {
            console.log(result);
        });
    });
})
.on('error', (e) => {console.log('An error occurred during request: ', e.message)})
.end(body);