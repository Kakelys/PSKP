const express = require('express');
const employerController = require('../controllers/employer');

module.exports = () => {
    var router = express.Router()

    router.get('/', employerController.getAll);
    router.get('/new', employerController.createPage);
    router.get('/:id/edit', employerController.updatePage);
    router.get('/:id', employerController.getById);
    router.post('/', employerController.create);
    router.delete('/:id', employerController.delete);
    router.put('/:id', employerController.update);

    return router;
}