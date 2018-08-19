var express = require('express');
var router = express.Router();
var bitreader = require('bitreader');

/* GET home page. */
router.get('/', function(req, res, next) {
  var ip = '34.208.184.134';
  var port = 10009;
  var amount = 100400;  // satoshies
  var articleTitle = 'Astronaut Capital invests in Lendingblock (LND) Private Sale';
  bitreader.getInfo(ip, port, function (response) {
    bitreader.subscribeToInvoices(ip, port, function (invoice) {
      console.log('Got new invoice' + invoice);
      // Remove lnd_payment and lnd_info divs
      // Enable scrolling or article visibility
      // Refresh the page
    });
    bitreader.generateInvoice(ip, port, amount, 'Paying for ' + articleTitle, function (invoice) {
      invoice.value = amount;
      invoice.memo = 'Paying for ' + articleTitle;
      res.render('index', { title: articleTitle,  getInfo: response, invoice: invoice});
    });
  });
});

module.exports = router;
