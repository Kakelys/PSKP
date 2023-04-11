
var rpcWSS = require('rpc-websockets').Server;


let server = new rpcWSS({port: 4000, host: 'localhost'});

server.setAuth(l => {return (l.login == 'da')});

server.register('square', params => {
    let prms = [];
    let i =0;
    while(params[i]!=undefined && !isNaN(params[i])){
        prms.push(params[i]);
        i++;
    }

    switch(prms.length){
        case 1:
            return 3.14*(params[0]*params[0]);
        case 2:
            return params[0]*params[1];
        default: 
            return 0;
    }
}).public();

server.register('sum', params => {
    let i = 0;
    let sum = 0;
    while(params[i]!=undefined && !isNaN(params[i])){
        sum += Number(params[i]);
        i++;
    }

    return sum;
}).public();

server.register('mul', params => {
    let i = 1;
    let mult = params[0] || 0;
    while(params[i]!=undefined && !isNaN(params[i])){
        mult *= Number(params[i]);
        i++;
    }

    return mult;
}).public();

server.register('fact', params => {
    return fact(params[0] || 0);
}).protected();

server.register('fib', params => {
    return fib(params[0] || 0);
}).protected();

function fact(x) {
    if(x==0) {
       return 1;
    }
    return x * fact(x-1);
 }

 function fib(n) {
    return n <= 1 ? n : fib(n - 1) + fib(n - 2);
  }