var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//sentry.io fault logging
const Sentry = require('@sentry/node');
Sentry.init({ dsn: 'https://ae4081dec4e54a37a4a08fdfff5ce7c7@sentry.io/5172204' });

var indexRouter = require('./routes/index');
var seatRouter = require('./routes/seat');
var lastUpdateTimeRouter = require('./routes/lastUpdateTime');
var testDaysListRouter = require('./routes/testDaysList');
var subscriptionRouter = require('./routes/subscription');
var ieltsLastUpdateTimeRouter = require('./routes/ieltsLastUpdateTime');
var ieltsSeatRouter = require('./routes/ieltsSeat');
var ieltsSubscriptionRouter = require('./routes/ieltsSubscription');
var ieltsTestDaysListRouter = require('./routes/ieltsTestDaysList');

var app = express();

// view engine setup
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/seat', seatRouter);
app.use('/lastUpdateTime', lastUpdateTimeRouter);
app.use('/testDaysList', testDaysListRouter);
app.use('/subscription', subscriptionRouter);
app.use('/ieltsLastUpdateTime', ieltsLastUpdateTimeRouter);
app.use('/ieltsSeat', ieltsSeatRouter);
app.use('/ieltsSubscription', ieltsSubscriptionRouter);
app.use('/ieltsTestDaysList', ieltsTestDaysListRouter);

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
  res.send(err)
});

module.exports = app;
