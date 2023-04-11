var rpcWSC = WebSocket = require('rpc-websockets').Client;
let ws = new rpcWSC('ws://localhost:4000');

ws.on('open', () => {

    ws.notify('A');
    ws.notify('B');
    ws.notify('C');
    ws.notify('A');
})