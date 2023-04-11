var http = require('http');
var url = require('url');
var fs = require('fs');

var mail = require('senovlab6');

var server = http.createServer(function (request, response){

    switch(url.parse(request.url).pathname)
    {
        case '/mail':
            
            if(request.method == 'GET')
            {
                let html = fs.readFileSync('./send.html');
                response.end(html);
            }
            else if(request.method == 'POST')
            {
                let body = '';

                request.on('data', token => {body += token.toString();});
                request.on('end', () => {
                    let parm = JSON.parse(body);
                    //ms.sendMail(parm.email);
                    mail.sendMail(parm.email);
                    response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                    response.end('OK');
                });  
            }
            else {
                response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                response.end('WRONG REQUEST METHOD');
            }

            break;
        default:
            response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            response.end(`Oops, page doesn't exist`);
            break;  
    }

}).listen(5000);

