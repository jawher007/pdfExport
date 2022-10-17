var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

const cors = require('cors');
app.use(cors());
var DevisController = require('./controllers/DevisController');
// global route
app.use('/api',cors(), DevisController);

module.exports = app;