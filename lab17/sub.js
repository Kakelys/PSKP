const red = require('redis');

const client = red.createClient({url:'redis://localhost:6379/'});


(async _ => {
    const oneChSub = client.duplicate();

    await oneChSub.connect();

    await oneChSub.subscribe('ch1', msg => {
        console.log(`message from ch1: ${msg}`);
    })

    oneChSub.on('error', err => console.log(`Errror: ${err}`));

    setTimeout(async _ =>{
        await oneChSub.unsubscribe();
        await oneChSub.quit();
    },7000);
})();