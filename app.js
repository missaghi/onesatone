var express = require('express');
var path = require('path');

const timber = require('timber');
const transport = new timber.transports.HTTPS(process.env.TIMBER);
timber.install(transport);

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var lightning = require("./common/lightning");

app.use(express.static(path.join(__dirname, 'client/build')));

io.on("connection", socket => {
    counter = counter + 1;
    console.info("New client connected: socket", socket.id);

    socket.on("/api/list", require('./api/list/list')(socket));
    socket.on("/api/browse", require('./api/buy/browse')(socket));
    socket.on("/api/buy", require('./api/buy/buy')(socket));
    subscribe();
    socket.on("disconnect", () => console.info("Client disconnected: socket", socket.id));
});

//subscribe to channel graph and save all new edges to check for new channels

var listening = false;

function subscribe() {
    if (!listening) {

        listening = true;

        var call = lightning().subscribeChannelGraph({});
        call.on('data', function (response) {
            // A response was received from the server.
            console.log(response);
        });
        call.on('status', function (status) {
            // The current status of the stream.
            console.log(status);
        });
        call.on('end', function () {
            listening = false;
            subscribe();
        }); 
    }
    console.timeLog("heartbeat");
    setTimeout(subscribe, 5000);
}

var counter = 0;
app.use((req, res, next) => { counter = counter + 1; req.counter = counter; next(); })

module.exports = { app: app, server: server };


//var cookieParser = require('cookie-parser'); 
//var logger = require('morgan');
//var usersRouter = require('./routes/users');
//app.use('/users', usersRouter);
//require('./routes/index')(socket); 
//app.use(logger('dev'));
//app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
//app.use(lessMiddleware(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'public')));
