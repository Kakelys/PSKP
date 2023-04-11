
const routeData = require('../models').route;
const countryData = require('../models').country;

module.exports = {
    getAll: async (req, res) => {
        res.render('route/all', {routes: await routeData.getAll()});
    },
    getById: async (req, res) => {
        res.render('route/one', {route: await routeData.getOne(req.params.id)});
    },
    createPage: async (req, res) => {
        var countries = await countryData.getAll();
        res.render('route/create', {
            countries: countries
        });
    },
    create: async (req, res) => {
        var route = await routeData.create(req.body);
        res.redirect('/routes');
    },
    updatePage: async (req, res) => {
        var route = await routeData.getById(req.params.id);
        res.render('route/update', {
            route: route
        });
    },
    update: async (req, res) => {
        await routeData.update(req.params.id, req.body);
        res.redirect('/routes');
    },
    delete: async (req, res) => {
        await routeData.delete(req.params.id);
        res.redirect('/routes');
    }

}