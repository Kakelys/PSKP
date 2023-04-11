const redis = require('redis');

const client = redis.createClient({url:'redis://localhost:6379/'});

client.on('ready', _ => console.log('ready'));
client.on('error', err => {console.log(`Error: ${err}`)});
client.on('connect', _ => console.log('connect'));
client.on('end', _ => console.log('end'));

async function task2()
{
    await client.connect()
    
    var startTime = performance.now()
    for(let i = 0; i < 10000; i++){
        await client.set(`${i}`, `${i}`);
    }
    var endTime = performance.now()
    console.log(`set time: ${endTime - startTime} milliseconds`)

    var startTime = performance.now()
    for(let i = 0; i < 10000; i++){
        await client.get(`${i}`);
    }
    var endTime = performance.now()
    console.log(`get time: ${endTime - startTime} milliseconds`)

    var startTime = performance.now()
    for(let i = 0; i < 10000; i++){
        await client.del(`${i}`);
    }
    var endTime = performance.now()
    console.log(`del time: ${endTime - startTime} milliseconds`)
    
    client.quit();
};

async function task3(){
    await client.connect();

    await client.set('x', 0);

    var startTime = performance.now()
    for(let i =0; i < 10000; i++){
        await client.incr('x');
    }
    var endTime = performance.now()
    console.log(`incr time: ${endTime - startTime} milliseconds`)

    var startTime = performance.now()
    for(let i =0; i < 10000; i++){
        await client.decr('x');
    }
    var endTime = performance.now()
    console.log(`incr time: ${endTime - startTime} milliseconds`)

    await client.quit();
}

async function task4(){
    await client.connect();

    await client.set('x', 0);

    var startTime = performance.now()
    for(let i = 0; i < 10000; i++){
        await client.hSet('f',i, `{id:${i}}`);
    }
    var endTime = performance.now()
    console.log(`hSet time: ${endTime - startTime} milliseconds`)

    console.log(' ',await client.hGet('f', '1'));
    
    var startTime = performance.now()
    for(let i = 0; i < 10000; i++){
        await client.hGet('f',`${i}`);
    }
    var endTime = performance.now()
    console.log(`hGet time: ${endTime - startTime} milliseconds`)

    await client.quit();
}

//task2();

//task3();

task4();

