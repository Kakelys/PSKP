const net = require('net');

const host = '0.0.0.0';
const port = 2000;

let sum = 0;

net.createServer((sock) => {

    console.log('Client connected :O');

    sock.on('data', (data) => {
        console.log('Recied data: ',data.readInt32LE(), sum);
        sum += data.readInt32LE();
    });

    let buf = new Buffer.alloc(4);
    setInterval(() => {
        buf.writeInt32LE(sum,0)
        sock.write(buf);
    }, 5000);

    sock.on('close', _ => {
        console.log('Client disconnected :( \n');
    })

    sock.on('error', err => {console.log('ERROR: ', err.message)});
}).listen(port,host);

console.log('tcp server: '+host+':'+port +'\n');

