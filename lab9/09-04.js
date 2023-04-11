var http = require('http');
let query = require('qs');

let path = `/json`; 

let options = {
    host: 'localhost',
    path: path,
    port: 5000,
    method: 'POST',
    headers:{
        'content-type': 'application/json', 'accept':'application/json'
    }
}

let req = http.request(options, function(res) {
    let body = '';
    res.on('data', data => { body += data;})

    res.on('end', () => {
        let json = JSON.parse(body)
        console.log(json);
    });
})
.on('error', (e) => {console.log('An error occurred during request: ', e.message)})
.end(JSON.stringify({test:'test'}));