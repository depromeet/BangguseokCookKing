const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('./app/helpers/logHandler');
const errorHandle = require('./app/helpers/errors/errorHandle');

const indexRouter = require('./app/routes/index');
const RecipeRouter = require('./app/routes/RecipeRouter');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');

// Fawn with mongoose setup
const Fawn = require('./app/helpers/fawnHandler');

// app use setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/recipe', RecipeRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(errorHandle);

module.exports = app;
