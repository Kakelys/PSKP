const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { route } = require('./models');
const hbs = require('express-handlebars').create({extname: '.hbs'});

const countryRoutes = require('./routes/country')();
const officeRoutes = require('./routes/office')();
const customerRoutes = require('./routes/customer')();
const employerRoutes = require('./routes/employer')();
const routeRoutes = require('./routes/route')();

const app = express();

app.engine('.hbs', hbs.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/countries/', countryRoutes);
app.use('/offices/', officeRoutes);
app.use('/customers/', customerRoutes);
app.use('/employers/', employerRoutes);
app.use('/routes/', routeRoutes);
app.use((err, req, res, next) => {
    res.status(500).send(err.message);
})

app.listen(3000, () => { console.log('Server running on port 3000') });