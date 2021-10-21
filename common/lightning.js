var LndGrpc = require('lnd-grpc');
var node = new LndGrpc({
    host: process.env.LNDURL,
    macaroon: process.env.MACAROON,
    waitForCert: true,
});
var light = async() => {
    console.info("lightning RPC accessed", node.state)
    if (node.state == "disconnected") {
        console.info("lightning RPC connecting" ) 

        
try {
        await node.connect(); console.info("lightning RPC created", node.services)}
        catch (e) { console.log(e);}

        

    }

    return node.services.Lightning;

}


module.exports = light;