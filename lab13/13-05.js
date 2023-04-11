const net = require('net');

const host = '0.0.0.0';
const port = 2000;

let globalSum = 0;
let clientId = 0;
net.createServer((sock) => {

    console.log('Client connected :O');
    let sum = 0;
    let id = ++clientId;

    sock.on('data', (data) => {
        console.log(`Recied data from client ${id}: `,data.readInt32LE(), 'sum:', sum, 'global sum:', globalSum);
        globalSum += data.readInt32LE();
        sum += data.readInt32LE();
    });

    setInterval(() => {
        sock.write(`Global sum: ${globalSum}, client sum: ${sum}`);
    }, 5000);

    sock.on('close', _ => {
        console.log(`Client ${id} disconnected :( \n`);
    })

    sock.on('error', err => {console.log('ERROR: ', err.message)});
}).listen(port,host);

console.log('tcp server: '+host+':'+port +'\n');

