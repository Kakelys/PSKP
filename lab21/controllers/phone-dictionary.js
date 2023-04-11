const testValues = [
    {name: 'John', phone: '1234567890'},
    {name: 'Mary', phone: '0987654321'},
    {name: 'Peter', phone: '1234567890'}
]
const fs = require('fs');
const dataPath = __dirname + '/../public/data.json';
module.exports = {

    mainPage: async (req, res) => {
        data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        res.render('main', {phones: data});
    },
    addPage: async (req, res) => {
        data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        res.render('new', {phones: data});
    },
    add: async (req, res) => {
        data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        let maxId = Math.max(...data.map(x=>x.id));
        let newPhone = {id: maxId+1, name: req.body.name, phone: req.body.phone}
        data.push(newPhone);
        fs.writeFileSync(dataPath, JSON.stringify(data));
        res.redirect('/');
    },
    updatePage: async (req, res) => {
        data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        let id = req.params.id;
        let phone = data.find(x=>x.id == id);
        res.render('update', {phone: phone, phones: data});
    },
    update: async (req, res) => {
        console.log('update thing')
        data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        let id = req.params.id;
        let phone = data.find(x=>x.id == id);
        phone.name = req.body.name;
        phone.phone = req.body.phone;
        fs.writeFileSync(dataPath, JSON.stringify(data));
        res.redirect('/');
    },
    delete: async (req, res) => {

        data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        let id = req.params.id;
        let phone = data.find(x=>x.id == id);
        let index = data.indexOf(phone);
        data.splice(index, 1);
        fs.writeFileSync(dataPath, JSON.stringify(data));
        res.redirect('/');
    }
}