var http = require('http');
var url = require('url');
var fs = require('fs');
var request = require('request');
var parseString = require('xml2js').parseString;
var xml2js = require('xml2js');
var mp = require('multiparty');

const { networkInterfaces } = require('os');
const { json } = require('stream/consumers');


const writeHTTP400 = (res) => {
    res.writeHead(400, {'Content-Type': 'text/html; charset=utf-8'})
    res.end("Bad Request");
}

const http_error = (req,res,statusCode) => {
    res.writeHead(statusCode, {'Content-Type': 'text/html; charset=utf-8'})
    res.write(`"error: " ${req.method}: ${req.url}, HTPP status ${statusCode}`);
    res.end();
}

const http_handler = (req, res) => {
    console.log(req.method);
    switch (req.method) {
        case 'GET': get_handler(req,res); break;
        case 'POST': post_handler(req,res); break;
        default: http_error(req,res,405); break;
    }
}

const get_handler  = (req,res) => {
    let path = url.parse(req.url).pathname;
    let urlStr = req.url.trim();
    console.log('path: ', path);
    console.log('url: ', req.url);

    if(path == '/connection'){
        connectResponse(req,res);
    }
    else if(path == '/headers'){
        headersResponse(req,res);
    }
    else if(isParameterRequest(urlStr)){
        parameterResponse(req,res);
    }
    else if(path == '/close'){
        closeResponse(req,res);
    }
    else if(path == '/socket'){
        socketResponse(req,res);
    }
    else if(path == '/resp-status'){
        respstatusResponse(req,res);
    }
    else if(path == '/formparameter'){
        let html = fs.readFileSync('./formparameter.html');
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
        res.end(html);
    }
    else if(path == '/json'){
        jsonResponse(req,res);
    }
    else if(path == '/files'){
        filesResponse(req,res);
    }
    else if(isFileReturnRequest(path)){
        fileReturnResponse(req,res);
    }
    else if(path == '/upload'){
        let html = fs.readFileSync('./upload.html');
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
        res.end(html);
    }
    else{
        res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'})
        res.end(`Oops, page doesn't exist`);
    } 
        
}

const post_handler = (req,res) => {
    let path = url.parse(req.url).pathname;
    let urlStr = req.url.trim();
    console.log('post on: ' + path)

    if(path == '/formparameter'){
        formparameterPostResponse(req,res);
    }
    else if(path == '/json'){
        jsonPostReponse(req,res);
    }
    else if(path == '/xml'){
        xmlPostResponse(req,res);
    }
    else if(path == '/upload'){
        uploadPostResponse(req,res);
    }
    else if(path == '/parameter'){
        parameterPostResponse(req,res);
    }
    else {
        console.log('post request to: ' + url.parse(req.url).pathname)
        res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'})
        res.end(`Oops, page doesn't exist`);
    }
}

var server = http.createServer();

let port = 5000;
server.listen(port, (v) => {
    console.log(`server start on port: ${port}`);
    })
    .on('error', (e) => {console.log('error', e.message, e.stack)})
    .on('request', http_handler);

server.keepAliveTimeout = 30000; 
server.headersTimeout = 31000;

var sockets = {}, nextSocketId = 0;
server.on('connection', function (socket) {
  var socketId = nextSocketId++;
  sockets[socketId] = socket;
  console.log('socket', socketId, 'opened');

  socket.on('close', function () {
    console.log('socket', socketId, 'closed');
    delete sockets[socketId];
  });

  socket.setTimeout(server.keepAliveTimeout);
});

//some functions

const isParameterRequest = (url) => {
    let reg = new RegExp(`^((\\/parameter\\?x=.+&{1,2}y=.+)||(\\/parameter\\/.+\\/.+))$`); 
    return reg.test(url);
}

const isFileReturnRequest = (url) => {
    let reg = new RegExp('^\/files\/.+')
    return reg.test(url);
}

//responses


const connectResponse = (req,res) => {
    if(url.parse(req.url, true).query.set == undefined){
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
        res.end(server.keepAliveTimeout+'');
        return;    
    }
    else {
        let params = url.parse(req.url, true).query;

        if(isNaN(params.set)){
            res.writeHead(400, {'Content-Type': 'text/html; charset=utf-8'})
            res.end('wrong type or value of "set" parameter');
            return;
        }

        server.keepAliveTimeout = Number(params.set);
        server.headersTimeout = Number(params.set)+1000;

        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
        res.end('Succ changes');
    }
}

const headersResponse = (req,res) => {
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    
    res.end(JSON.stringify(req.headers));
}

const parameterResponse = (req,res) => {
    let params = url.parse(req.url, true).query;
    
    let x,y,sum,dif,mult,div;

    const isBothNumber = (x,y) => {
        return !(isNaN(x) || isNaN(y))
    }

    const responseSuccess = () => {
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.end(
            `x: ${x}\n`+
            `y: ${y}\n`+
            `sum: ${sum}\n`+
            `dif: ${dif}\n`+
            `mult: ${mult}\n`+
            `div: ${div}\n`
            );
    }

    const calculate = (first,second) => {
        x = Number(first);
        y = Number(second);
        sum = x+y;
        dif = x-y;
        mult = x*y;
        div = x/y;
    }

    if(params.x == undefined && params.y == undefined){
        let parts = url.parse(req.url).pathname.split('/');

        let length = parts.length;
        for(let i = 0; i < length; i++){
            let elem = parts.pop();
            if(elem != '')
                parts.unshift(elem);
        }
        console.log(parts);
        console.log(isNaN(parts[2]));
        if(parts.length != 3 || !isBothNumber(parts[1],parts[2])){
            writeHTTP400(res);
            return;
        }
        
        calculate(parts[1],parts[2]);
        responseSuccess();
    }
    else {
        if(!isBothNumber){
            writeHTTP400(res);
            return;
        }

        calculate(params.x,params.y);
        responseSuccess();
    }    
}

