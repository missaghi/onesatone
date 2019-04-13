var fs = require('fs');
var crypto = require('crypto');
var common = {};

common.secret_key = crypto.randomBytes(64).toString('hex');
 
common.convertToBTC = (num) => {
	return (num / 100000000).toFixed(6);
};

common.convertTimestampToDate = (num) => {
	return new Date(+num * 1000).toUTCString();
};

common.sortAscByKey = (array, key) => {
	return array.sort(function (a, b) {
		var x = a[key]; var y = b[key];
		return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	});
}

common.sortDescByKey = (array, key) => {
	return array.sort(function (a, b) {
		var x = a[key]; var y = b[key];
		return ((x > y) ? -1 : ((x < y) ? 1 : 0));
	});
}

common.newestOnTop = (array, key, value) => {
	var index = array.findIndex(function (item) {
		return item[key] === value
	});
	var newlyAddedRecord = array.splice(index, 1);
	array.unshift(newlyAddedRecord[0]);
	return array;
}

module.exports = common;