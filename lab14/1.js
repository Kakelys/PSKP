const {Pool} = require('pg');

var http = require('http');
var url = require('url');
var fs = require('fs');

var config = {
    user: 'postgres', 
    database: 'noda_lab', 
    password: '.Qwerty1%', 
    host: 'localhost', 
    port: 5432, 
    max: 10, // max number of clients in the pool
    min: 4,
    idleTimeoutMillis: 30000
};
const pool = new Pool(config);

async function get_data(query) {
    const result = await pool.query(query)

    return result.rows;
}

// --HTTP

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

    let url = decodeURIComponent(req.url);

    console.log('get to req.url: ', decodeURIComponent(req.url));

    if(url == '' || url == '/'){

        let html = fs.readFileSync('./3.html');
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
        res.end(html);

    } else if (url == '/api/faculties'){
        res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
        res.end(JSON.stringify(await get_data('select * from faculty;')));
    } else if (url == '/api/pulpits'){
        res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
        res.end(JSON.stringify(await get_data('select * from pulpit;')));
    } else if (url == '/api/subjects'){
        res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
        res.end(JSON.stringify(await get_data('select * from subject;')));
    } else if (url == '/api/auditoriumstypes'){
        res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
        res.end(JSON.stringify(await get_data('select * from auditorium_type aut;')));
    } else if (url == '/api/auditoriums'){
        res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
        res.end(JSON.stringify(await get_data('select * from auditorium;')));
    } else if (isGetXYZPulp(url)){
        let xyz = get_xyz(url);
        
        res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
        res.end(JSON.stringify(await get_data(`select * from pulpit where faculty = '${xyz}';`)));
    } else if (isGetXYZAud(url)){
        let xyz = get_xyz(url);
        
        res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
        res.end(JSON.stringify(await get_data(`select * from auditorium where auditorium_type = '${xyz}';`)));
    } else {
        res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
        res.end(JSON.stringify({error: 'get', message: 'wrong url'}));
    }

}

function get_xyz(string){
    let parts = url.parse(string).pathname.split('/');

    let xyz = parts.pop();

    if(xyz == '/' || xyz == ''){
        parts.pop();
        xyz = parts.pop();
    }
    else{
        xyz = parts.pop();
    }

    return xyz;
}

const post_handler = (req,res) => {

    let url = decodeURIComponent(req.url);

    console.log('post to req.url: ', url);

    if(url == '/api/pulpits'){

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
            try{
                await get_data(`insert into pulpit(pulpit, pulpit_name, faculty) 
                values ('${json.pulpit}', '${json.pulpit_name}', '${json.faculty}'); `);
            }
            catch(err){
                res.writeHead(400, {'Content-Type': 'application/json; charset=utf-8'});
                res.end(JSON.stringify({error: 'post', message: err}));
                return;
            }
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify(json));
        });

    } else if(url == '/api/subjects'){

        let body = '';
        req.on('data', data => { body += data;})

        req.on('end', async () => {
           

            let json = {};
            try{json = JSON.parse(body);}
            catch{}
            if(    json.subject == undefined 
                || json.subject_name == undefined
                || json.pulpit == undefined){
                    res.writeHead(400, {'Content-Type': 'application/json; charset=utf-8'});
                    res.end(JSON.stringify({error: 'post', message: 'wrong json params'}));
                    return;
                }
            try{
                await get_data(`insert into subject(subject, subject_name, pulpit) 
                values ('${json.subject}', '${json.subject_name}', '${json.pulpit}'); `);
            }
            catch(err){
                res.writeHead(400, {'Content-Type': 'application/json; charset=utf-8'});
                res.end(JSON.stringify({error: 'post', message: err}));
                return;
            }
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify(json));
        });

    } else if(url == '/api/auditoriumstypes'){
        
        let body = '';
        req.on('data', data => { body += data;})

        req.on('end', async () => {
           
            let json = {};
            try{json = JSON.parse(body);}
            catch{}
            if(    json.auditorium_type == undefined 
                || json.auditorium_typename == undefined){
                    res.writeHead(400, {'Content-Type': 'application/json; charset=utf-8'});
                    res.end(JSON.stringify({error: 'post', message: 'wrong json params'}));
                    return;
                }
            try{
                await get_data(`insert into auditorium_type(auditorium_type, auditorium_typename) 
                values ('${json.auditorium_type}', '${json.auditorium_typename}'); `);
            }
            catch(err){
                res.writeHead(400, {'Content-Type': 'application/json; charset=utf-8'});
                res.end(JSON.stringify({error: 'post', message: err}));
                return;
            }
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify(json));
        });

    } else if(url == '/api/auditoriums'){

        let body = '';
        req.on('data', data => { body += data;})

        req.on('end', async () => {
           
            let json = {};
            try{json = JSON.parse(body);}
            catch{}
            if(    json.auditorium == undefined 
                || json.auditorium_name == undefined
                || json.auditorium_capacity == undefined
                || json.auditorium_type == undefined){
                    res.writeHead(400, {'Content-Type': 'application/json; charset=utf-8'});
                    res.end(JSON.stringify({error: 'post', message: 'wrong json params'}));
                    return;
                }
            try{
                await get_data(`insert into auditorium(auditorium, auditorium_name,auditorium_capacity,auditorium_type) 
                values ('${json.auditorium}', '${json.auditorium_name}', '${json.auditorium_capacity}', '${json.auditorium_type}'); `);
            }
            catch(err){
                res.writeHead(400, {'Content-Type': 'application/json; charset=utf-8'});
                res.end(JSON.stringify({error: 'post', message: err}));
                return;
            }
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify(json));
        });
        
    } else {
        res.writeHead(400, {'Content-Type': 'application/json; charset=utf-8'});
        res.end(JSON.stringify({error: 'post', message: 'wrong url'}));
    }

}

