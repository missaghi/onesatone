const pool = require("./pgpool"); 

var index = function(socket) {

  socket.on("/api/browse", (data, fn) => {
    console.log("/api/browse");

    pool.query("SELECT * FROM lnnode where paid is not null order by random()", (error, results) => {
      if (error) {
        throw error;
      }

      getApiAndEmit(fn, results.rows);

    });
  });

  const getApiAndEmit = async (fn, rows) => {
    try { 
      fn(rows);
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };
};

module.exports = index;
