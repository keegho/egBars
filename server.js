/**
 * Created by Kegham Karsian on 03-Jun-16.
 */
var express = require('express');
var _ = require('underscore');
//var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var dbModel = require('./model/db');
var PORT = process.env.PORT || 3000;
var app = express();


app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

var db = mongoose.connection;
var dbUri =  process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL || 'mongodb://localhost/barsDb';

mongoose.connect(dbUri, function (err, res) {
    if (err) {
        console.log('Erorr connection to database ' + dbUri + '.' + err);
    } else {
        console.log('Connected to database on ' + dbUri);
    }
});




// post new bar
app.post('/bars', function (req, res) {
    var body = _.pick(req.body,'name', 'address', 'phone', 'barType', 'ambient', 'options', 'loc');
    console.log(body);
    var newBar = new dbModel(body);

    newBar.save(function (err) {
        if (err) throw err;
        //res.send('Bar Created');
        res.status(201).send();
    });
});

// get all bars
app.get('/bars', function (req, res) {
    dbModel.find({},function (err, bars) {
        if (err) throw err;
        res.json(bars);
        res.status(200).send();
    });
});

// get bar by id:
app.get('/bars/:id', function (req, res) {
    var barId = req.params.id;
    dbModel.findById(barId, function (err, bar) {
        if (err) throw err;
        res.json(bar);
        res.status(200).send();
    });
});

// update bar by id:
app.put('/bars/:id', function (req, res) {
    var barId = req.params.id;
    var body =  _.pick(req.body,'name', 'address', 'phone', 'barType', 'ambient', 'options', 'loc');
    dbModel.findByIdAndUpdate(barId, {
       name: body.name,
       address: body.address,
       phone: body.phone,
       barType: body.barType,
       ambient: body.ambient,
       options: body.options
       //loc: body.loc
    },
    function (err, bar) {
        if (err) throw err;
        res.send('Updated');
    });
});

// delete bar by id:
app.delete('/bars/:id', function (req, res) {
    var barId = req.params.id;
    //console.log(barId);
    dbModel.findByIdAndRemove(barId, function (err) {
        if (err) throw  err;
        res.send('Deleted id ' + barId);
    });
});


// connect to server
app.listen(PORT, function () {
    console.log('Listening to port ' + PORT + '...');
});

