const countryData = require('../models').country;
const folder = 'country/';
module.exports = {
    getAll: async (req, res) => {
        res.render(folder+'countries', {countries: await countryData.getAll()});
    },
    getById: async (req, res) => {
        var country = await countryData.getById(req.params.id);
        res.render(folder + 'country', {country: country});
    },
    createPage: async (req, res) => {
        res.render('country/create');
    },
    create: async (req, res) => {
        await countryData.create(req.body);
        res.redirect('/countries');
    },
    delete: async (req, res) => {
        await countryData.delete(req.params.id);
        res.redirect('/countries');
    },
    updatePage: async (req, res) => {
        var country = await countryData.getById(req.params.id);
        res.render('country/update', {country: country});
    },
    update: async (req, res) => {
        await countryData.update(req.params.id, req.body);
        res.redirect('/countries');
    }
}