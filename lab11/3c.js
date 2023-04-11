var ws = require('ws');
var fs = require('fs');

const client = new ws('ws://localhost:44384/websocket.websocket');

let count = 0;

client.on('open', () => {
    client.on('message', msg => {
        console.log('recieved message: ', msg+'');
    });
})