var fs = require('fs');
var crypto = require('crypto');
var common = {};

common.lnd_server_url = 'https://localhost:8080/v1';
common.node_auth_type = 'DEFAULT';
common.macaroon_path = 'C:/Users/riaz/AppData/Local/Lnd/data/chain/bitcoin/mainnet';
common.secret_key = crypto.randomBytes(64).toString('hex');
common.options = {};

common.setOptions = () => {
	var macaroon = fs.readFileSync(common.macaroon_path + '/admin.macaroon').toString('hex');
	common.options = {
		url: '',
		rejectUnauthorized: false,
		json: true,
		headers: {
			'Grpc-Metadata-macaroon': macaroon,
		},
		form: ''
	};
	return common.options;
}


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