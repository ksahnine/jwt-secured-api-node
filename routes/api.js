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

// Authentification Stormpath + génération jeton JWT
router.options('/authenticate', cors());  // Prefight request
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
                // Le profil de l'utilisateur est utilisé pour constituer
                // la charge utile du jeton JWT
                var profile = { username: user.username, fullName: user.fullName, email: user.email };
                var token = jwt.sign(profile, config.jwt.secret, { expiresIn: config.jwt.expiresInSeconds });
                return res.json( {status: 'ok', token: token} );
            }
        }
    })(req, res, next);
});

// Retourne la liste des comptes
router.options('/restricted/accounts', cors());  // Preflight request
router.get('/restricted/accounts', cors(corsOptions), function(req, res, next) {
    debug(req.user); // Charge utile contenue dans le jeton
    // Génération de 5 comptes
    var accounts = _.map(_.range(5), function(id){ return {id: id, name: "Account " + id}; });
    res.json(accounts);
});

module.exports = router;
