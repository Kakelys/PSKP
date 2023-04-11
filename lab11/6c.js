

var rpcWSC = WebSocket = require('rpc-websockets').Client;
let ws = new rpcWSC('ws://localhost:4000');

ws.on('open', () => {

    ws.subscribe('A');
    ws.subscribe('B');
    ws.subscribe('C');

    ws.on('A', () => {console.log('event A')});
    ws.on('B', () => {console.log('event B')});
    ws.on('C', () => {console.log('event C')});
})