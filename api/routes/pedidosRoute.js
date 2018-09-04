// ROUTES
 
'use strict';
module.exports = function(app) {
  var pedidosCtrl = require('../controllers/pedidosCtrl');

  app.route('/')
	.get(pedidosCtrl.help);
  
  app.route('/pedidos')
	.get(pedidosCtrl.filter);
  
  app.route('/pedidos/:aggName')
  	.get(pedidosCtrl.agreggation);
  
  app.route('/pedido/ultimo')
	.get(pedidosCtrl.getLast);
  
  app.route('/pedido/:crc')
  	.get(pedidosCtrl.getByCRC);
  
  app.route('/descartar/:crc')
	.get(pedidosCtrl.discard);
  
};

