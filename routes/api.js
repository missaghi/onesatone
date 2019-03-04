const pool = require('./pgpool');
var request = require('request-promise');
var common = require('../common');
var express = require('express');
var named = require('yesql').pg
var router = express.Router();
const qrcode = require('qrcode');
 

/* GET home page. */
router.post('/list', (req, res, next) => {

//get invoice
common.setOptions();
options = common.options;
options.url = common.lnd_server_url + '/invoices';
options.form = JSON.stringify({ 
  //memo: "test", //req.body.memo,
  value: "10" //req.body.amount
});
request.post(options).then((body) => {
  if(undefined === body || body.error) {
    res.status(500).json({
      message: "Add Invoice Failed!",
      error: (undefined === body) ? 'Error From Server!' : body.error
    });
  } else {

    const query ='insert into lnnode("nodeID", email, invoice, offers, hash) VALUES(:nodeID, :email,:invoice, :offers, :hash)';
    const values = {
      nodeID : req.body.nodeID,
      email : req.body.email,
      invoice : body.payment_request,
      offers : JSON.stringify(req.body.offers),
      hash : body.r_hash
    }
    pool.query(named(query)(values), (error, results) => {
      if (error) {
        return res.status(500).json({
          message: "Add Invoice Failed!",
          error: error
        });
      } 
      qrcode.toDataURL(body.payment_request).then((qrimg) => {
          res.status(201).json({payment_request:body.payment_request, img : qrimg});
      }); 
    }); 
    /*{ r_hash: 'iyFPn9JRsm7M0HkTQ0NjQPyxNnjVMZmotTWEMcUQlTQ=',
    payment_request:
    'lnbc10u1pw8ckf0pp53vs5l87j2xexanxs0yf5xsmrgr7tzdnc65cen294xkzrr3gsj56qdq8w3jhxaqcqzystnez05jfwwm0u6xcjtgt2r8e2sl5jzqwt0lnmgry425tv65cxswq4pwrleua3u2v2nayzuaa8v8j6r6n9tcz9c5dde5r793g2un8x9qq6taw22',
    add_index: '24' }*/
  }
})
.catch(function (err) {
  return res.status(500).json({
    message: "Add Invoice Failed!",
    error: err.error
  });
});

});
 

module.exports = router;
