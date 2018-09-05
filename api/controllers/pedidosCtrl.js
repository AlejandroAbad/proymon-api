// CONTROLLER

'use strict';
const mongoose = require('mongoose');
const Pedidos = mongoose.model('pedido');
const ProymanUtil = require('../../util/proyman.js');

exports.getByCRC = function(req, res) {
	Pedidos.findById(req.params.crc, function(err, pedido) {

		if (err) {
			res.send(err);
			return;
		}

		res.json(pedido);

	});
};


exports.getLast = function(req, res) {
	var now = ProymanUtil.dateToProyman();
	
	Pedidos.findOne( {ok: true, fecha: now}, [], {sort: { timestamp: -1 }}, function(err, pedido) {
		if (err) {
			res.send(err);
			return;
		}

		res.json(pedido);

	});
};


exports.filter = function(req, res) {

	var filter = {};

	if (req.query.ok)
		filter.ok = (req.query.ok === 'true');
	if (req.query.incidencia)
		filter.incidencia = (req.query.incidencia === 'true');
	if (req.query.descartado)
		filter.descartado = (req.query.descartado === 'true');
	if (req.query.fecha)
		filter.fecha = parseInt(req.query.fecha);
	if (req.query.hora)
		filter.hora = parseInt(req.query.hora);
	if (req.query.clisap)
		filter.clisap = req.query.clisap;
	if (req.query.almacen)
		filter.almacen = req.query.almacen;
	if (req.query.tipoped)
		filter.tipoped = req.query.tipoped;
	if (req.query.numped)
		filter['pedido.pedido'] = req.query.numped;

	if (filter === {}) {
		res.status(400).json({
			error : 18083013151,
			mensaje : 'Debes especificar al menos un filtro'
		});
		return;
	}

	console.log(filter);

	Pedidos.find(filter, function(err, pedido) {
		if (err) {
			res.status(500).json(err);
			return;
		}
		res.json(pedido);
	});
};

exports.agreggation = function(req, res) {

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



exports.test = function(req, res) {
	
	console.log(req.query);
	console.log(req.params);
	console.log(req.body);
	
	res.json({});
	
	
};



exports.discard = function(req, res) {
	
	var crc = req.params.crc;
	var ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress);
	var cambios = {
		$set: {descartado: true},
		$push: {
			eventos: {
				fecha: ProymanUtil.dateToProyman(),
				hora: ProymanUtil.hourToProyman(),
				descripcion: "Pedido descartado manualmente",
				tipo: "INCIDENCIA",
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