const put_handler = (req,res) => {

    let url = decodeURIComponent(req.url);

    console.log('put to req.url: ', url);

    if( url == '/api/faculties' ){
        
        let body = '';
        console.log('here')
        req.on('data', data => {body += data;})

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
            try{
                await get_data(`update faculty set faculty='${json.faculty}', faculty_name = '${json.faculty_name}'
                    where faculty = '${json.faculty}';`);
            }
            catch(err){
                res.writeHead(400, {'Content-Type': 'application/json; charset=utf-8'});
                res.end(JSON.stringify({error: 'put', message: err}));
                return;
            }
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify(json));
        });

    } else if(url == '/api/pulpits') {

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
                    res.end(JSON.stringify({error: 'put', message: 'wrong json params'}));
                    return;
                }
            try{
                await get_data(`update pulpit set pulpit = '${json.pulpit}', pulpit_name = '${json.pulpit_name}', faculty = '${json.faculty}'
                where pulpit = '${json.pulpit}';`);
            }
            catch(err){
                res.writeHead(400, {'Content-Type': 'application/json; charset=utf-8'});
                res.end(JSON.stringify({error: 'put', message: err}));
                return;
            }
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify(json));
        });
        
    } else if(url == '/api/subjects') {

        let body = '';
        req.on('data', data => { body += data;})

        req.on('end', async () => {
           

            let json = {};
            try{json = JSON.parse(body);}
            catch{}
            if(    json.subject == undefined 
                || json.subject_name == undefined
                || json.pulpit == undefined){
                    res.writeHead(400, {'Content-Type': 'application/json; charset=utf-8'});
                    res.end(JSON.stringify({error: 'put', message: 'wrong json params'}));
                    return;
                }
            try{
                console.log(json.subject)
                await get_data(`update subject set subject = '${json.subject}', subject_name = '${json.subject_name}', pulpit = '${json.pulpit}'
                where subject = '${json.subject}';`);
            }
            catch(err){
                res.writeHead(400, {'Content-Type': 'application/json; charset=utf-8'});
                res.end(JSON.stringify({error: 'put', message: err}));
                return;
            }
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify(json));
        });
        
    } else if(url == '/api/auditoriums') {

        let body = '';
        req.on('data', data => { body += data;})

        req.on('end', async () => {
           
            let json = {};
            try{json = JSON.parse(body);}
            catch{}
            if(    json.auditorium == undefined 
                || json.auditorium_name == undefined
                || json.auditorium_capacity == undefined
                || json.auditorium_type == undefined){
                    res.writeHead(400, {'Content-Type': 'application/json; charset=utf-8'});
                    res.end(JSON.stringify({error: 'put', message: 'wrong json params'}));
                    return;
                }
            try{
                await get_data(`update auditorium set 
                auditorium = '${json.auditorium}',
                auditorium_name = '${json.auditorium_name}', 
                auditorium_capacity = '${json.auditorium_capacity}',
                auditorium_type = '${json.auditorium_type}'
                where auditorium = '${json.auditorium}';`);
            }
            catch(err){
                res.writeHead(400, {'Content-Type': 'application/json; charset=utf-8'});
                res.end(JSON.stringify({error: 'put', message: err}));
                return;
            }
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify(json));
        });
        
    } else if(url == '/api/auditoriumstypes') {

        let body = '';
        req.on('data', data => { body += data;})

        req.on('end', async () => {
           
            let json = {};
            try{json = JSON.parse(body);}
            catch{}
            if(    json.auditorium_type == undefined 
                || json.auditorium_typename == undefined){
                    res.writeHead(400, {'Content-Type': 'application/json; charset=utf-8'});
                    res.end(JSON.stringify({error: 'put', message: 'wrong json params'}));
                    return;
                }
            try{
                await get_data(`update auditorium_type set 
                auditorium_type = '${json.auditorium_type}',
                auditorium_typename = '${json.auditorium_typename}'
                where auditorium_type = '${json.auditorium_type}';`);
            }
            catch(err){
                res.writeHead(400, {'Content-Type': 'application/json; charset=utf-8'});
                res.end(JSON.stringify({error: 'put', message: err}));
                return;
            }
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify(json));
        });
        
    } else {
        res.writeHead(400, {'Content-Type': 'application/json; charset=utf-8'});
        res.end(JSON.stringify({error: 'put', message: 'wrong url'}));
    }

}

