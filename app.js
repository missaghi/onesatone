var express = require('express');
var path = require('path');

const timber = require('timber');
const transport = new timber.transports.HTTPS(process.env.TIMBER);
timber.install(transport);

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server); 
var scanner = require('./channels/scanner')();
app.use(express.static(path.join(__dirname, 'client/build')));

var redirectToHTTPS = require('express-http-to-https').redirectToHTTPS
 
// Don't redirect if the hostname is `localhost:port` or the route is `/insecure`
app.use(redirectToHTTPS([/localhost:(\d{4})/], [/\/insecure/], 301));

io.on("connection", socket => {
    counter = counter + 1;
    console.info("New client connected: socket", socket.id);
    
    socket.on("/api/list", require('./api/list/list')(socket));
    socket.on("/api/browse", require('./api/buy/browse')(socket));
    socket.on("/api/buy", require('./api/buy/buy')(socket));
    socket.on("disconnect", () => console.info("Client disconnected: socket", socket.id));
    scanner.start();
});


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
