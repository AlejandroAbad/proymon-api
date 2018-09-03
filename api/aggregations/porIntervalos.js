'use strict';

exports.query = function(params) {

	if (!params.fecha) {
		params.fecha = require('../../util/proyman.js').dateToProyman();
	}

	if (!params.intervalo) {
		params.intervalo = 60;
	} else {
		params.intervalo = parseInt(params.intervalo);

		if (isNaN(params.intervalo))
			params.intervalo = 60;
		params.intervalo = Math.min(params.intervalo, 1440);
		params.intervalo = Math.max(params.intervalo, 1);
	}

	return [ {
		$match : {
			"fecha" : parseInt(params.fecha)
		}
	}, {
		$addFields : {
			_rango : {
				$floor : {
					$divide : [ {
						$add : [ {
							$multiply : [ {
								$floor : {
									$divide : [ "$hora", 10000 ]
								}
							}, 60 ]
						}, {
							$divide : [ {
								$mod : [ "$hora", 10000 ]
							}, 100 ]
						} ]
					}, params.intervalo /* <- ESTE ES EL INTERVALO EN MINUTOS */]
				}
			}
		}
	}, {
		$group : {
			_id : "$_rango",
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
	}, {
		$sort : {
			_id : 1
		}
	} ];

}