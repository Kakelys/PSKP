const net = require('net');

const host = '0.0.0.0';
const port1 = 2000;
const port2 = 3000;

let sum = 0;

handler = port => {return (sock) => {
    console.log('Client connected :O to port:', port);
    let first = true;

    sock.on('data', (data) => {
        console.log('Recied data: ',data.readInt32LE());

        sock.write('ECHO: ' + data.readInt32LE());
    });

    sock.on('close', _ => {
        console.log('Client disconnected :( from port', port, '\n');
    })

    sock.on('error', err => {console.log('ERROR: ', err.message)});
    }
}

net.createServer(handler(port1)).listen(port1,host)
.on('listening', _ => {console.log(`tcp server on ${host}:${port1}`)})

net.createServer(handler(port2)).listen(port2,host)
.on('listening', _ => {console.log(`tcp server on ${host}:${port2}`)})

