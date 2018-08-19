var express = require('express');
var router = express.Router();
var bitreader = require('bitreader');

/* GET home page. */
router.get('/', function(req, res, next) {
  bitreader.getInfo('34.208.184.134', 10009, function (response) {
    res.render('index', { title: 'Express',  getInfo: response});
  });
});

module.exports = router;
