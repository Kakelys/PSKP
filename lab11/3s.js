let count = 0;
var ws = require('ws');
var fs = require('fs');
const { on } = require('events');

const wss = new ws.Server({port: 4000, host:'localhost'})
.on('error', e => {console.log(`ws server error: ${e.message}`)});

let n = 0;
let activeClientCount = 0;
wss.on('connection', ws => {
    
    setInterval(() => {
        ws.send(`message: ${++n}`);
    }, 15000);

    ws.on('pong', () => {
        activeClientCount++;
    })

    ws.on('message', msg => {
        console.log('recieved message: ', msg+'');
    })
});

console.log('ws server is running');

setInterval(() => {
    setTimeout(() => {console.log('active clients: ', activeClientCount);}, 500)
    activeClientCount = 0;

    wss.clients.forEach(client => {
        client.ping();
    })
}, 5000);