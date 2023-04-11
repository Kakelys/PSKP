const customerData = require('../models').customer;

module.exports = {
    getAll: async (req, res) => {
        res.render('customer/all', {customers: await customerData.getAll()}) ;
    },
    getById: async (req, res) => {
        res.render('customer/one', {customer: await customerData.getById(req.params.id)});
    },
    createPage: async (req, res) => {
        res.render('customer/create');
    },
    create: async (req, res) => {
        await customerData.create(req.body);
        res.redirect('/customers');
    },
    delete: async (req, res) => {
        await customerData.delete(req.params.id);
        res.redirect('/customers');
    },
    updatePage: async (req, res) => {
        let cus = await customerData.getById(req.params.id);
        res.render('customer/update', {customer: cus});
    },
    update: async (req, res) => {
        console.log('here');
        customerData.update(req.params.id, req.body);
        res.redirect('/customers');
    }
}