



exports.parseInt = function ( value ) {
	
	var chunks = value.split(/\-/);
	console.log(chunks);
	if (chunks.length === 2) {
		return {
			$gte: parseInt(chunks[0]),
			$lte: parseInt(chunks[1]),
		};
	}
	
	chunks = value.split(/\,/);
	if (chunks.length > 1) {
		var array = [];
		chunks.forEach(function (val) {
			array.push( parseInt(val)  );
		});
		
		return { $in: array};

	}
	
	return parseInt(value) ;
	
}

exports.parse = function ( value ) {
	
	var chunks = value.split(/\-/);
	console.log(chunks);
	if (chunks.length === 2) {
		return {
			$gte: chunks[0],
			$lte: chunks[1],
		};
	}
	
	chunks = value.split(/\,/);
	if (chunks.length > 1) {
		var array = [];
		chunks.forEach(function (val) {
			array.push( val );
		});
		
		return { $in: array};

	}
	
	return value;
	
}