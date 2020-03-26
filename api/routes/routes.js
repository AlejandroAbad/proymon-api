// ROUTES
 
'use strict';
module.exports = function(app) {
  var pedidosCtrl = require('../controllers/pedidosCtrl');
  var controlCtrl = require('../controllers/controlCtrl');
  
  app.route('/pedidos')
	.get(pedidosCtrl.filter);
  
  app.route('/pedidos/incidencias')
	.get(pedidosCtrl.getIncidences);
  
  app.route('/pedidos/agregacion')
	.get(pedidosCtrl.agreggate);
  
  app.route('/pedido/ultimo')
	.get(pedidosCtrl.getLast);
  
  app.route('/pedido/:crc')
  	.get(pedidosCtrl.getByCRC);
  
  app.route('/descartar/:crc')
	  .get(pedidosCtrl.discard);
  
  app.route('/consulta/:consulta')
    .get(controlCtrl.consulta);
};

