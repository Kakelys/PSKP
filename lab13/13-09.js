
const udp = require('dgram');
const port = 2000;

let server = udp.createSocket('udp4');

server.on('error', err => {console.log('ERROR: ', err.message); server.close();});

server.on('message', (msg, info) => {
    console.log('Recieved data: ', msg + '');

    server.send('ECHO: ' + msg, info.port, info.address, err => {
        if(err){console.log('err'); server.close();}
        else console.log('Sending data to client')
    })
});


server.on('listening', _ => {
    console.log(`server started on: ${server.address().address}:${server.address().port}`, )
})

server.on('close', _ => {console.log('Server closed')})

server.bind(port);