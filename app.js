
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var products = require('./routes/apis/products');
var clients = require('./routes/apis/clients');
var revenueHistory = require('./routes/apis/revenueHistory');
var returnRequests = require('./routes/apis/returnRequests');
const { ClientRequest } = require('http');
const imageRouter = require('./routes/image');
// var Apis = require('./routes/apis');

var sequelize = require('./models').sequelize;
 
var app = express();
sequelize.sync();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/image', imageRouter);
app.use('/apis/clients', clients);
app.use('/apis/revenueHistory', revenueHistory);
app.use('/apis/returnRequests', returnRequests);
app.use('/apis/products', products);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
