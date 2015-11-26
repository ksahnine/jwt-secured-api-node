var express = require('express'),
    _ = require("underscore"),
    cors = require("cors"),
    jwt = require('jsonwebtoken'),
    router = express.Router(),
    passport = require('passport'),
    debug = require('debug')('app'),
    config = require('../conf/conf.js');

var corsOptions = {
   "origin": "*",
   "Access-Control-Allow-Origin": "*",
   "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
   "preflightContinue": false
};

// Login 
router.options('/authenticate', cors()); 
router.post('/authenticate', cors(corsOptions), function(req, res, next) {
    passport.authenticate('stormpath', function(err, user, info) {
        if (err) { 
            res.status(500);
            return res.json( {status: 'error', msg: err} ) 
        } else {
            if (!user) {
                res.status(500);
                return res.json( {status: 'error', msg: info.message} );
            } else {
                var profile = { username: user.username, fullName: user.fullName, email: user.email };
                var token = jwt.sign(profile, config.jwt.secret, { expiresIn: config.jwt.expiresInSeconds });
                return res.json( {status: 'ok', token: token} );
            }
        }
    })(req, res, next);
});

// Liste des comptes
router.options('/restricted/accounts', cors()); 
router.get('/restricted/accounts', cors(corsOptions), function(req, res, next) {
    debug(req.user);
    // Génération de 5 comptes
    var accounts = _.map(_.range(5), function(id){ return {id: id, name: "Account " + id}; });
    res.json(accounts);
});

module.exports = router;
