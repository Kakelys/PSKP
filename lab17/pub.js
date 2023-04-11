const red = require('redis');

const client = red.createClient({url:'redis://localhost:6379/'});

(async _ => {

    await client.connect();

    setInterval(async _ => {await client.publish('ch1', 'msg');console.log('sending msg...')}, 2000).unref();

    setTimeout(async _ => {await client.quit();}, 15000)

    client.on('end', _ => console.log('pub end'));

})();