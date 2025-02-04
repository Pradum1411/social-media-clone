require("dotenv").config()
require("./socket/socket")
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session=require("express-session")
const flash=require("connect-flash")
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const fileupload=require("express-fileupload")

const {app,server}=require("./socket/socket")

// var app = express();
 
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// session
app.use(session({
  resave:false,
  saveUninitialized:false,
  secret:process.env.SESSION_SECRET
}))
app.use(flash())
app.use((req,res,next)=>{
  res.locals.successMessage=req.flash("success")
  res.locals.errorMessage=req.flash("error")
  next()
})

app.use(fileupload({
  useTempFiles:true,
  tempFileDir:'/public/images/'
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// database connection
const mongoose=require("mongoose")
mongoose.connect(`${process.env.DATABASE_URL}${process.env.DATABASE_NAME}`)
.then(()=>{
  console.log("database connected succesfully...")
}).catch(err=>{
  console.log("database connection error--",err.message)
})

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

// socket

module.exports = app;
