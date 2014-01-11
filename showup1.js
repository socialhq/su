

var links = [];
var imgs = [];
var timestr='';
var root='';


var casper = require('casper').create();

	var timestr = this.getTime(0);
	var root = '/home/dar/Dropbox/';
	
function getTime(secs) {
	var currentTime = new Date();
	var month = currentTime.getMonth() + 1;
	var day = currentTime.getDate();
	var year = currentTime.getFullYear();
	var hour = currentTime.getHours();
	var minute = currentTime.getMinutes();
	if(secs) {minute+=currentTime.getSeconds()}
	return year + "-" + month + "-" + day+' '+hour+':'+minute;
}


function getImgs(){
	    var links = document.querySelectorAll('img.lazy');
    	 return Array.prototype.map.call(imgs, function(e) {
         return e.getAttribute('src');
        
    });
	
}
function getName(){
	    var name = document.querySelectorAll('a.white-username');
    	return name[1];
	
}
function getLinks(){
	    var links = document.querySelectorAll('div.stream-frame a');
    	 return Array.prototype.map.call(links, function(e) {
        return e.getAttribute('href');
    });
	
}

function processPage(link, content) {
	var fs = require('fs');
	var dir = root+timestr+'/sessions/'+link; 
//	echo('tutaj');
	//var cont = this.getPageContent();
	fs.write(dir+timestr+'.html', content, 'w');
}

casper.start('http://showup.tv/', function() {
    this.echo(this.getTitle());
});

casper.then(function() {
    // Click -btnon 1st result link
    this.click('a.pink-btn');
    
});

casper.then(function() {
	this.viewport(1400, 4000);
	   this.wait(15000, function() {
             
    	 this.capture(root+timestr+'/'+timestr+'.png');
    	 imgs = this.evaluate(getImgs);
    	 links= this.evaluate(getLinks);
    var i=0;
    
   this.each(imgs, function(self, img) {
  		j=3*i++;
   	//console.log('http://showup.tv/'+img+' '+links[j].substring(1));
  		self.download('http://showup.tv/'+img, root+timestr+'/'+timestr+' '+links[j].substring(1)+'.jpg');
    });
    
    });

});

	
	
	
	
casper.then(function() {
	var fs = require('fs');

	var cont = this.getPageContent();
	fs.write(root+timestr+'/'+timestr+'.html', cont, 'w');
	fs.write(root+timestr+'.html', cont, 'w');
	 
});


casper.then(function() {
	this.each(links, function(self, link) {
	 self.thenOpen(link, function() {
        this.echo(link);
        name = this.evaluate(getName);
        this.echo(name);
        processPage(link, this.getPageContent());
    });
	});
});

casper.run(function() {
    // echo results in some pretty fashion
    
    //  this.echo(' - ' + links.join('\n - '));
   	// this.echo(' - ' + imgs.join('\n - ')).exit();
   	this.exit();
    
});







/*

.white-username
#viewersOnline

chatView


*/
