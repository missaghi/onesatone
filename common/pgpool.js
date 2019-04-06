require('dotenv').config();
const Pool = require('pg').Pool;
const pgpool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
 
 
module.exports = pgpool;