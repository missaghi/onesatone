const pool = require("./pgpool");
var request = require("request-promise");
var common = require("../common");
var named = require("yesql").pg;
const qrcode = require("qrcode");
var lightning = require("../lightning");

module.exports = socket => {
  socket.on("/api/list", (data, fn) => {
    socket.emit("update", { msg: "fetching invoice", disabled: true });
    var fee= Math.max( ...data.offers.map((offer) => {return offer.fee}));
    //get invoice 
    lightning.addInvoice({
      //memo: "listing node", //req.body.memo,
      value:  fee 
    }, function (err, body) {
      if (err) {
        console.log("log: " + JSON.stringify(err));
        console.warn(err);
        socket.emit("update", { msg: "Retry", disabled: false });
        socket.emit("warning", "Invoice server down :(" + err);
        fn({
          message: "Gen Invoice Failed!",
          error: undefined === body ? "Error From Server!" : err
        });
      } else {
        socket.emit("update", { msg: "Inserting record in DB", disabled: true });
        const query =
          'insert into lnnode("nodeID", fee, email, invoice, offers, hash, alias) VALUES(:nodeID,:fee, :email,:invoice, :offers, :hash, :alias) RETURNING id';
         
          const values = {
          nodeID: data.nodeID,
          email: data.email,
          fee: fee,
          alias: data.alias,
          invoice: body.payment_request,
          offers: JSON.stringify(data.offers),
          hash: JSON.stringify(body.r_hash),
        };
        pool.query(named(query)(values), (error, dbresult) => {
          if (error) {
            socket.emit("update", { msg: "DB error, sorryz, retry?", disabled: true });
            fn({
              message: "Add Invoice to DB Failed!",
              error: error
            });
          } else {
            qrcode.toDataURL(body.payment_request).then(qrimg => {
              fn({ payment_request: body.payment_request, img: qrimg });
              socket.emit("update", { msg: "Pay invoice below in 10min to continue: " + fee + "SAT", disabled: true });

              var timeout = setTimeout(() => {
                socket.emit("update", "Invoice expired");
                try {call.end();} catch (e) {}
              }, 1000 * 60 * 10);

              /* var countdown = 10 * 60;
                var interval = setInterval(() => {
                 if (countdown > 1) { 
                   countdown += -1;
                   //check if paid
                   //update clock
                 } else clearInterval(interval);
                }, 1000);
                
               const invoiceSettled = () => { };*/
              var ops = {
                add_index: body.add_index - 1,
                settle_index: 0,
              }
              var call = lightning.subscribeInvoices(ops)
              call.on('data', function (response) {
                // A response was received from the server.
                console.info('settled' + response.settled + ' ' + response.settle_index);
                if (response.payment_request == body.payment_request && response.settled) {
                  socket.emit("update", { msg: "Paid! Updating DB", disabled: true });

                  pool.query({ text: "update lnnode set paid = now() where id = $1", values: [dbresult.rows[0].id] })
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

            });
          }
        });
      }
    })
  });
};
