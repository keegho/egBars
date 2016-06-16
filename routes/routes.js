var express = require('express');
var router = express.Router();
var path = require('path');
var _ = require('underscore');
var bars = require('./../model/bars.db');

var isAuthenticated = function (req, res, next){
	if(req.isAuthenticated()) {
		return next();
	}
    console.log("Not authenticated, Signup first");
	res.redirect('/signup');
};

module.exports = function (passport) {
	router.get('/', function (req, res) {
		res.sendFile(path.join(__dirname + "/../public/index.html"));
        //res.render(__dirname + "/../public/index.html");
	});

	router.post('/login', passport.authenticate('login', {
		successRedirect: '/api/bars',
		failureRedirect: '/',
		failureFlash: true
	}));

	router.get('/signup', function (req, res) {
		res.sendFile(path.join(__dirname + "/../public/signup.html"));
        //res.render(path.join(__dirname + "/../public/signup.html"));
	});

	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/api/bars',
		failureRedirect: '/signup',
		failureFlash: true
	}));

	router.get('/private/profile',isAuthenticated, function (req, res) {
		res.sendFile(path.join(__dirname + "/../private/home.html"));
        //res.render(__dirname + "/../private/home.html");
	});

	router.get('/logout', function (req, res) {
		req.logout();
		console.log("Logged out");
		res.sendFile(path.join(__dirname + "/../public/index.html"));
	});

	router.get('/api/bars', isAuthenticated ,function (req, res) {
		bars.find({},function (err, bars) {
			if (err) throw err;
			res.json(bars);
			//res.status(200).send();
		});
	});

	router.post('/api/bars', isAuthenticated, function (req, res) {
        var body = _.pick(req.body,'name', 'address', 'phone', 'barType', 'ambient', 'options', 'loc');
        console.log(body);
        var newBar = new bars(body);

        newBar.save(function (err) {
            if (err) throw err;
            //res.send('Bar Created');
            res.status(201).send();
        });
	});

    router.get('/api/bars/:id', isAuthenticated, function (req, res) {
        var barId = req.params.id;
        bars.findById(barId, function (err, bar) {
            if (err) throw err;
            res.json(bar);
            res.status(200).send();
        });
    });

    router.get('/api/bars/:loc', isAuthenticated, function (req, res) {
        var barLoc = req.params.loc.split(",");
        var barLocLon = parseFloat(barLoc[0]);//.toFixed(5);
        var barLocLat = parseFloat(barLoc[1]);//.toFixed(5);
        barLoc = [];  barLoc.push(barLocLon);  barLoc.push(barLocLat);
        // console.log(barLocLon); console.log(barLocLat);
        //  console.log(barLoc);

        bars.find({
            loc:  {$gt:[barLocLon - 0.0200, barLocLat - 0.0200], $lt:[barLocLon + 0.0200, barLocLat + 0.0200]}
        }, function (err, bars) {
            if (err) throw err;
            res.json(bars);
            res.status(200).send();
        });
    });

    router.put('/api/bars/:id', isAuthenticated, function (req, res) {
        var barId = req.params.id;
        var body =  _.pick(req.body,'name', 'address', 'phone', 'barType', 'ambient', 'options', 'loc');
        bars.findById(barId, function (err, bar) {
            if (bar) {

                bar.save(function (err) {
                    if (err) throw err;
                });
            }
        });
        bars.findByIdAndUpdate(barId, {$set:req.body}, function (err, bar) {
            if (err) throw err;
            res.send('Updated');
        });
    });

    router.delete('/api/bars/:id', isAuthenticated, function (req, res) {
        var barId = req.params.id;
        //console.log(barId);
        bars.findByIdAndRemove(barId, function (err) {
            if (err) throw  err;
            res.send('Deleted id ' + barId);
        });
    });

    //Keep it always the last route...
    router.get('*', function (req, res, next) {
        var err = new Error();
        err.status = 404;
        next(err);
    });

	return router;
};