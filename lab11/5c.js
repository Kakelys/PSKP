

var rpcWSC = WebSocket = require('rpc-websockets').Client;
let ws = new rpcWSC('ws://localhost:4000');

ws.on('open', () => {

    ws.call('square', [3]).then( r => {console.log('square',r)})
    .catch(e => console.log(e));
    ws.call('square', [5,4]).then( r => {console.log('square',r)})
    .catch(e => console.log(e));

    ws.call('sum', [2]).then( r => {console.log('sum:',r)})
    .catch(e => console.log(e));
    ws.call('sum', [2,4,6,8,10]).then( r => {console.log('sum:',r)})
    .catch(e => console.log(e));

    ws.call('mul', [3]).then( r => {console.log('mul:',r)})
    .catch(e => console.log(e));
    ws.call('mul', [3,5,7,9,11,13]).then( r => {console.log('mul:',r)})
    .catch(e => console.log(e));
    
    ws.login({login: 'da'}).then(login => {
        if(login){
            ws.call('fib', [0])
            .then( r => {console.log('fib',r)})
            .catch(e => console.log(e));
            ws.call('fib', [5])
            .then( r => {console.log('fib',r)})
            .catch(e => console.log(e));
            ws.call('fib', [10])
            .then( r => {console.log('fib',r)})
            .catch(e => console.log(e));

            ws.call('fact', [0])
            .then( r => {console.log('fact',r)})
            .catch(e => console.log(e));
            ws.call('fact', [5])
            .then( r => {console.log('fact',r)})
            .catch(e => console.log(e));
            ws.call('fact', [10])
            .then( r => {console.log('fact',r)})
            .catch(e => console.log(e));
        }
    });
})