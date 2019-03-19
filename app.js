var express = require('express');
var path = require('path');
const timber = require('timber');
const transport = new timber.transports.HTTPS(process.env.TIMBER);
timber.install(transport);
//var cookieParser = require('cookie-parser'); 
//var logger = require('morgan');
 
var counter = 0;

var usersRouter = require('./routes/users');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

//app.use(logger('dev'));
//app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
//app.use(lessMiddleware(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'client/build')));

io.on("connection", socket => {
    counter = counter+1;
    console.info("New client connected: socket", socket.id);
    require('./routes/index')(socket);
    require('./routes/api')(socket);
    socket.on("disconnect", () => console.info("Client disconnected: socket", socket.id));
});

app.use((req, res, next) => { counter = counter+1; req.counter = counter; next(); })
app.use('/users', usersRouter);

module.exports = {app: app, server: server};
