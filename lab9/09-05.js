var http = require('http');
var parseString = require('xml2js').parseString;
var xml2js = require('xml2js');

let path = `/xml`; 

let options = {
    host: 'localhost',
    path: path,
    port: 5000,
    method: 'POST',
    headers:{
        'content-type': 'application/xml', 'accept':'application/xml'
    }
}
let xml = `
<request>
<x value="5" />
<x value="5" />
<x value="1" />
<m value="da" />
<m value="-da" />
</request>`
let obj = {
    request:
    {
        x:{ '$':{value:'5'}},
        x:{ '$':{value:'5'}},
        x:{ '$':{value:'1'}},
        m:{ '$':{value:'da'}},
        m:{ '$':{value:'-da'}}
    }, 
}

let builder = new xml2js.Builder();
//let xml = builder.buildObject(obj);



let req = http.request(options, function(res) {
    let body = '';
    res.on('data', data => { body += data;})

    res.on('end', () => {
        console.log(body);
        parseString(body, function (err, result) {
            console.log(result);
        });
    });
})
.on('error', (e) => {console.log('An error occurred during request: ', e.message)})
.end(xml);