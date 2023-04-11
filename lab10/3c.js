var ws = new require('ws');

const client = new ws('ws://localhost:4000/broadcast');

let count = 0;

client.on('open', () => {
    client.send('some msg');
    //setInterval(() => {client.send(++count);}, 3000)

    client.on('message', msg => {
        console.log('recieved message: ', msg+'')
    })

    setTimeout(() => {client.close()}, 25000);
})