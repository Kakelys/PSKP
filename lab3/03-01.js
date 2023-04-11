
var http = require('http');
var fs = require('fs');
var url = require('url');
var state = 'norm';

server = http.createServer(function (request,response)
{
    
    switch(url.parse(request.url).pathname)
    {
        case '/fact':
            if(typeof url.parse(request.url,true).query.k != 'undenfined'){
                let k = url.parse(request.url,true).query.k;

                if(!isNaN(parseInt(k))){
                    response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})    
                    response.end(JSON.stringify({k:k, fact:factorial(k)}));
                }
                else
                {
                    response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                    response.end(JSON.stringify({k:0}));
                }
            }
            else{
                response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                response.end(JSON.stringify({k:0}));
            }
            break;

        case '/factNext':
            if(typeof url.parse(request.url,true).query.k != 'undenfined'){
                let k = url.parse(request.url,true).query.k;

                if(!isNaN(parseInt(k))){
                    response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})    
                    let fact = new factorialN(k, (err, result)=>{response.end(JSON.stringify({k:k,fact:result}))});
                    fact.calc();
                }
                else
                {
                    response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                    response.end(JSON.stringify({k:0}));
                }
            }
            else{
                response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                response.end(JSON.stringify({k:0}));
            }
            break;

        case '/factImmediate':
            if(typeof url.parse(request.url,true).query.k != 'undenfined'){
                let k = url.parse(request.url,true).query.k;

                if(!isNaN(parseInt(k))){
                    response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})    
                    let fact = new factorialM(k, (err, result)=>{response.end(JSON.stringify({k:k,fact:result}))});
                    fact.calc();
                }
                else
                {
                    response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                    response.end(JSON.stringify({k:0}));
                }
            }
            else{
                response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                response.end(JSON.stringify({k:0}));
            }
            break;

        case '/factN':
            response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            response.end(fs.readFileSync('./fact.html'));
            break;

        case '/factNT':
            response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            response.end(fs.readFileSync('./factNext.html'));
            break;
        
        case '/factNM':
            response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            response.end(fs.readFileSync('./factImmediate.html'));
            break;

        
        default:
            response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            response.end(state);
            break;
    }
    
}).listen(5000, ()=>
{
    process.stdout.write(`${state} -> `)
});

process.stdin.setEncoding('utf-8');

process.stdin.on('readable', () => {

    let chunk = null;
    while((chunk = process.stdin.read()) != null)
    {
        switch(chunk.trim())
        {
            case 'exit':
            case 'norm':
            case 'idle':    
            case 'stop':
                changeState(chunk.trim())
                break;
            case 'fact':
                let fact = new factorialN(3, (err, result)=>{response.end(JSON.stringify({k:k,fact:result}))});
                fact.calc();
                process.stdout.write(fact.fcb.result +'\n');
                break;
            default: 
                process.stdout.write(chunk);
        }
        process.stdout.write( `${state} -> `);
    }
})

function changeState(str){
    switch(str)
    {
        case 'exit':
            process.stdout.write('Stoping server...');
            process.exit(0);
            break;
        case 'norm':
            state = 'norm';
            break;
        case 'idle':
            state = 'idle';    
            break;
        case 'stop':
            state = 'stop';
            break;
    }
}

function factorial(numb){
    if(numb <= 1)
        return 1;

    return numb*factorial(numb-1);
}

class factorialN {
    constructor(numb, cb) {
        this.n = numb;
        this.fact = factorial;
        this.fcb = cb;
        this.calc = () => { process.nextTick(() => { this.fcb(null, this.fact(this.n)); }); };
    }
}

class factorialM {
    constructor(numb, cb) {
        this.n = numb;
        this.fact = factorial;
        this.fcb = cb;
        this.calc = () => { setImmediate(() => { this.fcb(null, this.fact(this.n)); }); };
    }
}

console.log('Server is running')