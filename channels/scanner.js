const pool = require("../common/pgpool");
var named = require("yesql").pg;
var lightning = require("../common/lightning");

module.exports = () => {

    var runOnce = false;
    var listening = false;

    function start() {
        if (!runOnce) {

            runOnce = true;
            subscribe();
        }
    }

    var updates = [];

    async function subscribe() {

        if (!listening) {

            listening = true;

            var call = await lightning();
            const { Lightning, Autopilot, Invoices } = call.services
            await Lightning.subscribeChannelGraph({});
            call.on('data', function(response) {
                // A response was received from the server.
                updates = updates.concat(response.channel_updates);
            });
            call.on('status', function(status) {
                // The current status of the stream.
                console.log("Status:" + JSON.stringify(status));
            });
            call.on('end', function() {
                listening = false;
                subscribe();
            });

        }

        //console.log("heartbeat" + new Date().toString() + " " + updates.length + " Since last update");
        var temp = [];
        while (updates.length > 0) {
            temp.push(updates.pop());
        }
        if (temp.length > 0) {
            CheckForMatchingPendingChannels(temp);
        }

        setTimeout(subscribe, 5000);
    }

    function CheckForMatchingPendingChannels(ChannelEdgeUpdates) {

        const query = 'select id, node, listingnode, listingid, chansize from buy ' +
            ' where paid is not null and channelid is null';

        pool.query(query, (error, dbresult) => {
            if (error) {
                console.error(error);
            } else {
                Array.from(dbresult.rows).forEach(r => {

                    ChannelEdgeUpdates.forEach(c => {

                        if (c.advertising_node == r.listingnode.split("@")[0] &&
                            c.connecting_node == r.node.split("@")[0]) {
                            pool.query({ text: "update buy set channelid = $1, chansize = $3 where id = $2", values: [c.chan_id, r.id, c.capacity] });
                            pool.query({ text: "update listing set sales = sales + 1, chanopenpending = null where id = $1", values: [r.listingid] });
                        }

                    })

                })

            }
        });
    }

    return { start: start, listening: listening };

}