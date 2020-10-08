var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://proyman:87654321@mdb.hefame.es/proyman', { 
	useNewUrlParser: true,
	useUnifiedTopology: true
});

// Carga de modelos
require('./api/models/pedidosModel');
require('./api/models/controlModel');

var app = require('express')();
app.use(require('body-parser').json({extended: true}));

var port = process.env.PORT || 40081;
app.listen(port);

// Carga de rutas
var routes = require('./api/routes/routes');
routes(app);


console.log('Servidor API Consultas Proyman v1.1.0');
console.log('Escuchando en el puerto ' + port)
