/*jshint strict:false*/
/*global CasperError, console, phantom, require*/
var casper = require('casper').create();

casper.start('http://showup.tv', function() {
    // first step
    //var cookies = JSON.stringify(phantom.cookies);
    this.echo(JSON.stringify(phantom.cookies));
    phantom.cookies
});


casper.then(function() {
	// Click -btnon 1st result link
	this.click("a.pink-btn");
	this.viewport(1400, 4000);

	this.waitForText("Program Partnerski", function() {
		this.echo("loaded main");
		casper.page.injectJs("/PATH/TO/jquery.js");
		this.echo(JSON.stringify(phantom.cookies));
	});


});


casper.open('/mydwojemd').then(function() {
	this.echo(this.getTitle());
});


casper.run();