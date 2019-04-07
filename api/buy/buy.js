const pool = require("../../common/pgpool");

module.exports = socket => (data, fn) => {

    pool.query("SELECT * FROM listing where paid is not null order by random()", (error, results) => {
        if (error) {
            throw error;
        } else {
            fn(rows);
        }

    });
} 