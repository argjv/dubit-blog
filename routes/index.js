var express = require('express');
var router = express.Router();
var bitreader = require('bitreader');

var generated = false;

var firstTime = false;

var invoiceRHashes = {};
var invoicesArr = {};


var ip = '34.208.184.134';
var port = 10009;
var amount = 1;  // satoshies

var checkInvoices = function(callback) {
  var received = 0;

  const rhashes = invoiceRHashes;

  bitreader.lookupInvoice(ip, port, rhashes[0], function (invoice1) {
    if (invoice1.settled) {
      received += parseInt(invoice1.value);
    }

    bitreader.lookupInvoice(ip, port, rhashes[1], function (invoice2) {
      if (invoice2.settled) {
        received += parseInt(invoice2.value);
      }

      callback(received);
    });
  });

};

/* GET home page. */
router.get('/', function(req, res, next) {
  var articleTitle = 'Interesting Blog';
  bitreader.getInfo(ip, port, function (response) {
    if (!firstTime) {
      firstTime = true;
      res.render('first_time', {title: articleTitle, getInfo: response,
        invoice1: invoicesArr[0],
        invoice2: invoicesArr[1]
      });
    } else if (generated) {
      checkInvoices(function (total) {

        console.log(total);
        if (total == 0) {
          res.render('index', {title: articleTitle, getInfo: response,
            invoice1: invoicesArr[0],
            invoice2: invoicesArr[1]
          });
        } else if (total <= 1) {
          res.render('index_settled1', {title: articleTitle, getInfo: response,
            invoice1: invoicesArr[0],
            invoice2: invoicesArr[1]
          });
        } else if (total <= 4) {
          res.render('index_settled4', {
            title: articleTitle, getInfo: response,
            invoice1: invoicesArr[0],
            invoice2: invoicesArr[1]
          });
        } else {
          res.render('index', {title: articleTitle, getInfo: response,
            invoice1: invoicesArr[0],
            invoice2: invoicesArr[1]
          });
        }
      });
    } else {
      // Create a new invoice
      bitreader.generateInvoice(ip, port, amount, 'Paying for ' + articleTitle, function (invoice1) {
        bitreader.generateInvoice(ip, port, amount, 'Paying for ' + articleTitle, function (invoice2) {
          generated = true;
          invoiceRHashes = [invoice1.r_hash, invoice2.r_hash];

          invoicesArr = [invoice1, invoice2];

          res.render('index', {title: articleTitle, getInfo: response,
            invoice1: invoicesArr[0],
            invoice2: invoicesArr[1]
          });
        });
      });
    }
  });
});

module.exports = router;
