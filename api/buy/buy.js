const pool = require("../../common/pgpool");
var named = require("yesql").pg;
const qrcode = require("qrcode");
var lightning = require("../../common/lightning");

module.exports = socket => (data, fn) => {

    //TODO check if the listing is already pending an order then mark it as such

    socket.emit("update", { msg: "fetching invoice", disabled: true });
    //get invoice 
    lightning().addInvoice({
        value: 10000
    }, (err, body) => {
        if (err) {
            errorOut(err, false, "Retry");
        } else {
            CompleteCharge(body);
        }
    })

    function errorOut(err, disabled, updatemsg) {
        console.log("log: " + JSON.stringify(err));
        console.warn(err);
        socket.emit("update", { msg: updatemsg, disabled: disabled });
        socket.emit("warning", "Error :( " + JSON.stringify(err));
        fn({
            message: "Gen Invoice Failed!",
            error: "Error From Server " + JSON.stringify(err)
        });
    }

    function CompleteCharge(body) {
        socket.emit("update", { msg: "Inserting record in DB", disabled: true });

        pool.query({ text: "select chansize from listing where id = $1", values: [data.listingid] }).then(res => {

            if (res.rowCount > 0) {
                const query = 'insert into buy(node, listingid, email, hash, chansize)' +
                    'VALUES(:node, :listingid, :email, :hash, :chansize) RETURNING id';
                const values = {
                    node: data.node,
                    email: data.email,
                    chansize: res.rows[0].chansize,
                    listingid: data.listingid,
                    hash: JSON.stringify(body.r_hash),
                };

                pool.query(named(query)(values), (error, dbresult) => {
                    if (error) {
                        errorOut(error, false, "Retry");
                    }
                    else {
                        qrcode.toDataURL(body.payment_request).then(qrimg => {
                            fn({ payment_request: body.payment_request, img: qrimg });
                            socket.emit("update", { msg: "Pay invoice in 60min to contact the seller : " + 10000 + "SAT", disabled: true });

                            var timeout = expireInvoice(call);
                            var call = subscribeToSettlement(dbresult.rows[0].id, timeout, body.add_index, body.payment_request);
                        });
                    }
                });
            } else {
                //sorry this listing no longer available
            }

        });
    }

    function subscribeToSettlement(record, timeout, index, payment_request) {
        var ops = {
            add_index: index - 1,
            settle_index: 0,
        };

        var call = lightning().subscribeInvoices(ops);
        call.on('data', function (response) {
            // A response was received from the server.
            console.info('settled' + response.settled + ' ' + response.settle_index);
            if (response.payment_request == payment_request && response.settled) {
                socket.emit("update", { msg: "Paid! Updating DB", disabled: true });

                    pool.query({ text: "update listing set chanopenpending = now() where id = $1", values: [data.listingid] })
                        .then(res1 => {

                            pool.query({ text: "select * from listing where id = $1", values: [data.listingid] }).then(res2 => {

                                pool.query({ text: "update buy set paid = now(), listingnode = $2, chansize=$3 where id = $1", values: [record, res2.rows[0].node, res2.rows[0].chansize] }).then(res => {

                                // Require:
                                var postmark = require("postmark");

                                // Send an email:
                                var client = new postmark.ServerClient("57452a2a-6cfd-4cf6-8a79-14968f59cca9");

                                client.sendEmail({
                                    "From": "Info@glowsat.com",
                                    "To": res2.rows[0].email,
                                    "Subject": "Channel open request",
                                    "TextBody": "You've got a real live customer! Please send an invoice to " + data.email + " for " + res2.rows[0].fee +
                                        " SAT becasue they would like to pay you to open a " + res2.rows[0].chansize + " SAT channel with node (pubkey) " + data.node +
                                        "\n\n When you have been paid and opened the channel the site should detect the channel and allow more buyers for your node, if it still says pending reply to this email with the channel ID." +
                                        " \n\n Thanks for listing on www.GlowSAT.com"

                                });
                            });

                            socket.emit("update", { msg: "Seller contacted!", disabled: false });
                            socket.emit("paid");
                        })
                        .catch(e => console.error(e.stack));
                });
            }
        });
        call.on('status', function (status) {
            console.info("status" + JSON.stringify(status));
        });
        call.on('end', function () {
            console.info('The server has closed the invoice stream.');
            clearTimeout(timeout);
        });
        return call;
    }

    function expireInvoice(call) {
        return setTimeout(() => {
            socket.emit("update", { msg: "Invoice Expired, try again", disabled: false });
            try {
                call.end();
            }
            catch (e) { }
        }, 1000 * 60 * 60);
    }

} 
