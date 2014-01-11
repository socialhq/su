/*jshint strict:false*/
/*global CasperError, console, phantom, require*/
var casper = require('casper').create();

casper.start('http://', function() {
    // first step
});

casper.then(function() {
    // second step
});

casper.run();