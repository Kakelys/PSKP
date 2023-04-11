const { Console } = require('console');
const net = require('net');

if(!process.argv[2]){
    console.log('Hey, you forgot about port in args')
    process.exit();
}
    

const host = '127.0.0.1';
const port = process.argv[2];

var client = new net.Socket();
var buf = new Buffer.alloc(4);

client.connect(port, host, _ => {
    console.log('Client connected');
    let k = 25;

    buf.writeInt32LE(k, 0);

    setInterval(_ => {
        client.write(buf);
    }, 1000)
    

})

client.on('data', (data) => {
    console.log('Recieved data: ', data + '');
})

client.on('close', _ => {console.log('Client close')});

client.on('error', err => {console.log('ERROR: ' + err.message )});