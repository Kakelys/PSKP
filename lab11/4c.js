var ws = require('ws');
var fs = require('fs');
const { on } = require('events');
const { timeStamp } = require('console');

const client = new ws('ws://localhost:4000');

let count = 0;

let clientName = process.argv[2] || 'some another name';
client.on('open', () => {
    client.send(JSON.stringify({x: clientName, t: Date.now()}))

    client.on('message', msg => {
        console.log(msg+'');
    })
})