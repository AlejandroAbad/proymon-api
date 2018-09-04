'use strict';

const ProymanUtil = require('../../util/proyman.js');
exports.query = function(params) {

	if (!params.fecha) {
		params.fecha = ProymanUtil.dateToProyman();
	}

	return [ {
		$match : {
			fecha : parseInt(params.fecha),
			$or : [ {
				ok : false
			}, {
				incidencia : true
			}, {
				descartado : true
			} ]
		}
	} ];

}