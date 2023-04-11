const {Sequelize, Op}  = require('sequelize');

const sequelize = new Sequelize('noda_lab', 'postgres', '.Qwerty1%', {
    host: 'localhost',
    dialect: 'postgres',
    define: {
        hooks: {
            beforeBulkDestroy: (instance, options) => {
                console.log('beforeDelete global hook');
            }
        }
    }
});

async function testConnection(req,res,next) {
    try{
        await sequelize.authenticate()
        return null;
    } catch (err) {return new Error('db conn failed'); }
}

const {Faculty, Pulpit, Teacher, Subject, Auditorium_type, Auditorium} = require('./initORM').initORM(sequelize);

const express = require('express');
const app = express();
const port = 5000;

app.use(express.json());

app.use(async (req,res,next) => {
    console.log(req.method, req.url);
    if(req.url == '' || req.url == '/')
        next();
    
    let testCon = await testConnection(req,res,next);
    if(testCon){
        next(testCon);
    }

    next();
})

app.get('/', (req, res) => {
    res.sendFile('./page.html', {root: __dirname});
});

app.get('/api/faculties', async (req, res, next) => {
    let arr = [];
    
    Faculty.findAll().then(fac => {
            fac.forEach(el => {
                arr.push(el.dataValues);
            });
            res.send(JSON.stringify(arr));
    }).catch(err => {next(err)});

});

app.get('/api/pulpits', (req, res, next) => {
    let arr = [];

    Pulpit.findAll().then(pul => {
        pul.forEach(el => {
            arr.push(el.dataValues);
        });
        res.send(JSON.stringify(arr));
    }).catch(err => {next(err)})
});

app.get('/api/teachers', (req, res, next) => {
    let arr = [];
    Teacher.findAll().then(tea => {
        tea.forEach(el => {
            arr.push(el.dataValues);
        });
        res.send(JSON.stringify(arr));
    }).catch(err => {next(err)})
});

app.get('/api/subjects', (req, res, next) => {
    let arr = [];

    Subject.findAll().then(sub => {
        sub.forEach(el => {
            arr.push(el.dataValues);
        });
        res.send(JSON.stringify(arr));
    }).catch(err => {next(err)})
});

app.get('/api/auditoriumstypes', (req, res, next) => {
    let arr = [];

    Auditorium_type.findAll().then(aud => {
        aud.forEach(el => {
            arr.push(el.dataValues);
        });
        res.send(JSON.stringify(arr));
    }).catch(err => {next(err)})
});

app.get('/api/auditoriums', (req, res, next) => {
    let arr = [];

    Auditorium.findAll().then(aud => {
        aud.forEach(el => {
            arr.push(el.dataValues);
        });
        res.send(JSON.stringify(arr));
    }).catch(err => {next(err)})
});

app.get('/api/task4', (req, res, next) => {
    let arr = [];

    Auditorium.scope('task4').findAll()
    .then(aud => {
        aud.forEach(el => {
            arr.push(el.dataValues);
        });
        res.send(JSON.stringify(arr));
    }).catch(err => {next(err)})
});


app.get('/api/faculties/:xyz/subjects', (req,res,next) => {
    let arr = [];
    
    Faculty.hasMany(Pulpit, {foreignKey: 'faculty', sourceKey:'faculty'});

    Faculty.findAll({include: Pulpit, where:{faculty: req.params.xyz}})
    .then(async fac => {      
        await fac.forEach(async el => {
            arr.push({faculty: el.dataValues.faculty});

    
            for(let i = 0; i < el.dataValues.Pulpits.length + 1; i++){
                if(i == el.dataValues.Pulpits.length){
                    res.send(JSON.stringify(arr));
                    break;
                }
    
                let subjects = await Subject.findAll({where:{pulpit: el.dataValues.Pulpits[i].pulpit}});
    
                subjects.forEach(elel => {
                    arr.push({subject:elel.dataValues.subject});
                })
            }
        });
    }).catch(err => {next(err)});

});

app.get('/api/auditoriumstypes/:xyz/auditoriums', (req,res, next) => {
    let arr = [];

    Auditorium_type.hasMany(Auditorium, {foreignKey: 'auditorium_type', sourceKey:'auditorium_type'});

    Auditorium_type.findAll({include: Auditorium, where:{auditorium_type: req.params.xyz}})
    .then(fac => {
        fac.forEach(el => {
           arr.push(el.dataValues);
        });
        res.send(JSON.stringify(arr));
    }).catch(err => {next(err)})
});


app.post('/api/faculties', (req,res,next) => {
    Faculty.create(req.body)
    .then(data => res.end(JSON.stringify(data.dataValues)))
    .catch(err => {next(err)})
});

app.post('/api/pulpits', async (req,res) => {
    Pulpit.create(req.body)
    .then(data => res.end(JSON.stringify(data.dataValues)))
    .catch(err => {next(err)});
})

app.post('/api/subjects', async (req,res) => {
    Subject.create(req.body)
    .then(data => res.end(JSON.stringify(data.dataValues)))
    .catch(err => {next(err)});
})

app.post('/api/teachers', async (req,res) => {
    Teacher.create(req.body)
    .then(data => res.end(JSON.stringify(data.dataValues)))
    .catch(err => {next(err)});
})

