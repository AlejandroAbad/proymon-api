// CONTROLLER

'use strict';
const mongoose = require('mongoose');
const Pedidos = mongoose.model('pedido');
const ProymanUtil = require('../../util/proyman.js');

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


exports.agreggation = function(req, res) {
	
	res.set('Access-Control-Allow-Origin', '*');

	try {
		var agg = require('../aggregations/' + req.params.aggName + '.js');
	} catch (e) {
		res.status(404).json({
			error : 18083013101,
			mensaje : 'No se encuentra la consulta: ' + req.params.aggName
		});
		return;
	}

	var query = agg.query(req.query);

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
				fecha: ProymanUtil.dateToProyman(),
				hora: ProymanUtil.hourToProyman(),
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
	
	var filter = {};

	if (req.query.ok)				filter.ok = (req.query.ok === 'true');
	if (req.query.incidencia)		filter.incidencia = (req.query.incidencia === 'true');
	if (req.query.descartado)		filter.descartado = (req.query.descartado === 'true');
	if (req.query.fecha)			{
		if (req.query.fechaFin) {
			filter.fecha = { $gte: parseInt(req.query.fecha), $lte: parseInt(req.query.fechaFin) }
		} else {
			filter.fecha = parseInt(req.query.fecha);
		}
	}
	if (req.query.hora)				{
		if (req.query.horaFin) {
			filter.hora = { $gte: parseInt(req.query.hora), $lte: parseInt(req.query.horaFin) }
		} else {
			filter.hora = parseInt(req.query.hora);
		}
	}
	if (req.query.clisap)			filter.clisap = req.query.clisap;
	if (req.query.almacen)			filter.almacen = req.query.almacen;
	if (req.query.tipoped)			filter.tipoped = req.query.tipoped;
	if (req.query.numped)			filter['pedido.pedido'] = req.query.numped;

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
		.sort(getSortingData(req.query.order)) 
		.skip(parseInt(req.query.start))
		.limit(parseInt(req.query.length))
	});

	
};



