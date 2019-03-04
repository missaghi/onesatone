var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
//var lessMiddleware = require('less-middleware');
var logger = require('morgan');

var apiRouter = require('./routes/api');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(lessMiddleware(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/api', apiRouter);
app.use('/lnnode', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
