const net = require('net');

const host = '127.0.0.1';
const port = 2000;

var client = new net.Socket();

client.connect(port, host, _ => {
    console.log('Client connected');
    client.write('Ohio');
})

client.on('data', (data) => {
    console.log('Recieved data: ' + data);
    client.destroy();
})


client.on('close', _ => {console.log('Client close')});

client.on('error', err => {console.log('ERROR: ' + err.message )});