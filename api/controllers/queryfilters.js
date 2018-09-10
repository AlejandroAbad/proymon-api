
exports.parseRangeInt = function ( value ) {
	
	if (value && value.startsWith('[') && value.endsWith(']')) {
		
		value = value.substring(1);
		value = value.substring(0, value.length - 1);
		
		var chunks = value.split(/\-/);
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
	}

	return parseInt(value);	
}

exports.parseRange = function ( value ) {
	
	if (value && value.startsWith('[') && value.endsWith(']')) {
		
		value = value.substring(1);
		value = value.substring(0, value.length - 1);
		
		chunks = value.split(/\,/);
		if (chunks.length > 1) {
			var array = [];
			chunks.forEach(function (val) {
				array.push( val  );
			});
			
			return { $in: array};
	
		}
		
		return value;
		
	}
	
	return value;
	
}