var http = require('http');
var url = require('url');
var fs = require('fs');
var mp = require('multiparty');


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
    try{
        switch (req.method) {
            case 'GET': get_handler(req,res); break;
            case 'POST': post_handler(req,res); break;
            default: http_error(req,res,405); break;
        }
    }catch(err){
        console.log(`Something went wrong: ${err}`);
        res.end();
    }
}

const get_handler  = (req,res) => {
    let path = url.parse(req.url).pathname;
    let urlStr = req.url.trim();
    console.log('path: ', path);
    console.log('url: ', req.url);

    
    if(path == '/files'){
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
    console.log('post on: ' + path)

    
    if(path == '/upload'){
        uploadPostResponse(req,res);
    }
    else {
        console.log('post request to: ' + url.parse(req.url).pathname)
        res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'})
        res.end(`Oops, page doesn't exist`);
    }
}

var server = http.createServer();

let port = 25566;
server.listen(port, (v) => {
    console.log(`server start on port: ${port}`);
    })
    .on('error', (e) => {console.log('error', e.message, e.stack)})
    .on('request', http_handler);

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

const isFileReturnRequest = (url) => {
    let reg = new RegExp('^\/files\/.+')
    return reg.test(url);
}

//responses

const filesResponse = (req,res) => {
    let dir = './static';
    let result = 'to download using cmd:\n curl -o filename 130.61.63.105:25566/files/filename\nusing browser:\n 130.61.63.105:25566/files/filename\n';
    result += '\n\nto upload: 130.61.63.105:25566/upload\n\n'
    result += "files in folder:\n\n"
    
    fs.readdirSync(dir).forEach(file => {
        result += file + '\n';
    })

    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'})
    res.end(result);
}

const fileReturnResponse = (req,res) => {
    let parts = url.parse(req.url).pathname.split('/');
    let filename = parts.pop() || parts.pop();
    let path = `./static/${filename}`;

    fs.exists(path, function (exists) {
        if (exists) {
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
        fs.renameSync(`./${file.path}`, `./static/${file.originalFilename}`);

        console.log(`file uploaded: ${name}, ${file.originalFilename}`);
        result = `fast download file (copy into cmd): \ncurl -o ${file.originalFilename} 130.61.63.105:25566/files/${file.originalFilename}`;
    })

    form.on('close', () => {
        res.writeHead(200, { "Content-Type": "text/plaint" });
        res.end(result);
    });

    form.parse(req);
}