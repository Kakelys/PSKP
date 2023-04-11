const { Console } = require('console');

var rpcWSS = require('rpc-websockets').Server;

let server = new rpcWSS({port: 4000, host:'localhost'});

server.event('A');
server.event('B');
server.event('C');

process.stdin.on('readable',()=>{
    let chunk= '';
    while ((chunk = process.stdin.read()) !=null){
        chunk += '';
        switch(chunk.trim()){
            case 'A':
                emmited(chunk);
                server.emit('A');
                break;
            case 'B':
                emmited(chunk);
                server.emit('B');
                break;
            case 'C':
                emmited(chunk);
                server.emit('C');
                break;
            default:
                break;

        }
    }
});

function emmited(str){
    console.log('event emmmited: ', str);
}