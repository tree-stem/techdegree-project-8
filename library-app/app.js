var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const db = require('./models');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const error = new Error();
  error.status = 404;
  error.message = "Oops! Something went wrong.";
  res.render('page-not-found', { error });
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.status = err.status || 500;

  // render the error page
  res.status(err.status || 500);
  res.render('error', { err });
  console.log('Error status: ', res.locals.status, 'Error message: ', err.message);
});

// Sync all tables
(async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Connection to the database successful!');
    await db.sequelize.sync();
  } catch (error) {
    console.error('Error connecting to the database: ', error);
  }
})();

module.exports = app;