const parameterPostResponse = (req,res) => {
    let data = '';
    
    req.on('data', chunk => {data += chunk;});
    req.on('end', () => {
        res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
        res.end(data);
    });
}

const closeResponse = (req,res) =>{
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end("server will be closed in 10 seconds");

    for (var socketId in sockets) {
        console.log('socket', socketId, 'destroyed');
        sockets[socketId].destroy();
    }

    server.close();
}

const socketResponse = (req,res) => {
    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});

    let nets = networkInterfaces();
    let addresses = {}
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
            const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
            if (net.family === familyV4Value && !net.internal) {
                if (!addresses[name]) {
                    addresses[name] = [];
                }
                addresses[name].push(net.address);
            }
        }
    }
    console.log(addresses['Ethernet'][0]);
    res.end(
        `client ip: ${req.socket.remoteAddress}\n` +
        `client port: ${req.socket.remotePort}\n` +
        `server ip: ${addresses['Ethernet'][0]}\n` +
        `server port: ${req.socket.localPort}\n`
        );
}

const respstatusResponse = (req,res) => {
    let params = url.parse(req.url, true).query;

    if(params.c == undefined || params.m == undefined){
        writeHTTP400(res);
        return;
    }

    if(isNaN(params.c) || params.c < 200 || params.c > 599){
        console.log('holla');
        writeHTTP400(res);
        return;
    }

    res.statusCode = params.c;
    res.end(params.m);
}

const formparameterPostResponse = (req,res) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
        let params = url.parse('?'+chunks, true).query;
        console.log(params);
        
        
        res.statusCode=200;
        res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});

        res.write(`values: ${chunks+''} \n`);
        res.write(
            `text=${params.txt} \n` +
            `number=${params.nmb} \n` +
            `data=${params.dt} \n` +
            `radio button=${params.tb} \n` +
            `text area=${params.ta} \n` +
            `submit=${params.subm} \n` 
        );
        res.end();
    });
}

const jsonResponse = async (req,res) => {
    var post_options = {
        host: 'localhost',
        port: '5000',
        path: '/json',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    };
  
    
    let request = http.request(post_options, function(res) {
        let body = '';
        res.on('data', data => { body += data;})
    
        res.on('end', () => {
            let json = JSON.parse(body)
            console.log(json);
        });
    }).end(JSON.stringify({test:'test'}));

    res.end();
}

const jsonPostReponse = (req,res) => {
    let body = '';
    req.on('data', data => { body += data;})

    req.on('end', () => {
        let json;
        try{json = JSON.parse(body);}
        catch{}
        
        console.log(json);
        res.end(JSON.stringify(json));
    });
}

const xmlPostResponse = (req,res) => {
    let body = '';
    req.on('data', data => { body += data;})

    req.on('end', () => {
        let sum = 0;
        let conc = '';

        console.log(body);
        parseString(body, function (err, result) {
            console.log(result);

            result.request.x.map( (e,i) => {
                sum += Number(e.$.value);
            });

            result.request.m.map((e,i) => {
                conc += e.$.value;
            });
            console.log(sum);
            console.log(conc);

        });
        let response = {
            response:
            {
                sum:{ '$':{element:'x',result:sum}},
                conc:{'$':{element:'m', result:conc}}
            }, 
        }
        console.log(response);
        let builder = new xml2js.Builder();
        let xml = builder.buildObject(response);

        console.log(xml);
        res.writeHead(200, {'Content-Type': 'application/xml'});
        res.end(xml);
    });
}

const filesResponse = (req,res) => {
    let dir = './static';
    let amountFiles = fs.readdirSync(dir).length || 0;
    

    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8', 'X-static-files-count': amountFiles})
    res.end(`amount file in ${dir}:${amountFiles}`);
}

const fileReturnResponse = (req,res) => {
    let parts = url.parse(req.url).pathname.split('/');
    let filename = parts.pop() || parts.pop();
    let path = `./static/${filename}`;

    fs.exists(path, function (exists) {
        if (exists) {
            // Content-type is very interesting part that guarantee that
            // Web browser will handle response in an appropriate manner.
            res.writeHead(200, {
                "Content-Type": "application/octet-stream",
                "Content-Disposition": "attachment; filename=" + filename
            });
            fs.createReadStream(path).pipe(res);
            return;
        }
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("File does't exist");
    });
}

const uploadPostResponse = (req,res) => {

    let form = new mp.Form({uploadDir:'./static'});
    let result = 'error';
    form.on('file', (name, file) => 
    {
        console.log(`file uploaded: ${name}, ${file.originalFilename}: ${file.path}`);
        result = `file uploaded: ${name}, ${file.originalFilename}: ${file.path}`;
    })

    form.on('close', () => {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(result);
    });

    form.on('error', e => {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(result);
    })

    form.parse(req);
}