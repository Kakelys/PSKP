var ws = require('ws');
var fs = require('fs');

const client = new ws('ws://localhost:4000');

let count = 0;

client.on('open', () => {
    const duplex = ws.createWebSocketStream(client, {encoding: 'utf8'});

    let sfile = fs.createWriteStream('./upload/new_file.txt')
    duplex.pipe(sfile);
})