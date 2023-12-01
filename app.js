var createError = require('http-errors');
var express = require('express');
const cors = require("cors");
var path = require('path');
const mongoose = require("mongoose")
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();
app.use(cors())
app.use(express.json());
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const tasksRouter = require('./routes/tasks')


//get user model


const uri = 
'mongodb+srv://wallinderjames:Wallinder17a@myfirstcluster.lyp9vrj.mongodb.net/tododata'
mongoose.Promise = global.Promise;

mongoose.connect(uri,{
  dbname: 'tododata'
})

mongoose.connection.on('error', function(){
  console.log('Could not connect to the database. Exiting now...');
  process.exit()
})

let PORT = 8080 || process.env.PORT;

mongoose.connection.once('open', function(){
  console.log("successfully connected to the database")
  app.listen(PORT, () => {
    console.log("Application listening on port: " + PORT)
  })
})



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/tasks', tasksRouter)
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
