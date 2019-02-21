const Pool = require('pg').Pool
const pool = new Pool({
  user: 'pgadmin',
  host: 'localhost',
  database: 'onesatonedb',
  password: 'olive9',
  port: 5432,
})

pool.query('SELECT * FROM lnnode', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })