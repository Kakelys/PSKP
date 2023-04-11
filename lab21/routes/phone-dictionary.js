const express = require('express');
const phoneDictionaryController = require('../controllers/phone-dictionary');

module.exports = () => {
    var router = express.Router()

    router.get('/', phoneDictionaryController.mainPage);
    router.get('/new', phoneDictionaryController.addPage);
    router.post('/new', phoneDictionaryController.add);
    router.get('/update/:id', phoneDictionaryController.updatePage);
    router.post('/update/:id', phoneDictionaryController.update);
    router.post('/delete/:id', phoneDictionaryController.delete);

    return router;
}