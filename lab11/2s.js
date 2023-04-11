let count = 0;
var ws = require('ws');
var fs = require('fs');

const wsserver = new ws.Server({port: 4000, host:'localhost'})
.on('error', e => {console.log(`ws server error: ${e.message}`)});

let i = 0;

wsserver.on('connection', wss => {
    const duplex = ws.createWebSocketStream(wss, {encoding: 'utf8'});
    let rfile = fs.createReadStream(`./file.txt`);
    rfile.pipe(duplex);
});

console.log('ws server is running');