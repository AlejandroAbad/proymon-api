'use strict';

const ProymanUtil = require('../../util/proyman.js');
exports.query = function(params) {

	var match = {};
	
	// FECHA
	if (!params.fecha) {
		match.fecha = ProymanUtil.dateToProyman();
	} else {
		match.fecha = params.fecha;
	}
	

	return [ {
		$match : match
	}, {
		$group : {
			_id : "$almacen",
			pedidos : {
				$sum : 1
			},
			lineas : {
				$sum : "$lineas"
			},
			tiempoChequeo : {
				$avg : "$chequeo.tiempoEjecucion"
			},
			tiempoPedido : {
				$avg : "$pedido.tiempoEjecucion"
			},
			tiempoChequeoMax : {
				$max : "$chequeo.tiempoEjecucion"
			},
			tiempoPedidoMax : {
				$max : "$pedido.tiempoEjecucion"
			},
			tiempoChequeoMin : {
				$min : "$chequeo.tiempoEjecucion"
			},
			tiempoPedidoMin : {
				$min : "$pedido.tiempoEjecucion"
			}
		}
	} ];

}