var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login')
var register = require('./routes/register')

var session = require('express-session');

var app = express();

var multer = require('multer');
var mongoose = require('mongoose');
global.dbHandle = require('./database/mongodb');
global.db = mongoose.connect("mongodb://localhost:27017/nodedb");

app.use(session({ 
    secret: 'secret',
    cookie:{ 
        maxAge: 1000*60*30
    }
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine("html",require("ejs").__express);
// app.set('view engine', 'jade');
app.set('view engine', 'html');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/user')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  });
  
var upload = multer({ storage: storage });
var cpUpload = upload.any();
app.use(cpUpload);

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(multer());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){ 
	res.locals.user = req.session.user;
	var err = req.session.error;
	delete req.session.error;
	res.locals.message = "";
	if(err){ 
		res.locals.message = '<div class="alert alert-danger" style="margin-bottom:20px;color:red;">'+err+'</div>';
	}
	next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/login', login);
app.use('/register', register);
app.use('/home', routes);
app.use('/logout', routes);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
