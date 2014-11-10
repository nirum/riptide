var express = require('express');
var router = express.Router();
var expts = require('../models/metadata');

/* GET home page */
router.get('/', function(req, res) {
  expts.find(function (err, data) {
    res.render('index', { title: 'Riptide', expts: data});
  });
});

/* GET experiment page */
router.get('/expts/:exptname', function (req, res) {
  // Get the metadata associated with this experiment
  expts.find({'name': req.params.exptname}, function (err, metadata) {
    res.render('expt', {'metadata': metadata});
  });
});

module.exports = router;
