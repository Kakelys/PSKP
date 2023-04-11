const net = require('net');

const host = '127.0.0.1';
const port = 2000;

var client = new net.Socket();
var buf = new Buffer.alloc(4);

client.connect(port, host, _ => {
    console.log('Client connected');
    let k = 0;

    timer = setInterval( _ => {
        buf.writeInt32LE(k++, 0);
        client.write(buf);
    }, 1000)

    setTimeout( _ => {
        clearInterval(timer);
        client.end();
    }, 20000);
})

client.on('data', (data) => {
    console.log('Recieved data: ', data.readInt32LE());
})

client.on('close', _ => {console.log('Client close')});

client.on('error', err => {console.log('ERROR: ' + err.message )});