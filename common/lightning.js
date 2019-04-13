var node = "";
var light = () => {

  if (node == "") {

    var grpc = require('grpc');
    var fs = require('fs');
    var lnrpc = grpc.load('./rpc.proto').lnrpc;
    process.env.GRPC_SSL_CIPHER_SUITES = 'HIGH+ECDSA'
    var lndCert = fs.readFileSync('./tls.cert');
    var sslCreds = grpc.credentials.createSsl(lndCert);
    var macaroonCreds = grpc.credentials.createFromMetadataGenerator(function (args, callback) {
      var macaroon = process.env.MACAROON;
      var metadata = new grpc.Metadata()
      metadata.add('macaroon', macaroon);
      callback(null, metadata);
    });
    var creds = grpc.credentials.combineChannelCredentials(sslCreds, macaroonCreds);
    node = new lnrpc.Lightning(process.env.LNDURL, creds);
  }
  return node;
}


module.exports = light;