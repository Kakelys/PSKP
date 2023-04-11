
var http = require('http');
var fs = require('fs');


const httpserver = http.createServer((req, res) => {
    if(req.method == 'GET' && req.url == '/start'){
        res.writeHead(200, {'content-type': 'text/html; charset=urf-8'});
        res.end(fs.readFileSync('./01.html'));
    }
    else{
        res.writeHead(400, {'content-type': 'text/html; charset=urf-8'});
        res.end();
    }
}).listen(3000, () => {console.log('http server is running on port 3000')});

let count = 0;
var ws = require('ws');

const wsserver = new ws.Server({port: 4000, host:'localhost', path:'/wsserver'})
.on('error', e => {console.log(`ws server error: ${e.message}`)});

wsserver.on('connection', ws => {
    ws.on('message', message => {
        console.log('ws recieved message: ', message + '');
    });

    setInterval(() => {ws.send(`server: ${++count}`)}, 5000)
});

console.log('ws server is running');