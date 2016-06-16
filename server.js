/**
 * Created by Kegham Karsian on 03-Jun-16.
 */
require('dotenv').config();
var express = require('express');
var path = require('path');
var uuid = require('node-uuid');
var crypto = require('crypto');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var PORT = process.env.PORT || 3001;
var passport = require('passport');
var initPassport = require('./passport/init');
var routes = require('./routes/routes')(passport);
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var dbUri =  process.env.MONGODB_URI;

var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'private')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET,
    cookie: {
        maxAge: 600000
    },
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
initPassport(passport);
app.use('/',routes);


if (app.settings.env === 'development') {
    dbUri = process.env.DB_HOST;
}

mongoose.connect(dbUri, function (err, res) {
    if (err) {
        console.log('Erorr connection to database ' + dbUri + '.' + err);
    } else {
        console.log('Connected to database on ' + dbUri + "\n");
    }
});

// catch 404 and frw the error
app.use(function (err, req, res, next) {
    if(err.status !== 404) {
        return next();
    }
    res.sendFile(path.join(__dirname + "/public/404.html"));
    //res.status(404).send("Page not found");
});


var key = uuid.v4();
key = crypto.createHash('sha256').update(key).update(crypto.randomBytes(256)).digest('hex');
console.log(key);


// connect to server
app.listen(PORT, function () {
    console.log('Listening to port ' + PORT + '...');
});


