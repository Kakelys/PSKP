const net = require('net');

const host = '0.0.0.0';
const port = 2000;

net.createServer((sock) => {

    console.log('Client connected :O');

    sock.on('data', (data) => {
        console.log('Recied data: ' + data);

        sock.write('Echo: ' + data);
    })

    sock.on('close', _ => {
        console.log('Client disconnected :( \n');
    })

    sock.on('error', err => {console.log('ERROR: ', err.message)});
}).listen(port,host);

console.log('tcp server: '+host+':'+port +'\n');

