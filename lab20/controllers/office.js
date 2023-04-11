const officeData = require('../models').office;
const countryData = require('../models').country;

module.exports = {
    getAll: async (req, res) => {
        res.render('office/all', {offices: await officeData.getAll()});
    },
    getById: async (req, res) => {
        res.render('office/one', {office: await officeData.getById(req.params.id)});
    },
    createPage: async (req, res) => {
        let countries = await countryData.getAll();
        res.render('office/create', {countries: countries});
    },
    create: async (req, res) => {
        await officeData.create(req.body);
        res.redirect('/offices');
    },
    delete: async (req, res) => {
        await officeData.delete(req.params.id);
        res.redirect('/offices');
    },
    updatePage: async (req, res) => {
        let off = await officeData.getById(req.params.id);
        let countries = await countryData.getAll();
        res.render('office/update', { 
            office: off, 
            countries: countries
        });
    },
    update: async (req, res) => {
        officeData.update(req.params.id, req.body);
        res.redirect('/offices');
    }
}

