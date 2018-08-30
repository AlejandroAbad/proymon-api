
'use strict';



exports.query = function ( params ) {
	
	if (!params.fecha) {
		params.fecha = require('../../util/proyman.js').dateToProyman();
	}
	
	if (!params.intervalo) {
		params.intervalo = 60;
	} else {
		params.intervalo = parseInt(params.intervalo);
		
		if (isNaN(params.intervalo)) params.intervalo = 60;
		params.intervalo = Math.min(params.intervalo, 1440);
		params.intervalo = Math.max(params.intervalo, 1);
	}
	
	return [
	  {
		$match: {
		  "fecha": params.fecha
		}
	  }, {
		$addFields: {
		  _rango: {
			$floor: {
			  $divide: [
				{ $add: [
					{ $multiply: [ { $toInt: { $substr: [ "$hora", 0, 2 ] } }, 60 ] },
					{ $toInt: { $substr: [ "$hora", 2, 2 ] } }
				]}, 
				params.intervalo
			  ]
			}
		  }
		}
	  }, {
		$group: {
		  _id: "$_rango", 
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
	  }, {
		$sort: {
		  _id: 1
		}
	  }
	];

}