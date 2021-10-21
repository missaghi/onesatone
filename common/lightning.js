var node = "";
var light = async() => {
    console.info("lightning RPC accessed", node)
    if (node == "") {
        console.info("lightning RPC connecting" )
        var LndGrpc = require('lnd-grpc');

        node = new LndGrpc({
            host: process.env.LNDURL,
            macaroon: process.env.MACAROON
        })

        await node.connect();
        console.info("lightning RPC created", node.services)

    }

    return node.services.Lightning;

}


module.exports = light;