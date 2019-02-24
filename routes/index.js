const pool = require('./pgpool');
var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/', function(req, res, next) {
 
  pool.query('SELECT * FROM lnnode', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })

});

module.exports = router;
