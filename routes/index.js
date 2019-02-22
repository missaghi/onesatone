var express = require('express');
var router = express.Router();

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'pgadmin',
  host: 'localhost',
  database: 'onesatonedb',
  password: 'olive9',
  port: 5432,
})

/* GET home page. */
router.get('/lnnode/', function(req, res, next) {
 
  pool.query('SELECT * FROM lnnode', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })

});

module.exports = router;
