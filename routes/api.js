var express = require('express');
var router = express.Router();
var results = require('../models/results');

/* GET experiment results */
router.get('/:exptname', function(req, res) {
  results.find({'exptname': req.params.exptname}, function (err, data) {
    res.json(data);
  });
});

module.exports = router;