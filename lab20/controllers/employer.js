const employerData = require('../models').employer;
const officeData = require('../models').office;

module.exports = {
    getAll: async (req, res) => {
        res.render('employer/all', {employers: await employerData.getAll()}) ;
    },
    getById: async (req, res) => {
        res.render('employer/one', {employer: await employerData.getById(req.params.id)});
    },
    createPage: async (req, res) => {
        let offices = await officeData.getAll();
        res.render('employer/create', {
            offices: offices
        });
    },
    create: async (req, res) => {
        await employerData.create(req.body);
        res.redirect('/employers');
    },
    updatePage: async (req, res) => {
        res.render('employer/update', {employer: await employerData.getById(req.params.id)});
    },
    update: async (req, res) => {
        employerData.update(req.params.id, req.body);
        res.redirect('/employers');
    },
    delete: async (req, res) => {
        await employerData.delete(req.params.id);
        res.redirect('/employers');
    }
}