var http = require('http');
var url = require('url');
var fs = require('fs');
var data = require('./db');

var db = new data.DB();
let collectStats = false;

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

var server = http.createServer(function (request, response){

    switch(url.parse(request.url).pathname)
    {
        case '/api/ss':
            let json = JSON.stringify(
                {
                    requests: requestTimes, 
                    commits: commitTimes, 
                    startTime: formatDate(startTime), 
                    endTime: formatDate(endTime)
                });
            response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
            response.end(json);
            break;
        case '/api/db':
            if(collectStats)
            {
                requestTimes++;
            }
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

let commitTimes;
let requestTimes;
let startTime;
let endTime;

let stopTimeout;
let commitInterval;
let statTimeout;


process.stdin.on('readable', () => {

    let token = null;
    let args = [];
    while((token = process.stdin.read()) != null)
    {
        args = (token + '').split(' ');

        for(let i = 0; i < args.length; i++)
        {
            args[0] = args[0].replace('\r\n', '');
        }
    }
    
    if(args.length == 0)
        return;

    switch(args[0])
    {
        case 'sd':
            if(args[1] == undefined)
            {
                clearTimeout(stopTimeout);
                break;
            }

            stopTimeout = setTimeout(()=>
            {
                process.exit(0);
            },args[1]);
            stopTimeout.unref();

            break;
        case 'sc': 
            if(args[1] == undefined)
            {
                clearInterval(intervalCommit);
                break;
            }

            intervalCommit = setInterval(()=>
            {
                if(collectStats)
                {
                    commitTimes++;
                }
                db.commit();
            }, args[1])
            intervalCommit.unref();

            break;
        case 'ss': 
            if(args[1] == undefined)
                break;
            collectStats = true;
            requestTimes = 0;
            commitTimes = 0;
            startTime = Date.now();
            endTime = null;

            statTimeout = setTimeout(()=>
            {
                collectStats = false;
                endTime = Date.now();
                let json = JSON.stringify(
                    {
                        requests: requestTimes, 
                        commits: commitTimes, 
                        startTime: formatDate(startTime), 
                        endTime: formatDate(endTime)
                    });
                console.log(json);
            }, args[1]);
            statTimeout.unref();

            break;
        default:
            process.stdout.write("Command doesn't match anything");
            break;
    }

})

function formatDate(date) {
    if(date == null || date == undefined)
        return "";
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}



var http = require ('http'),
httpProxy = require ('http-proxy');
const { format } = require('path');

var proxy = httpProxy.createProxyServer ({target: 'http://localhost:8042'}).listen (8000);

proxy.on ('proxyRes', function (proxyReq, req, res, options) {
  // add the CORS header to the response
  res.setHeader ('Access-Control-Allow-Origin', '*');
});

proxy.on ('error', function (e) {
  // suppress errors
});