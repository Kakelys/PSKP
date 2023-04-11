
const buffer = require('buffer');
const udp = require('dgram');
const client = udp.createSocket('udp4');
const port = 2000;

client.on('message', (msg, info) => {
    console.log('Recieved data: ', msg + '');
});



let data = Buffer.from('Ohio');
client.send(data, port, 'localhost', err => {
    if(err){
        console.log('err'); client.close();
    }
    else{ 
        console.log('Sending data to server');  
    }
})
