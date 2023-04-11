let count = 0;
var ws = require('ws');
var fs = require('fs');
const { on } = require('events');

const wsserver = new ws.Server({port: 4000, host:'localhost'})
.on('error', e => {console.log(`ws server error: ${e.message}`)});

let n = 0;

wsserver.on('connection', wss => {
    wss.on('message', msg => {
        let json = JSON.parse(msg+'');

        wss.send(JSON.stringify({server: ++n, client: json.x, timestamp: json.t}));
    })
});

console.log('ws server is running');