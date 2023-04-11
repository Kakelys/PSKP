const express = require('express');
const officeController = require('../controllers/office');

module.exports = () => {
    var router = express.Router()

    router.get('/', officeController.getAll);
    router.get('/new', officeController.createPage);
    router.get('/:id/edit', officeController.updatePage);
    router.get('/:id', officeController.getById);
    router.post('/', officeController.create);
    router.delete('/:id', officeController.delete);
    router.put('/:id', officeController.update);

    return router;
}