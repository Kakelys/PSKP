

var rpcWSC = WebSocket = require('rpc-websockets').Client;
var ws = new rpcWSC('ws://localhost:4000');
var async = require('async');


let funcs = () => async.parallel({
    square1: (er) => {
        ws.call('square', [3]).then( r => er(null,r))
        .catch(e => er(e, null));
    },
    square2: (er) => {
        ws.call('square', [5,4]).then( r => er(null,r))
        .catch(e => er(e, null));
    },
    sum1: (er) => {
        ws.call('sum', [2]).then( r => er(null,r))
        .catch(e => er(e, null));
    },
    sum2: (er) => {
        ws.call('sum', [2,4,6,8,10]).then( r => er(null,r))
        .catch(e => er(e, null));
    },
    mult1: (er) => {
        ws.call('mul', [3]).then( r => er(null,r))
        .catch(e => er(e, null));
    },
    mult2: (er) => {
        ws.call('mul', [3,5,7,9,11,13]).then( r => er(null,r))
        .catch(e => er(e, null));
    },
    fib1: (er) => {
        ws.login({login: 'da'}).then(login => {
            if(login){
                ws.call('fib', [1])
                .then( r => er(null,r))
                .catch(e => er(e, null));
            }
        });
    },
    fib2: (er) => {
        ws.login({login: 'da'}).then(login => {
            if(login){
                ws.call('fib', [2])
                .then( r => er(null,r))
                .catch(e => er(e, null));
            }
        });
    },
    fib3: (er) => {
        ws.login({login: 'da'}).then(login => {
            if(login){
                ws.call('fib', [7])
                .then( r => er(null,r))
                .catch(e => er(e, null));
            }
        });
    },
    fact1: (er) => {
        ws.login({login: 'da'}).then(login => {
            if(login){
                ws.call('fact', [0])
                .then( r => er(null,r))
                .catch(e => er(e, null));
            }
        });
    },
    fact2: (er) => {
        ws.login({login: 'da'}).then(login => {
            if(login){
                ws.call('fact', [5])
                .then( r => er(null,r))
                .catch(e => er(e, null));
            }
        });
    },
    fact3: (er) => {
        ws.login({login: 'da'}).then(login => {
            if(login){
                ws.call('fact', [10])
                .then( r => er(null,r))
                .catch(e => er(e, null));
            }
        });
    },
    _11_05c: (er) => {
        ws.login({login: 'da'}).then(async (login) => {
            
            if(login){
                let result = await ws.call('sum', [
                    ws.call('square', [3])
                    .then( r => {return r}),
                    ws.call('square', [5,4])
                    .then( r => {return r}),
                    ws.call('mul', [3,5,7,9,11,13])
                    .then( r => {return r})    
                ]).then( r => {return r}) + 
                await ws.call('fib', [7])
                .then( r => {return r}) * 
                await ws.call('mul', [2,4,6])
                .then( r => {return r});
                
                er(null, result)
            }
        });
    } 


}, (e,r) =>{
    console.log(e || r);

    ws.close();
}
);

ws.on('open', funcs);