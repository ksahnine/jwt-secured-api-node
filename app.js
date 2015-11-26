// Stack and libraries
var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var StormpathStrategy = require('passport-stormpath');
var expressJwt = require('express-jwt');
var debug = require('debug')('app');
var config = require('./conf/conf.js');

var app = express();

// Set Passport Stormpath strategy
var strategy = new StormpathStrategy( config.stormpath );
passport.use(strategy);
passport.serializeUser(strategy.serializeUser);
passport.deserializeUser(strategy.deserializeUser);

// - Protected resources
app.use('/api/restricted', expressJwt({secret: config.jwt.secret}));

// Use 3rd party modules
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

// Helpers
app.use(function(req,res,next){
    res.locals.userIsAuthenticated = req.isAuthenticated();
    res.locals.user = req.user; // make user available in all views
    next();
});

// Routes
var api = require('./routes/api');
app.use('/api', api);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    res.status(404).json({status: 'error', msg: 'Service inexistant', url: req.url});
});

/// catch Authorization errors
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({status: 'error', msg: 'Jeton invalide', url: req.url});
    }
});

/// error handlers
// development error handler: will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
} else {
    // production error handler: no stacktraces to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
}

module.exports = app;
