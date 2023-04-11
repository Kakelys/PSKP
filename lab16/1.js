const http = require('http');
const fs = require('fs');
const { graphql, buildSchema } = require('graphql');
const {DB, resolver} = require('./db');

const schema = buildSchema(fs.readFileSync('./schema.gql').toString());

const http_error = (req,res,statusCode) => {
    res.writeHead(statusCode, {'Content-Type': 'text/html; charset=utf-8'})
    res.write(`"error: " ${req.method}: ${req.url}, HTPP status ${statusCode}`);
    res.end();
}

const http_handler = (req,res) => {
    switch (req.method) {
        //case 'GET': get_handler(req,res); break;
        case 'POST': post_handler(req,res); break;
        //case 'PUT': put_handler(req,res); break;
        //case 'DELETE': delete_handler(req,res); break;
        default: http_error(req,res,405); break;
    }
}

const server = http.createServer().listen(5000, _ => {console.log('server listening on port: ', 5000)})
.on('error', err => {console.log('server error: ', err)})
.on('request', http_handler);


const post_handler = (req,res) => {
    let body = '';

    req.on('data', data => {body += data;});

    req.on('end', () => {
        try{
            let obj = JSON.parse(body);
            graphql(schema, obj.query, resolver, DB, obj.variables)
            .catch( err => console.log('graphql ERROR: ', err))
            .then( resp => {
                if(resp){
                    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
                    res.end(JSON.stringify(resp.data));
                } else {
                    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
                    res.end(JSON.stringify({error: 'post', message: 'graphql error'}));
                }
            });

        } catch(err){
            console.log('ERROR: ', err);
            res.writeHead(400, {'Content-Type': 'application/json; charset=utf-8'})
            res.end(JSON.stringify({error: 'post', message: 'bad json'}));
        }
    })
}

