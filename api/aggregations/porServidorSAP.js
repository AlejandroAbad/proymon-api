
'use strict';



exports.query = function ( params ) {
	
	if (!params.fecha) {
		params.fecha = require('../../util/proyman.js').dateToProyman();
	}
	
	return [
	  {
		$match: {
		  "checkeo.servidor": { $ne: null }, 
		  "fecha": params.fecha
		}
	  }, {
		$group: {
		  _id: "$checkeo.servidor", 
		  pedidos: {
			$sum: 1
		  }, 
		  lineas: {
			$sum: "$lineasInt"
		  }, 
		  tiempoCheckeo: {
			$avg: "$checkeo.tiempoEjecucion"
		  }, 
		  tiempoPedido: {
			$avg: "$pedido.tiempoEjecucion"
		  }, 
		  tiempoCheckeoMax: {
			$max: "$checkeo.tiempoEjecucion"
		  }, 
		  tiempoPedidoMax: {
			$max: "$pedido.tiempoEjecucion"
		  }, 
		  tiempoCheckeoMin: {
			$min: "$checkeo.tiempoEjecucion"
		  }, 
		  tiempoPedidoMin: {
			$min: "$pedido.tiempoEjecucion"
		  }
		}
	  }
	];

}