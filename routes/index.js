var express = require('express');
var router = express.Router();
var bitreader = require('bitreader');

var generated = false;

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
      console.log('yay1');
      received += parseInt(invoice1.value);
    }

    bitreader.lookupInvoice(ip, port, rhashes[1], function (invoice2) {
      if (invoice2.settled) {
        console.log('yay2');
        received += parseInt(invoice2.value);
      }

      bitreader.lookupInvoice(ip, port, rhashes[2], function (invoice3) {
        if (invoice3.settled) {
          console.log('yay3');
          received += parseInt(invoice3.value);
        }

        bitreader.lookupInvoice(ip, port, rhashes[3], function (invoice4) {
          if (invoice4.settled) {
            console.log('yay4');
            received += parseInt(invoice4.value);
          }
          callback(received);
        });
      });
    });
  });

};

/* GET home page. */
router.get('/', function(req, res, next) {
  var articleTitle = 'Astronaut Capital invests in Lendingblock (LND) Private Sale';
  bitreader.getInfo(ip, port, function (response) {
    if (generated) {
      checkInvoices(function (total) {

        console.log(total);
        if (total == 0) {
          res.render('index', {title: articleTitle, getInfo: response,
            invoice1: invoicesArr[0],
            invoice2: invoicesArr[1],
            invoice3: invoicesArr[2],
            invoice4: invoicesArr[3]
          });
        } else if (total <= 1) {
          res.render('index_settled1', {title: articleTitle, getInfo: response,
            invoice1: invoicesArr[0],
            invoice2: invoicesArr[1],
            invoice3: invoicesArr[2],
            invoice4: invoicesArr[3]
          });
        } else if (total <= 2) {
          res.render('index_settled2', {title: articleTitle, getInfo: response,
            invoice1: invoicesArr[0],
            invoice2: invoicesArr[1],
            invoice3: invoicesArr[2],
            invoice4: invoicesArr[3]
          });
        } else if (total <= 3) {
          res.render('index_settled3', {
            title: articleTitle, getInfo: response,
            invoice1: invoicesArr[0],
            invoice2: invoicesArr[1],
            invoice3: invoicesArr[2],
            invoice4: invoicesArr[3]
          });
        } else if (total <= 4) {
          res.render('index_settled4', {
            title: articleTitle, getInfo: response,
            invoice1: invoicesArr[0],
            invoice2: invoicesArr[1],
            invoice3: invoicesArr[2],
            invoice4: invoicesArr[3]
          });
        } else {
          res.render('index', {title: articleTitle, getInfo: response,
            invoice1: invoicesArr[0],
            invoice2: invoicesArr[1],
            invoice3: invoicesArr[2],
            invoice4: invoicesArr[3]
          });
        }
      });
    } else {
      // Create a new invoice
      bitreader.generateInvoice(ip, port, amount, 'Paying for ' + articleTitle, function (invoice1) {
        bitreader.generateInvoice(ip, port, amount, 'Paying for ' + articleTitle, function (invoice2) {
          bitreader.generateInvoice(ip, port, amount, 'Paying for ' + articleTitle, function (invoice3) {
            bitreader.generateInvoice(ip, port, amount, 'Paying for ' + articleTitle, function (invoice4) {
              generated = true;
              invoiceRHashes = [invoice1.r_hash, invoice2.r_hash, invoice3.r_hash, invoice4.r_hash];

              invoicesArr = [invoice1, invoice2, invoice3, invoice4];

              res.render('index', {title: articleTitle, getInfo: response,
                invoice1: invoicesArr[0],
                invoice2: invoicesArr[1],
                invoice3: invoicesArr[2],
                invoice4: invoicesArr[3]
              });
            });
          });
        });
      });
    }
  });
});

module.exports = router;
