
'use strict';
const mongoose = require('mongoose');
const Control = mongoose.model('control');



exports.consulta = function (req, res) {

	res.set('Access-Control-Allow-Origin', '*');

	let id;
	switch (req.params.consulta) {
		case 'Labware':
			id = 'Labware';
			break;
		case 'XML':
		default:
			id = 'ConsultasXML';
			break;
	}
	

	
	var query = { _id: id };

	console.log(query)

	Control.findOne(query, function (err, consulta) {

		if (err) {
			res.send(err);
			return;
		}

		if (consulta)
			res.json(consulta);
		else
			res.json({ error: 'Consulta no encontrada' });

	});
};
