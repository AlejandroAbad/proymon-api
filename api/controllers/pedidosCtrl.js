// CONTROLLER

'use strict';
const mongoose = require('mongoose');
const Pedidos = mongoose.model('pedido');
const ProymanUtil = require('../../util/proyman.js');
const Filters = require('./queryfilters.js');

exports.getByCRC = function(req, res) {
	
	res.set('Access-Control-Allow-Origin', '*');
	
	var query = {
		$or: [
			{_id: req.params.crc}, 
			{'pedido.pedido': req.params.crc}
		]
	};
	
	Pedidos.find(query, function(err, pedido) {

		if (err) {
			res.send(err);
			return;
		}

		if (pedido.length > 0)
			res.json(pedido[0]);
		else
			res.json({error: 'Pedido no encontrado'});

	});
};


exports.getLast = function(req, res) {
	
	res.set('Access-Control-Allow-Origin', '*');
	
	var now = ProymanUtil.dateToProyman();
	
	Pedidos.findOne( {ok: true, fecha: now}, [], {sort: { timestamp: -1 }}, function(err, pedido) {
		if (err) {
			res.send(err);
			return;
		}

		res.json(pedido);

	});
};

exports.getIncidences = function(req, res) {
	
	res.set('Access-Control-Allow-Origin', '*');
	
	if (!req.query.fecha) {
		req.query.fecha = ProymanUtil.dateToProyman();
	}
	
	var query = {
		fecha : parseInt(req.query.fecha),
		$or : [ 
			{ ok : false }, 
			{ incidencia : true }, 
			{ descartado : true }
		]
	};
	
	Pedidos.find(query, function(err, result) {
		if (err) {
			res.status(500).send(err);
			return;
		}

		res.json(result);

	});
	
}


exports.agreggate = function(req, res) {
	
	res.set('Access-Control-Allow-Origin', '*');
 
	var query = require('./aggregate.js').query(req.query);

	Pedidos.aggregate(query, function(err, result) {
		if (err) {
			res.status(500).send(err);
			return;
		}

		res.json(result);

	});
	

}


exports.discard = function(req, res) {
	
	res.set('Access-Control-Allow-Origin', '*');
	
	var crc = req.params.crc;
	var ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress);
	var cambios = {
		$set: {descartado: true},
		$push: {
			eventos: {
				descripcion: "Pedido descartado manualmente",
				tipo: "DESCARTADO",
				original: "Pedido descartado manualmente desde [" + ip + "]",
				timestamp: ProymanUtil.timestamp()
			}
		}
	};
	
	
	Pedidos.findOneAndUpdate({_id: crc}, cambios, {new: true}, function (err, pedido) {
		if (err) {
			res.status(500).send(err);
			return;
		}
		
		res.json(pedido);

	});
	
	
}



const getSortingData = function (order) {
	
	if (!order || !order.length) return {};
	
	order = order[0];
	var side = (order.dir === 'asc') ? 1 : -1;
	
	switch(order.column) {
		case '0': return {_id: side};
		case '1': return {timestamp: side};
		case '2': return {clisap: side};
		case '3': return {'pedido.pedido': side};
		case '4': return {tipoped: side};
		case '5': return {lineas: side};
		case '6': return {'chequeo.faltas': side};
		case '7': return {almacen: side};
		case '8': return {ok: side, incidencia: side, descartado: side};
	}
}


exports.filter = function(req, res) { 

	res.set('Access-Control-Allow-Origin', '*');

	var params = req.query;
	var filter = {};

	if (params.ok)				filter.ok = (params.ok === 'true');
	if (params.incidencia)		filter.incidencia = (params.incidencia === 'true');
	if (params.descartado)		filter.descartado = (params.descartado === 'true');
	if (params.clisap)			filter.clisap = Filters.parseRange( params.clisap );
	if (params.almacen)			filter.almacen = Filters.parseRange( params.almacen );
	if (params.tipoped)			filter.tipoped = Filters.parseRange( params.tipoped );
	
	var tmp;
	if (params.hora && (tmp = Filters.parseRangeInt( params.hora )))	filter.hora = tmp;
	if (params.fecha && (tmp = Filters.parseRangeInt( params.fecha )))	filter.fecha = tmp
	
	if (!params.start)	params.start = 0;
	if (!params.length)	params.length = 20;
	

	Pedidos.countDocuments(filter, function (err, count) {
		if (err) {
			console.log(err);
			res.status(500).json(err);
			return;
		}
		
		
		Pedidos.find(filter, function(err, pedido) {
			if (err) {
				console.log(err);
				res.status(500).json(err);
				return;
			}
			
			var result = {
				draw: (req.query.draw || 0), 
				recordsTotal: count,
				recordsFiltered: count,
				data: pedido
			};
			
			res.json(result);
		})
		.sort(getSortingData(params.order)) 
		.skip(parseInt(params.start))
		.limit(parseInt(params.length))
		.select( { eventos: 0 } );
	});

	
};



