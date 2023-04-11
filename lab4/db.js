
var util = require('util');
var ee = require('events');

var db_data = [
    {id: 0, name: 'Vlad', bday: '2003-06-30'},
    {id: 1, name: 'Alex', bday: '2001-03-13'},
    {id: 2, name: 'Gleb', bday: '2002-02-15'}
];

function DB(){
    this.select = ()=>{return db_data;};
    this.insert = (r)=>{
            
        if(db_data.find(x=>x.id==r.id) != undefined)
            throw new Error("ID already taken");
        db_data.push(r)
        return true;
    };
    this.delete = (r)=>{db_data.splice(db_data.indexOf(x=>x.id==r),1)}
    this.update = (r)=> 
    {
        let index = db_data.indexOf(x=>x.id==r.id);
        db_data[index].name = r.name;
        db_data[index].bday = r.bday;
    }

}

util.inherits(DB, ee.EventEmitter);

exports.DB = DB;