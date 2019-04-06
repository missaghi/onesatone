const pool = require("../../common/pgpool");
var named = require("yesql").pg;
const qrcode = require("qrcode");
var lightning = require("../../common/lightning");

module.exports = socket => (data, fn) => {

    socket.emit("update", { msg: "fetching invoice", disabled: true });
    //get invoice 
    lightning.addInvoice({
        //memo: "listing node", //req.body.memo,
        value: fee
    }, (err, body) => {
        if (err) {
            errorOut(err, false, "Retry");
        } else {
            CompleteCharge(fee, body);
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

    function CompleteCharge(fee, body) {
        socket.emit("update", { msg: "Inserting record in DB", disabled: true });
        const query = 'insert into listing(node, fee, email, invoice, chansize, hash, alias) VALUES(:node, :fee, :email, :invoice, :chansize, :hash, :alias) RETURNING id';
        const values = {
            node: data.nodeID,
            email: data.email,
            fee: data.fee,
            size: data.chansize,
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
                    socket.emit("update", { msg: "Pay invoice below in 60min to continue: " + fee + "SAT", disabled: true });

                    var timeout = expireInvoice(call);
                    var call = subscribeToSettlement(dbresult, timeout);
                });
            }
        });
    }

    function subscribeToSettlement(dbresult, timeout) {
        var ops = {
            add_index: body.add_index - 1,
            settle_index: 0,
        };

        var call = lightning.subscribeInvoices(ops);
        call.on('data', function (response) {
            // A response was received from the server.
            console.info('settled' + response.settled + ' ' + response.settle_index);
            if (response.payment_request == body.payment_request && response.settled) {
                socket.emit("update", { msg: "Paid! Updating DB", disabled: true });
                pool.query({ text: "update listing set paid = now() where id = $1", values: [dbresult.rows[0].id] })
                    .then(res => {
                        console.info(res.rows[0]);
                        socket.emit("update", { msg: "Listed!", disabled: false });
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


