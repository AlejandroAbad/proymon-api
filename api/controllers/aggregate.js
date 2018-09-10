'use strict';

const ProymanUtil = require('../../util/proyman.js');
const Filters = require('./queryfilters.js');
const util = require('util');


function generateRangoMinutos(rango) {
	
	if (!rango) {
		rango = 60;
	} else {
		rango = parseInt(rango);

		if (isNaN(rango)) rango = 60;
		
		rango = Math.min(rango, 1440);
		rango = Math.max(rango, 1);
	}
	
	return {
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
			}, rango ]
		}
	};
	
}

function generateRangoLineas(rango) {
	
	if (!rango) {
		rango = 25;
	} else {
		rango = parseInt(rango);
		if (isNaN(rango)) rango = 25;
		rango = Math.min(rango, 100);
		rango = Math.max(rango, 1);
	}
	
	return {
		$floor : {
			$divide : [ "$lineas", rango ]
		}
	}
}

function getMatchFilter ( params ) {
	var filter = {};

	if (params.ok)				filter.ok = (params.ok === 'true');
	if (params.incidencia)		filter.incidencia = (params.incidencia === 'true');
	if (params.descartado)		filter.descartado = (params.descartado === 'true');
	if (params.hora)			filter.hora = Filters.parseRangeInt( params.hora );
	if (params.clisap)			filter.clisap = Filters.parseRange( params.clisap );
	if (params.almacen)			filter.almacen = Filters.parseRange( params.almacen );
	if (params.tipoped)			filter.tipoped = Filters.parseRange( params.tipoped );
	filter.fecha = params.fecha ? Filters.parseRangeInt( params.fecha ) : ProymanUtil.dateToProyman();
	
	return {
		$match : filter
	}
	
}


function parseAggregationParam( value ) {
	
	var aggs = {};
	
	if (value && value.startsWith('[') && value.endsWith(']')) {
		
		value = value.substring(1);
		value = value.substring(0, value.length - 1);
		
		var chunks = value.split(/\,/);
		chunks.forEach(function (val) {
			val = val.toLowerCase();
			var tmp = val.split(/\:/);
			if (tmp.length > 1) {
				aggs[tmp[0]] = tmp[1];
			} else {
				aggs[tmp[0]] = true;
			}

		});
			
	}
	
	return aggs;
	
}


function getAddFields( aggregations ) {
	
	var addFields = {};
	
	if (aggregations.minutos) {
		addFields._rangoMinutos = generateRangoMinutos(aggregations.minutos);
	}
	
	if (aggregations.lineas) {
		addFields._rangoLineas = generateRangoLineas(aggregations.lineas);
	}
	
	if (Object.keys(addFields).length) {
		return {
			$addFields : addFields
		};
	} else {
		return false;
	}

}

function getGroupId( aggregations ) {
	
	var gid = {}
	
	if (aggregations.minutos)		gid.minutos = '$_rangoMinutos';
	if (aggregations.lineas) 		gid.lineas = '$_rangoLineas';
	if (aggregations.fecha) 		gid.fecha = '$fecha';
	if (aggregations.clisap) 		gid.clisap = '$clisap';
	if (aggregations.almacen) 		gid.almacen = '$almacen';
	if (aggregations.tipoped) 		gid.tipoped = '$tipoped';
	
	return gid;
}


function getSortOperator (aggregations) {
	var sort = {}
	
	if (aggregations.fecha) 		sort['_id.fecha'] = 1;
	if (aggregations.minutos)		sort['_id.minutos'] = 1;
	if (aggregations.lineas)		sort['_id.lineas'] = 1;
	if (aggregations.almacen) 		sort['_id.almacen'] = 1;
	if (aggregations.clisap) 		sort['_id.clisap'] = 1;
	if (aggregations.tipoped) 		sort['_id.tipoped'] = 1;
	
	if (Object.keys(sort).length) {
		return {
			$sort : sort
		};
	} else {
		return false;
	}
}

exports.query = function(params) {

	var aggregations = parseAggregationParam( params.agg );
	var pipeline = [];

	
	
	var match = getMatchFilter (params);
	pipeline.push(match);
	
	var addFields = getAddFields(aggregations);
	if (addFields !== false) pipeline.push(addFields);
	
	
	pipeline.push({
		$group : {
			_id : getGroupId( aggregations ),
			pedidos : { $sum : 1 },
			lineas : { $sum : "$lineas" },
			faltas : { $sum : "$chequeo.faltas" },
			tiempoChequeo : { $avg : "$chequeo.tiempoEjecucion" },
			tiempoPedido : { $avg : "$pedido.tiempoEjecucion" },
			tiempoChequeoMax : { $max : "$chequeo.tiempoEjecucion" },
			tiempoPedidoMax : { $max : "$pedido.tiempoEjecucion" },
			tiempoChequeoMin : { $min : "$chequeo.tiempoEjecucion" },
			tiempoPedidoMin : { $min : "$pedido.tiempoEjecucion" }
		}
	});
	
	var sort = getSortOperator(aggregations);
	if (sort !== false) pipeline.push(sort);
	
	console.log(util.inspect(pipeline, false, null, false));
	
	return pipeline;


}