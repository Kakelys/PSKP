
var http = require('http');
var fs = require('fs');

var url = require('url');

const rpcWSS = require('rpc-websockets').Server;
const wsserver=new rpcWSS({port:4000, host:"localhost"});
wsserver.event('Change file');
let isStudentList = (fn)=>{ let reg = new RegExp("[0-9]+_StudentList.json"); return reg.test(fn);}
let writeHTTP405=(res)=>{
	res.statusCode = 405;
	res.statusMessage = 'wrong method';
	res.end('wrong method');
}

var server=http.createServer((req, res) => {
    fs.watch("./StudentList.json",(event,f)=>
    {
        if(f) wsserver.emit("Change file");
    })
	http_handler(req,res);

    
}).listen(5000);
console.log('server is running on port 5000');

let http_handler=(req,res)=>
{
	if(req.method=='GET'){
		if(url.parse(req.url).pathname === '/'){
            let result='';
            fs.readFile('./Studentlist.json',(e,data)=>
            {
                if(e) 
                    console.log('Error: ',e);
                else {
                    result+=data.toString();
                    res.writeHead(200,{'Content-Type': 'application/json'});
                    res.end(result);
                }
            });
		}
		else if(url.parse(req.url).pathname.search('\/[1-9]+')!=(-1))
		{
            let result='';
            let p = url.parse(req.url,true);
			let r =decodeURI(p.pathname).split('/');
            let x=+r[1];
            fs.readFile('./Studentlist.json',(e,data)=>
            {
                if(e) console.log('Error: ',e);
                else {
                    let os=JSON.parse(data);
                    os.forEach(element => {
                        if(element.id==x)
                        {
                            result={id:element.id, name:element.name,bday:element.bday, specility:element.specility}; 
                        }
                    });
                    if(result!='')
                    {
                        console.log(result);
                        res.writeHead(200,{'Content-Type': 'application/json'});
                        res.end(JSON.stringify(result));
                    }
                    else
                    {
                        let error='{"error":"Student doesn`t exist"}';
                        res.writeHead(200,{'Content-Type': 'application/json'});
                        res.end(error);
                    }
                }
            });
        }
        else if(url.parse(req.url).pathname === '/backup')
        {
            let result="[";
            fs.readdirSync('./').map(fileName => {
                console.log(fileName);
                if(isStudentList(fileName))
                {
                    console.log(fileName);
                    result+='{"filename":"'+fileName+'"},';
                }
            });
            result = result.substring(0, result.length - 1);
            result+=']';

            res.writeHead(200,{'Content-Type': 'application/json'});
            res.end(result);
        }
		else res.end('Empty');
	}
	else if(req.method=='POST'){
		if(url.parse(req.url).pathname=== '/')
		{
            let body='';
            let result2='[';
            let x=0;
			req.on('data',chunk=>{body+=chunk.toString();});
			req.on('end',()=>{
                let result='';
                console.log("Enter in POST /");
                x=JSON.parse(body).id;
                fs.readFile('./Studentlist.json',(e,data)=>
                {
                    if(e) console.log('Ошибка: ',e);
                    else {
                    console.log("Start read");
                    let os=JSON.parse(data);
                    console.log(x);
                    os.forEach(element => {
                        result2+=`{"id":${element.id}, "name":"${element.name}","bday":"${element.bday}","specility":"${element.specility}"},`;
                        console.log(result2);
                        if(element.id==x)
                        {
                           result+='1';
                        }
                        });
                        if(result=='')
                {
                result2+=body+']';

                fs.writeFile('./Studentlist.json', result2,(e)=>
                {
                    if(e) throw e;
                    console.log("Success");
                });

                res.writeHead(200,{'Content-Type': 'application/json'});
                res.end(body);

                }
                else {

                    let error='{"error":"Student with same id already exist"}';
                    res.writeHead(200,{'Content-Type': 'application/json'});
                    res.end(error);

                }}});
			});
        }
        else if(url.parse(req.url).pathname=== '/backup')
		{
            setTimeout(()=>
            {
                let date=new Date();
                let name="";

                name+=date.getFullYear();
                name+= (date.getMonth()+1) < 10 ? '0' + (date.getMonth()+1) : (date.getMonth()+1);
                name+= date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
                name+= date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
                name+= date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
                name+="_StudentList.json";
                console.log(name);

                fs.copyFile("./StudentList.json","./"+name,(e)=>
                {
                    if(e) 
                    {
                        console.log("Error: backup", e);
                        res.writeHead(200,{'Content-Type': 'text/html;charset=utf-8'});
                        res.end('Error while creating backup');
                    }
                    else 
                    {
                        fs.watch(`./${name}`,(event,f)=>
                        {
                            if(f) wsserver.emit("Change file");
                        })
                        console.log("backup success");
                        res.writeHead(200,{'Content-Type': 'text/html;charset=utf-8'});
                        res.end('backup created successfully');
                    }
                });
            },2000); 
        }
		else res.end('Nothing on this pages');
    }
    else if(req.method=='PUT'){
        if(url.parse(req.url).pathname=== '/')
		{
            let body='';
            let k=0;

			req.on('data',chunk=>{body+=chunk.toString();});

			req.on('end',()=>{
                let result='[';
                let x=JSON.parse(body).id;
                console.log(x);
                fs.readFile('./Studentlist.json',(e,data)=>
                {
                    if(e) console.log('Error: ',e);
                    else {       
                        let os=JSON.parse(data);
                        os.forEach(element => {
                            console.log(result);
                            if(x==element.id){
                                result+=body+',';
                                k=1;
                            }
                            else result +=`{"id":${element.id}, "name":"${element.name}","bday":"${element.bday}","specility":"${element.specility}"},`;
                        });
                        }
                        if(k==1){
                            result=result.substring(0,result.length-1);
                            result+=']';
                            fs.writeFile('./Studentlist.json', result,(e)=>
                            {
                                if(e) throw e;
                                console.log("Successfully saved");
                            });
                            res.writeHead(200,{'Content-Type': 'application/json'});
                            res.end(body);
                        }
                        else
                        { 
                            let error='{"error":"Such student doesn`t exist"}';
                            res.writeHead(200,{'Content-Type': 'application/json'});
                            res.end(error);
                        }
                });
				});
    }
}
else if(req.method=='DELETE'){
    if(url.parse(req.url).pathname.search('\/backup\/[1-9]+')!=(-1))
    {
        let p = url.parse(req.url,true);
        let r = decodeURI(p.pathname).split('/');
        let x = r[2];
        let queryDate = new Date(`${x[0]}${x[1]}${x[2]}${x[3]}-${x[6]}${x[7]}-${x[4]}${x[5]}`);

        fs.readdirSync('./').map(fileName => {
            if(isStudentList(fileName))
            {
                let result=fileName.split('_')[0];
               

                let fileDate = new Date(`${result[0]}${result[1]}${result[2]}${result[3]}-${result[4]}${result[5]}-${result[6]}${result[7]}`);
                if(fileDate < queryDate)
                {
                    console.log('deleting file: ',fileName);
                    fs.unlinkSync("./"+fileName,(e)=>
                    {
                        if(e) console.log("Error: ",e);
                    })
                }
            }
        });
        res.end("Complete deleting");
    }
    else if(url.parse(req.url).pathname.search('\/[1-9]+')!=(-1))
    {
        let k=0;
        let body="";
        let p = url.parse(req.url,true);
        let r =decodeURI(p.pathname).split('/');
        let x = +r[1];
        let result='[';
        console.log(x);
        fs.readFile('./Studentlist.json',(e,data)=>
          {
            if(e) console.log('Error: ',e);
            else {       
                    let os=JSON.parse(data);
                    os.forEach(element => {
                    console.log(result);
                    if(x==element.id)
                    {
                        body +=`{"id":${element.id}, "name":"${element.name}","bday":"${element.bday}","specility":"${element.specility}"},`;
                        k=1;
                    }
                    else result +=`{"id":${element.id}, "name":"${element.name}","bday":"${element.bday}","specility":"${element.specility}"},`;
                });
                }
                if(k==1)
                {
                    result=result.substring(0,result.length-1);
                    result+=']';
                    fs.writeFile('./Studentlist.json', result,(e)=>
                    {
                        if(e) throw e;
                        console.log("Complete deleting");
                    });
                    res.writeHead(200,{'Content-Type': 'application/json'});
                    res.end(body);
                }
                else
                { 
                    res.writeHead(200,{'Content-Type': 'text/html'});
                    res.end('Such student doesn`t exist');
                }
        });
}}
else 
    writeHTTP405(res);
}
