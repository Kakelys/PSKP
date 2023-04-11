let count = 0;
var ws = require('ws');

const wsserver = new ws.Server({port: 4000, host:'localhost', path:'/broadcast'})
.on('error', e => {console.log(`ws server error: ${e.message}`)});

wsserver.on('connection', ws => {
    ws.on('message', message => {
        wsserver.clients.forEach(client => {
            if(client.readyState === ws.OPEN)
                client.send('server' + message);
        })
    });
});

console.log('ws server is running');