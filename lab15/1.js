const http = require('http');
var url = require('url');
var fs = require('fs');

const mgClient = require('mongodb').MongoClient;


const connLine = "mongodb://localhost:27017/BSTU";
const client = new mgClient(connLine);



/*


client.connect()
.catch(err => {console.log('ERROR:', err)})
.then(_ => {
    console.log('mg connected');

    const db = client.db();
    const list = db.collection('faculty');
    list.find({}).toArray()
        .catch(err => {console.log('list ERROR:', err)})
        .then(data => {data.forEach(el => console.log(el))});
});*/


// --HTTP

async function getData(collName, condition){
    let data = {};
    await client.connect();

    if(condition == '' || condition == {})
        data = await client.db().collection(collName).find().toArray();
    else
        data = await client.db().collection(collName).find(condition).toArray();

    client.close();

    return data;
}

async function insertData(collName, json){
    await client.connect(); 

    let insertedData = await client.db().collection(collName).insertOne(json);

    client.close();

    return insertedData;
}

async function updateData(collName, condition, data){
    await client.connect(); 

    let updatedData = 
    await client.db().collection(collName).updateOne(condition, data);

    client.close();

    return updatedData;
}

async function deleteData(collName, condition){
    await client.connect(); 

    let deletedData = await client.db().collection(collName).deleteOne(condition);

    client.close();

    return deletedData;
}

let port = 5000;

const http_error = (req,res,statusCode) => {
    res.writeHead(statusCode, {'Content-Type': 'text/html; charset=utf-8'})
    res.write(`"error: " ${req.method}: ${req.url}, HTPP status ${statusCode}`);
    res.end();
}

const http_handler = (req, res) => {

    switch (req.method) {
        case 'GET': get_handler(req,res); break;
        case 'POST': post_handler(req,res); break;
        case 'PUT': put_handler(req,res); break;
        case 'DELETE': delete_handler(req,res); break;
        default: http_error(req,res,405); break;
    }
}


var server = http.createServer();
server.listen(port, (v) => {
    console.log(`server start on port: ${port}`);
    })
    .on('error', (e) => {console.log('error', e.message, e.stack)})
    .on('request', http_handler);

const get_handler = async (req,res) => {

    let link = decodeURIComponent(req.url);

    console.log('get to req.url: ', link);

    let info = getXyz(link);

    console.log(url.parse(link).pathname);
    if(link == '/api/faculties'){

        res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
        res.end(JSON.stringify(await getData('faculty', null)));

    } else if(link == '/api/pulpits'){

        res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
        res.end(JSON.stringify(await getData('pulpit', null)));

    } else if(info.link == 'faculties'){

        res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
        res.end(JSON.stringify(await getData('faculty', {faculty: {$eq: info.xyz}})));

    } else if(info.link == 'pulpits'){

        res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
        res.end(JSON.stringify(await getData('pulpit', {pulpit: {$eq: info.xyz}})));

    } else if(url.parse(link).pathname == '/api/pulpits'){

        let params = url.parse(req.url, true).query;

        if(params.f == undefined || params.f == ''){
            res.writeHead(400, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify({error: 'get', message: 'wrong params'}));
        }

        res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
        res.end(JSON.stringify(await getData('pulpit', {pulpit: {$in: params.f.split(',')}})));

    } else {
        res.writeHead(400, {'Content-Type': 'application/json; charset=utf-8'});
        res.end(JSON.stringify({error: 'get', message: 'wrong url'}));
    }

}


function getXyz(string){
    let parts = url.parse(string).pathname.split('/');

    let xyz = parts.pop();
    
    if(xyz == '/' || xyz == ''){
        xyz = parts.pop();
    }

    return {xyz: xyz, link: parts.pop()};
}

