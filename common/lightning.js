var node = "";
var light = () => {

    if (node == "") {

        var LndGrpc = require('lnd-grpc');
        var fs = require('fs');
        var lnrpc = new LndGrpc(options);

        node = new LndGrpc({
            host: process.env.LNDURL,
            cert: null,
            macaroon: process.env.MACAROON,
            waitForMacaroon: 30 * 1000, // 30 seconds
            waitForCert: true,
            protoDir: './rpc.proto', // useful when running in electron environment, for example
        })

        node.connect()

    }

    return node;

}


module.exports = light;