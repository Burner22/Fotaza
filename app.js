var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const flash = require("connect-flash");
const session = require("express-session");


//Rutas
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//Configuraciones
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


//MiddleWares
app.use((req, res, next)=>{
  console.log(`ruta recibida: ${req.protocol}://${req.get(`host`)}${req.originalUrl}`);
  next()
})
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
app.use(flash());

// Global
app.use((req, res, next) =>{
  res.locals.error_msg = req.flash('error_msg');
  res.locals.success_msg = req.flash('success_msg');
  next();
});

//Rutas
app.use('/', indexRouter);
app.use('/users', usersRouter);

//ErrorHandler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