const post_handler = async (req,res) => {

    let link = decodeURIComponent(req.url);

    console.log('post to req.url: ', link);

    let info = getXyz(link);


    console.log(url.parse(link).pathname);
    if(link == '/api/faculties'){

        let body = '';
        req.on('data', data => { body += data;})

        req.on('end', async () => {
           
            let json = {};
            try{json = JSON.parse(body);}
            catch{}

            if(    json.faculty == undefined
                || json.faculty_name == undefined){
                    res.writeHead(400, {'Content-Type': 'application/json; charset=utf-8'});
                    res.end(JSON.stringify({error: 'post', message: 'wrong json params'}));
                    return;
            }
            try{ await insertData('faculty', json)}
            catch(err){
                res.writeHead(500, {'Content-Type': 'application/json; charset=utf-8'});
                res.end(JSON.stringify({error: 'post', message: err}));
            }
           
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify(json));
        });

    } else if(link == '/api/pulpits'){

        let body = '';
        req.on('data', data => { body += data;})

        req.on('end', async () => {
           
            let json = {};
            try{json = JSON.parse(body);}
            catch{}

            if(    json.pulpit == undefined
                || json.pulpit_name == undefined
                || json.faculty == undefined){
                    res.writeHead(400, {'Content-Type': 'application/json; charset=utf-8'});
                    res.end(JSON.stringify({error: 'post', message: 'wrong json params'}));
                    return;
            }
            

            try{ await insertData('pulpit', json) }
            catch(err){
                res.writeHead(500, {'Content-Type': 'application/json; charset=utf-8'});
                res.end(JSON.stringify({error: 'post', message: err}));
            }

            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify(json));
        });

    } else if(link == '/api/transaction'){

        let body = '';
        req.on('data', data => { body += data;})

        req.on('end', async () => {
           
            let json = {};
            try{json = JSON.parse(body);}
            catch{}      

            try{
                await client.connect();

                const transOpt = {
                    readConcern: {level: 'local'},
                    writeConcern: {w: 'majority'}
                }

                const session = client.startSession();
                session.startTransaction(transOpt);
                try{

                    await client.db().collection('pulpit').insertMany(json, {session});

                    await session.commitTransaction();
                } catch(err){
                    await session.abortTransaction();

                    res.writeHead(400, {'Content-Type': 'application/json; charset=utf-8'});
                    res.end(JSON.stringify({error: 'post', message: `Transaction abort:\n ${err}`}));
                    return;
                }

                await session.endSession();
                client.close();

                res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                res.end(JSON.stringify({status: 'OK :)'}));
            }
            catch(err){
                res.writeHead(500, {'Content-Type': 'application/json; charset=utf-8'});
                res.end(JSON.stringify({error: 'post', message: err}));
            }
        });

        
    } else {
        res.writeHead(400, {'Content-Type': 'application/json; charset=utf-8'});
        res.end(JSON.stringify({error: 'post', message: 'wrong url'}));
    }
}
    

const put_handler = async (req, res) => {

    let link = decodeURIComponent(req.url);

    console.log('put to req.url: ', link);

    if(link == '/api/faculties'){

        let body = '';
        req.on('data', data => { body += data;})

        req.on('end', async () => {
           
            let json = {};
            try{json = JSON.parse(body);}
            catch{}

            if(    json.faculty == undefined
                || json.faculty_name == undefined){
                    res.writeHead(400, {'Content-Type': 'application/json; charset=utf-8'});
                    res.end(JSON.stringify({error: 'put', message: 'wrong json params'}));
                    return;
            }
            try{let upd = await updateData('faculty', 
                {faculty: json.faculty},
                {$set: {faculty_name: json.faculty_name}}
            );

            if(upd.matchedCount == 0)
                throw 'Nothing tp update';
        }
            catch(err){
                res.writeHead(500, {'Content-Type': 'application/json; charset=utf-8'});
                res.end(JSON.stringify({error: 'put', message: err}));
            }
           
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify(json));
        });

    } else if(link == '/api/pulpits'){

        let body = '';
        req.on('data', data => { body += data;})

        req.on('end', async () => {
           
            let json = {};
            try{json = JSON.parse(body);}
            catch{}

            if(    json.pulpit == undefined
                || json.pulpit_name == undefined){
                    res.writeHead(400, {'Content-Type': 'application/json; charset=utf-8'});
                    res.end(JSON.stringify({error: 'put', message: 'wrong json params'}));
                    return;
            }
            try{let upd = await updateData('pulpit', 
                {pulpit: json.pulpit},
                {$set: {pulpit_name: json.pulpit_name, faculty: json.faculty}}
            );

            if(upd.matchedCount == 0)
                throw 'Nothing tp update';
            }
            catch(err){
                res.writeHead(500, {'Content-Type': 'application/json; charset=utf-8'});
                res.end(JSON.stringify({error: 'put', message: err}));
            }
           
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify(json));
        });

    } else {
        res.writeHead(400, {'Content-Type': 'application/json; charset=utf-8'});
        res.end(JSON.stringify({error: 'put', message: 'wrong url'}));
    }

}

const delete_handler = async (req,res) => {

    let link = decodeURIComponent(req.url);

    console.log('delete to req.url: ', link);

    let info = getXyz(link);

    if(info.xyz == undefined){
        res.writeHead(400, {'Content-Type': 'application/json; charset=utf-8'});
        res.end(JSON.stringify({error: 'delete', message: 'no parameter :)'}));
        return;
    }


    if(info.link == 'faculties'){
        try{
            let del = await deleteData('faculty', {faculty: info.xyz})

            if(del.deletedCount == 0){
                res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                res.end('Nothing to delete');
                return;
            }
        } catch(err){
            res.writeHead(500, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify({error: 'delete', message: err}));
            return;
        }
        

        res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
        res.end(`${info.xyz} deleted :)`);
        return;

    } else if(info.link == 'pulpits'){
        try{
            let del = await deleteData('pulpit', {pulpit: info.xyz})

            if(del.deletedCount == 0){
                res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                res.end('Nothing to delete');
                return
            }
        } catch(err){
            res.writeHead(500, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify({error: 'delete', message: err}));
            return
        }

        res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
        res.end(`${info.xyz} deleted :)`);
    } else{
        res.writeHead(400, {'Content-Type': 'application/json; charset=utf-8'});
        res.end(JSON.stringify({error: 'delete', message: 'wrong url'}));
        return
    }
}