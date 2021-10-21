var LndGrpc = require('lnd-grpc');
var grpc = new LndGrpc({
    host: process.env.LNDURL,
    macaroon: process.env.MACAROON,
    waitForCert: true,
});
var light = async() => {
    console.info("lightning RPC accessed", grpc.state)
    if (grpc.state == "disconnected") {
        console.info("lightning RPC connecting" )  

        await grpc.connect()

        // Do something cool if we detect that the wallet is locked.
        grpc.on(`locked`, () => console.log('wallet locked!'))

        // Do something cool when the wallet gets unlocked.
        grpc.on(`active`, () => console.log('wallet unlocked!'))

        // Do something cool when the connection gets disconnected.
        grpc.on(`disconnected`, () => console.log('disconnected from lnd!'))

        // Check if the wallet is locked and unlock if needed.
        if (grpc.state === 'locked') {
        const { WalletUnlocker } = grpc.services
        await WalletUnlocker.unlockWallet({
            wallet_password: Buffer.from('mypassword'),
        })
        // After unlocking the wallet, activate the Lightning service and all of it's subservices.
        await WalletUnlocker.activateLightning()
        
        }
 
    }

    return grpc.services.Lightning;

}


module.exports = light;