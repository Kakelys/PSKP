const express = require('express');
const customerController = require('../controllers/customer');

module.exports = () => {
    var router = express.Router()

    router.get('/', customerController.getAll);
    router.get('/new', customerController.createPage);
    router.get('/:id/edit', customerController.updatePage);
    router.get('/:id', customerController.getById);
    router.post('/', customerController.create);
    router.delete('/:id', customerController.delete);
    router.put('/:id', customerController.update);

    return router;
}