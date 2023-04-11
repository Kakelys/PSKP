const express = require('express');
const routeController = require('../controllers/route');

module.exports = () => {
    var router = express.Router()

    router.get('/', routeController.getAll);
    router.get('/new', routeController.createPage);
    router.get('/:id/edit', routeController.updatePage);
    router.get('/:id', routeController.getById);
    router.post('/', routeController.create);
    router.delete('/:id', routeController.delete);
    router.put('/:id', routeController.update);

    return router;
}