const delete_handler = async (req, res) => {

    let url = decodeURIComponent(req.url);

    console.log('delete to req.url: ', url);

    let info = delete_xyz(url);
    let json = {};
    let query = '';

    if(info.xyz == '' || info.xyz == undefined){
        res.writeHead(400, {'Content-Type': 'application/json; charset=utf-8'});
        res.end(JSON.stringify({error: 'delete', message: 'empty value'}));
        return;
    }

    const checkJson = json => {
        if(json == {} || json == ''){
            res.writeHead(400, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify({error: 'delete', message: 'no data in database'}));

            return false;
        }

        return true;
    }

    if(info.link == 'faculties'){

        json = await get_data(`select * from faculty where faculty = '${info.xyz}';`)
        if(!checkJson(json))
            return;

        query = `delete from faculty where faculty = '${info.xyz}';`;

    } else if(info.link == 'pulpits'){

        json = await get_data(`select * from pulpit where pulpit = '${info.xyz}';`)
        if(!checkJson(json))
            return;

        query = `delete from pulpit where pulpit = '${info.xyz}';`;

    } else if(info.link == 'subjects'){

        json = await get_data(`select * from subject where subject = '${info.xyz}';`)
        if(!checkJson(json))
            return;

        query = `delete from subject where subject = '${info.xyz}';`
        
    } else if(info.link == 'auditoriumstypes'){

        json = await get_data(`select * from auditorium_type where auditorium_type = '${info.xyz}';`)
        if(!checkJson(json))
            return;

        query = `delete from auditorium_type where auditorium_type = '${info.xyz}';`
        
    } else if(info.link == 'auditoriums'){

        json = await get_data(`select * from auditorium where auditorium = '${info.xyz}';`)
        if(!checkJson(json))
            return;

        query = `delete from auditorium where auditorium = '${info.xyz}';`
        
    } else {
        res.writeHead(400, {'Content-Type': 'application/json; charset=utf-8'});
        res.end(JSON.stringify({error: 'delete', message: 'wrong url'}));
        return;
    }

    try{
        await get_data(query);
    } catch(err){
        res.writeHead(400, {'Content-Type': 'application/json; charset=utf-8'});
        res.end(JSON.stringify({error: 'delete', message: err}));
        return;
    }
    
    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
    res.end(JSON.stringify(json));
}

function delete_xyz(string){
    let parts = url.parse(string).pathname.split('/');

    let xyz = parts.pop();

    if(xyz == '/' || xyz == ''){
        xyz = parts.pop();
    }

    return {xyz: xyz, link: parts.pop()};
}

const isGetXYZPulp = (url) => {
    let reg = new RegExp('^\/api\/faculty\/.+\/pulpits$')
    return reg.test(url);
}

const isGetXYZAud = (url) => {
    let reg = new RegExp('^\/api\/auditoriumstypes\/.+\/auditoriums$')
    return reg.test(url);
}