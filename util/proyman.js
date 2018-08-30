

exports.dateToProyman = function ( date ) {
	
	if (!date) date = new Date();
	
	var zeroPad = function (num, size) {
		var s = num + '';
		while (s.length < size)
			s = '0' + s;
		return s;
	}
	
	return zeroPad(date.getFullYear(), 4) + zeroPad(date.getMonth() + 1, 2) +  zeroPad(date.getDate(), 2);
}
