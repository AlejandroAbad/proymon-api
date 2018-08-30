var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://proyman:87654321@hhub1.hefame.es:27017,hhub2.hefame.es:27017,hhub3.hefame.es:27017/proyman?replicaSet=rs0', { useNewUrlParser: true });

// Carga de modelos
require('./api/models/pedidosModel');


var port = process.env.PORT || 3000;
var express = require('express');

var morgan = require('morgan');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json({extended: true}));
app.use(morgan('dev'));


// Carga de rutas
var routes = require('./api/routes/pedidosRoute');
routes(app);


app.listen(port);


console.log('Servidor API Consultas Proyman v0.0.1');
console.log('Escuchando en el puerto ' + port)
