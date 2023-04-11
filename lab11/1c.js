var ws = new require('ws');
var fs = new require('fs');

const client = new ws('ws://localhost:4000');

let count = 0;

client.on('open', () => {
    const duplex = ws.createWebSocketStream(client, {encoding: 'utf8'});

    let sfile = fs.createReadStream('./file.txt');
    sfile.pipe(duplex);
})