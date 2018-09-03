'use strict';

exports.query = function(params) {

	if (!params.fecha) {
		params.fecha = require('../../util/proyman.js').dateToProyman();
	}

	return [ {
		$match : {
			"chequeo.servidor" : {
				$ne : null
			},
			"fecha" : parseInt(params.fecha)
		}
	}, {
		$group : {
			_id : "$chequeo.servidor",
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