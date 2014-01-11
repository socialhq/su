var casper = require('casper').create();
var urls = ['http://google.com/', 'http://yahoo.com/'];

casper.start().eachThen(urls, function(response) {
  this.thenOpen(response.data, function(response) {
  	require('utils').dump(response);
    console.log('Opened', response.url);
  });
});
casper.run();

