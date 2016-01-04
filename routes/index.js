var express = require('express');
var router = express.Router();
var scrapper = require("../models/scrapper.js");

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

// api ---------------------------------------------------------------------
// get places
router.get('/api/scrape', function(req, res) {
    console.log(req.body.text);
    scrapper.getPlaces(function(data){
        res.json(data);
    });
});

// create todo and send back all todos after creation
router.post('/api/scrape', function(req, res) {

    var city = req.body.text;
    scrapper.getPlaces(city,function(data){
        res.json(data);
    });

});



module.exports = router;