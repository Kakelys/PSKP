
var http = require('http');
var fs = require('fs');

http.createServer(function (request,response)
{
    let html = '<h1>Page not found<h1>';
    let jpg = null;

    console.log(request.url);
    switch(request.url)
    {
        case '/png':
            console.log('png open');
            fs.stat('./fox.jpg',(err,stat)=>
            {
                if(err){console.log('error:',err)}
                else
                {
                    jpg = fs.readFileSync('./fox.jpg');
                    response.writeHead(200, {'Content-Type': 'image/jpeg', 'Content-Length':stat.size})
                    response.end(jpg,'binary');
                }
            });
            break;

        case '/html':
            console.log('html open');
            response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            html = fs.readFileSync('./index.html');
            response.end(html);
            break;

        case '/api/name':
            console.log('api/name open');
            response.writeHead(200, {'Content-Type': 'text/text; charset=utf-8'})
            response.end("Senchyena Vladislav Igorevich")
            break;

        case '/xmlhttprequest':
            console.log('xmlhttprequest open')
            response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            html = fs.readFileSync('./xmlhttprequest.html');
            response.end(html);
            break;

        case '/fetch':
            console.log('fetch open');
            response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            html = fs.readFileSync('./fetch.html');
            response.end(html);
            break;

        case '/jquery':
                console.log('jquery open');
                response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                html = fs.readFileSync('./jquery.html');
                response.end(html);
                break;

        default:
            console.log('not loaded');
            response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            response.end(html);
            break;
    }
    
}).listen(5000);

console.log('Server is running')