var http = require('http');
var url = require('url');
var fs = require('fs');

var static = require('./static_module')('/static');

const http_error = (req,res,statusCode) => {
    res.writeHead(statusCode, {'Content-Type': 'text/html; charset=utf-8'})
    res.write(`"error: " ${req.method}: ${req.url}, HTPP status ${statusCode}`);
    res.end();
}

const http_handler = (req, res) => {
    switch (req.method) {
        case 'GET': get_handler(req,res); break;
        default: http_error(req,res,405); break;
    }
}

const get_handler  = (req,res) => {
    if(static.isStatic(req.url)){
        
        static.sendStaticResponse(req,res);
        return;
    }
    console.log ('not a static');

    switch(url.parse(req.url).pathname)
    {
        case '/' || 'index.html': 
            let html = fs.readFileSync('./index.html');
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            res.end(html);
            break;
        default:
            res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'})
            res.end(`Oops, page doesn't exist`);
            break;  
    }
}

var server = http.createServer();

let port = 5000;
server.listen(port, (v) => {
    console.log(`server start on port: ${port}`);
    })
    .on('error', (e) => {console.log('error', e.message, e.stack)})
    .on('request', http_handler);