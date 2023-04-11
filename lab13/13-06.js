const { Console } = require('console');
const net = require('net');

if(!process.argv[2]){
    console.log('Hey, you forgot about number in args')
    process.exit();
}
    

const host = '127.0.0.1';
const port = 2000;

var client = new net.Socket();
var buf = new Buffer.alloc(4);

client.connect(port, host, _ => {
    console.log('Client connected');
    let k = process.argv[2];

    timer = setInterval( _ => {
        buf.writeInt32LE(k, 0);
        client.write(buf);
    }, 1000)

    setTimeout( _ => {
        clearInterval(timer);
        client.end();
    }, 20000);
})

client.on('data', (data) => {
    console.log('Recieved data: ', data + '');
})

client.on('close', _ => {console.log('Client close')});

client.on('error', err => {console.log('ERROR: ' + err.message )});