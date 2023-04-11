const express = require('express');
const countryController = require('../controllers/country');

module.exports = () => {
    var router = express.Router()

    router.get('/', countryController.getAll);
    router.get('/new', countryController.createPage);
    router.get('/:id/edit', countryController.updatePage);
    router.get('/:id', countryController.getById);
    router.post('/', countryController.create);
    router.delete('/:id', countryController.delete);
    router.put('/:id', countryController.update);

    return router;
}