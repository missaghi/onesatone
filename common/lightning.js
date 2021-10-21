var node = "";
var light = async() => {

    if (node == "") {

        var LndGrpc = require('lnd-grpc');

        node = new LndGrpc({
            host: process.env.LNDURL,
            macaroon: process.env.MACAROON
        })

        await node.connect();

    }

    return node.services.Lightning;

}


module.exports = light;