const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const hbs = require('express-handlebars').create(
    {
        extname: '.hbs',
        helpers: {
            cancel: (context, options) => {
                return '<a href="/" class="btn btn-outline-danger">Cancel</a>';
            }
        }
    });

const phoneDictionaryRoutes = require('./routes/phone-dictionary')();

const app = express();

app.engine('.hbs', hbs.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');

app.use('/static/',express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(phoneDictionaryRoutes);




app.listen(3000, () => { 
    console.log('Server running on port 3000');
});