const pool = require("../../common/pgpool");
var named = require("yesql").pg;
const qrcode = require("qrcode");
var lightning = require("../../common/lightning");

module.exports = socket => async(data, fn) => {

    socket.emit("update", { msg: "fetching invoice", disabled: true });
    //get invoice 
     
    await lightning().addInvoice({
        //memo: "listing node", //req.body.memo,
        value: data.fee
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
        const query = 'insert into listing(node, fee, email, chansize, hash, alias) VALUES(:node, :fee, :email, :chansize, :hash, :alias) RETURNING id';
        const values = {
            node: data.node.split("@")[0],
            email: data.email,
            fee: data.fee,
            chansize: data.chansize,
            alias: data.alias,
            hash: JSON.stringify(body.r_hash),
        };

        pool.query(named(query)(values), (error, dbresult) => {
            if (error) {
                errorOut(error, false, "Retry");
            }
            else {
                qrcode.toDataURL(body.payment_request).then(qrimg => {
                    fn({ payment_request: body.payment_request, img: qrimg });
                    socket.emit("update", { msg: "Pay invoice below in 60min to continue: " + data.fee + "SAT", disabled: true });

                    var timeout = expireInvoice(call);
                    var call = subscribeToSettlement(dbresult.rows[0].id, timeout, body.add_index, body.payment_request);
                });
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
                pool.query({ text: "update listing set paid = now() where id = $1", values: [record] })
                    .then(res => {
                        console.info(res.rows[0]);
                        socket.emit("listed");
                    })
                    .catch(e => console.error(e.stack));
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


