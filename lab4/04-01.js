var http = require('http');
var url = require('url');
var fs = require('fs');
var data = require('./db');

var db = new data.DB();

db.on('GET', (req,res)=>{console.log('DB.GET');
 res.end(JSON.stringify(db.select()));});

db.on('POST', (req,res)=>{
    console.log('DB.POST');
    req.on('data', data=>{
        let r = JSON.parse(data);
        db.insert(r);
        res.end(JSON.stringify(r));
    });
});

db.on('PUT', (req,res)=>{
    console.log('DB.PUT')
    req.on('data', data=>{
        let r = JSON.parse(data);
        db.update(r);
        res.end(JSON.stringify(r));
    });
});
db.on('DELETE', (req,res)=>{
    console.log('DB.DELETE')
    req.on('data', data=>{
        let r = JSON.parse(data);
        db.delete(r.id);
        res.end(JSON.stringify(r));
    });
});



http.createServer(function (request, response){

    switch(url.parse(request.url).pathname)
    {
        case '/api/db':
            db.emit(request.method, request, response);
            break;
        case '/':
            let html = fs.readFileSync('./04-02.html');
            response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            response.end(html);
            break;
        default:
            response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            response.end(`Oops, page doesn't exist`);
            break;  
    }

}).listen(5000);




var http = require ('http'),
httpProxy = require ('http-proxy');

var proxy = httpProxy.createProxyServer ({target: 'http://localhost:8042'}).listen (8000);

proxy.on ('proxyRes', function (proxyReq, req, res, options) {
  // add the CORS header to the response
  res.setHeader ('Access-Control-Allow-Origin', '*');
});

proxy.on ('error', function (e) {
  // suppress errors
});