


var zeroPad = function (num, size) {
		var s = num + '';
		while (s.length < size)
			s = '0' + s;
		return s;
	}

exports.zeroPad = zeroPad;

exports.dateToProyman = function ( date ) {
	if (!date) date = new Date();	
	return parseInt(zeroPad(date.getFullYear(), 4) + zeroPad(date.getMonth() + 1, 2) +  zeroPad(date.getDate(), 2));
}

exports.hourToProyman = function ( date ) {
	if (!date) date = new Date();
	return parseInt(zeroPad(date.getHours(), 2) + zeroPad(date.getMinutes() + 1, 2) +  zeroPad(date.getSeconds(), 2));
}


exports.timestamp = function ( date ) {
	if (!date) date = new Date();
	return date.getTime();
}
