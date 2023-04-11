
var fs = require('fs');

function Static(basePath){
    this.basePath = basePath || '/static';

    const pathToFile = (fileName) => {return  '.'+this.basePath  +'/'+ fileName;};

    const writeHTTP404 = (res) => {
        res.statusCode = 404;
        res.end("Resourse not found");
    }

    this.sendStaticResponse = (req,res) => {
        if      (isCertainExtension(req.url, 'html')) sendFile(req,res, {'Content-Type': 'text/html; charset=utf-8'});
        else if (isCertainExtension(req.url, 'css')) sendFile(req,res, {'Content-Type': 'text/css; charset=utf-8'});
        else if (isCertainExtension(req.url, 'js')) sendFile(req,res, {'Content-Type': 'text/javascript; charset=utf-8'});
        else if (isCertainExtension(req.url, 'png')) sendFile(req,res, {'Content-Type': 'image/png; charset=utf-8'});
        else if (isCertainExtension(req.url, 'docx')) sendFile(req,res, {'Content-Type': 'application/msword; charset=utf-8'});
        else if (isCertainExtension(req.url, 'json')) sendFile(req,res, {'Content-Type': 'application/json; charset=utf-8'});
        else if (isCertainExtension(req.url, 'xml')) sendFile(req,res, {'Content-Type': 'application/xml; charset=utf-8'});
        else if (isCertainExtension(req.url, 'mp4')) sendFile(req,res, {'Content-Type': 'video/mp4; charset=utf-8'});
        else writeHTTP404(res);
    }

    const isCertainExtension = (url, ext) => {
        {let reg = new RegExp(`^\/static\/.+.${ext}`); return reg.test(url);}
    }

    const pipeFile = (req, res, headers, path) => {
        res.writeHead(200, headers);
        fs.createReadStream(path).pipe(res);
    }

    this.isStatic = (url) => {
        let reg = new RegExp(`^${this.basePath}+\/`); return reg.test(url);
    }
    
    const sendFile = (req, res, headers) => {
        let parts = req.url.split('/');
        let fileName = parts.pop() || parts.pop();
        let path = pathToFile(fileName);

        fs.access(path, fs.constants.R_OK, err => {
            if(err) writeHTTP404(res);
            else pipeFile(req, res, headers, path);
        });
    }
}

module.exports = (basePath) => {return new Static(basePath)};