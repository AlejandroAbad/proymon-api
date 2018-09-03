'use strict';

const ProymanUtil = require('../../util/proyman.js');
exports.query = function(params) {

	if (!params.fecha) {
		params.fecha = ProymanUtil.dateToProyman();
	}

	return [ {
		$match : {
			"almacen" : {
				$ne : null
			},
			"fecha" : parseInt(params.fecha)
		}
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