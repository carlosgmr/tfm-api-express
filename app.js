var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//var indexRouter = require('./routes/index');
var administratorRouter = require('./routes/administrator');
var instructorRouter = require('./routes/instructor');
var userRouter = require('./routes/user');
var groupRouter = require('./routes/group');
var questionaryModelRouter = require('./routes/questionary-model');
var questionModelRouter = require('./routes/question-model');
var questionaryRouter = require('./routes/questionary');
var questionRouter = require('./routes/question');
var answerRouter = require('./routes/answer');
var registryRouter = require('./routes/registry');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);

// API
app.use('/administrator', administratorRouter);
app.use('/instructor', instructorRouter);
app.use('/user', userRouter);
app.use('/group', groupRouter);
app.use('/questionary-model', questionaryModelRouter);
app.use('/question-model', questionModelRouter);
app.use('/questionary', questionaryRouter);
app.use('/question', questionRouter);
app.use('/answer', answerRouter);
app.use('/registry', registryRouter);

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