app.post('/api/auditoriumstypes', async (req,res) => {
    Auditorium_type.create(req.body)
    .then(data => res.end(JSON.stringify(data.dataValues)))
    .catch(err => {next(err)})
})

app.post('/api/auditoriums', async (req,res) => {
    Auditorium.create(req.body)
    .then(data => res.end(JSON.stringify(data.dataValues)))
    .catch(err => {next(err)});
})

app.post('/api/transaction', async (req, res, next) => {

    sequelize.transaction()
    .then( t => {
        
        Auditorium.update({auditorium_capacity: 0}, {where: {auditorium_capacity: {[Op.gt]: -1}}, transaction: t})
        .then(_ => {
            console.log('auditoriums capacity sets to zero :0');
            setTimeout(_ => {t.rollback(); console.log('Rollback capacity :0');res.send('All successfully rollbacked :0')}, 10000);
        }).catch(err => {next(err);t.rollback();});
        
    }).catch(err => {next(err)});
});



app.put('/api/faculties', async (req,res, next) => {
    Faculty.update(req.body, {where: {faculty: req.body.faculty}})
    .then(data =>{delete req.body["option"];  res.end(JSON.stringify(req.body))})
    .catch(err => {next(err)});
})

app.put('/api/pulpits', async (req,res, next) => {
    Pulpit.update(req.body, {where: {pulpit: req.body.pulpit}})
    .then(data =>{delete req.body["option"];  res.end(JSON.stringify(req.body))})
    .catch(err => {next(err)});
})

app.put('/api/subjects', async (req,res, next) => {
    Subject.update(req.body, {where: {subject: req.body.subject}})
    .then(data =>{delete req.body["option"];  res.end(JSON.stringify(req.body))})
    .catch(err => {next(err)});
})

app.put('/api/teachers', async (req,res, next) => {
    Teacher.update(req.body, {where: {teacher: req.body.teacher}})
    .then(data =>{delete req.body["option"];  res.end(JSON.stringify(req.body))})
    .catch(err => {next(err)});
})

app.put('/api/auditoriumstypes', async (req,res, next) => {
    Auditorium_type.update(req.body, {where: {auditorium_type: req.body.auditorium_type}})
    .then(data =>{delete req.body["option"];  res.end(JSON.stringify(req.body))})
    .catch(err => {next(err)});
})

app.put('/api/auditoriums', async (req,res, next) => {
    Auditorium.update(req.body, {where: {auditorium: req.body.auditorium}})
    .then(data =>{delete req.body["option"];  res.end(JSON.stringify(req.body))})
    .catch(err => {next(err)});
})



app.delete('/api/faculties/:xyz', async (req,res, next) => {
    let deletedObj = {};
    await Faculty.findOne({where: {faculty: req.params.xyz}}).then(data =>  {
        if (data?.dataValues)
            deletedObj = data.dataValues
    });

    Faculty.destroy({where: {faculty: req.params.xyz}})
    .then(_ => res.end(JSON.stringify(deletedObj)))
    .catch(err => {next(err)});
})

app.delete('/api/pulpits/:xyz', async (req,res, next) => {
    let deletedObj = {};
    await Pulpit.findOne({where: {pulpit: req.params.xyz}}).then(data =>  {
        if (data?.dataValues)
            deletedObj = data.dataValues
    });

    Pulpit.destroy({where: {pulpit: req.params.xyz}})
    .then(_ => res.end(JSON.stringify(deletedObj)))
    .catch(err => {next(err)});
})

app.delete('/api/subjects/:xyz', async (req,res, next) => {
    let deletedObj = {};
    await Subject.findOne({where: {subject: req.params.xyz}}).then(data =>  {
        if (data?.dataValues)
            deletedObj = data.dataValues
    });

    Subject.destroy({where: {subject: req.params.xyz}})
    .then(_ => res.end(JSON.stringify(deletedObj)))
    .catch(err => {next(err)})
})

app.delete('/api/teachers/:xyz', async (req,res, next) => {
    let deletedObj = {};
    await Teacher.findOne({where: {teacher: req.params.xyz}}).then(data =>  {
        if (data?.dataValues)
            deletedObj = data.dataValues
    });

    Teacher.destroy({where: {teacher: req.params.xyz}})
    .then(_ => res.end(JSON.stringify(deletedObj)))
    .catch(err => {next(err)})
})

app.delete('/api/auditoriumstypes/:xyz', async (req,res, next) => {
    let deletedObj = {};
    await Auditorium_type.findOne({where: {auditorium_type: req.params.xyz}}).then(data =>  {
        if (data?.dataValues)
            deletedObj = data.dataValues
    });

    Auditorium_type.destroy({where: {auditorium_type: req.params.xyz}})
    .then(_ => res.end(JSON.stringify(deletedObj)))
    .catch(err => {next(err)})
})

app.delete('/api/auditoriums/:xyz', async (req,res, next) => {
    let deletedObj = {};
    await Auditorium.findOne({where: {auditorium: req.params.xyz}}).then(data =>  {
        if (data?.dataValues)
            deletedObj = data.dataValues
    });

    Auditorium.destroy({where: {auditorium: req.params.xyz}})
    .then(_ => res.end(JSON.stringify(deletedObj)))
    .catch(err => {next(err)})
})

app.use(function(err, req, res, next){
    console.error(err);
    res.status(500);
    res.send({error: err.message});
});



app.listen(port, () => {
    console.log("Server started on port 5000");
});