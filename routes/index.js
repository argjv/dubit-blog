var express = require('express');
var router = express.Router();
var bitreader = require('bitreader');

var invoicesRHash;
var invoiceJson;

/* GET home page. */
router.get('/', function(req, res, next) {
  var ip = '34.208.184.134';
  var port = 10009;
  var amount = 10;  // satoshies
  var articleTitle = 'Astronaut Capital invests in Lendingblock (LND) Private Sale';
  bitreader.getInfo(ip, port, function (response) {
    bitreader.subscribeToInvoices(ip, port, function (invoice) {
      console.log('Got new invoice' + invoice);
      // Remove lnd_payment and lnd_info divs
      // Enable scrolling or article visibility
      // Refresh the page
    });
    if (invoicesRHash) {
      bitreader.lookupInvoice(ip, port, invoicesRHash, function (invoice) {
        console.log('Found an existing invoice: ' + invoicesRHash);
        console.log('Settled: ' + invoice.settled);
        if (invoice.settled) {
          console.log('Invoices is settled, enjoy the article!');
          res.render('index_settled', {title: articleTitle, getInfo: response, invoice: invoice});
        } else {
          res.render('index', {title: articleTitle, getInfo: response, invoice: invoice});
          console.log('Waiting for invoice payment');
        }
        // Show the current invoice info
      });
    } else {
      // Create a new invoice
      bitreader.generateInvoice(ip, port, amount, 'Paying for ' + articleTitle, function (invoice) {
        invoiceJson = invoice;
        invoicesRHash = invoice.r_hash;
        invoice.value = amount;
        invoice.memo = 'Paying for ' + articleTitle;
        invoice.settled = false;
        res.render('index', {title: articleTitle, getInfo: response, invoice: invoice });
      });
    }
  });
});

module.exports = router;
