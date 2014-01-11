var links = [];
var NumberOfLinks = 0;
var currentLink = 0;
var imgs = [],
	names = [],
	descriptions = [],
	viewers = [];
var timestr = "";
var root = "";
var getImgs, getName, getDescription, getChat, getTips, getTipProgress, getNames, getDesc, getViewers, getLinks, processPage;

var mainData = {};
var shows = [];

var timestr;

var imgFolder="";
var mainFolder="";

var root = "C:\\Users\\Dar\\Dropbox\\WORKSPACE\\Showup\\Data\\";
var secs = false;
var showData={};

var casper = require('casper').create({
	pageSettings: {
		loadImages: true, // The WebPage instance used by Casper will
		loadPlugins: true // use these settings
	}
});

function saveData(jsonData, table) {

	var fs = require("fs");
	var flat = JSON.stringify(mainData);
	fs.write(root + timestr + "\\" + timestr + ".json", flat, "w");

	casper.page.onConsoleMessage = function(msg, lineNum, sourceId) {
		console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
	};

	casper.page.injectJs('_utils/couch.js');

	casper.page.evaluate(function(jsonData) {
 
		var db = new CouchDB (table);
		CouchDB.urlPrefix = "http://localhost:5984";
		db.save(jsonData);

    	}, jsonData);
};

getImgs = function() {

	var im = document.querySelectorAll("img.lazy");
	return Array.prototype.map.call(im, function(e) {
		return e.getAttribute("src");
	});
}

getNames = function() {

	var nm = document.querySelectorAll("span.stream-name");
	return Array.prototype.map.call(nm, function(e) {
		return e.innerHTML;
	});
}

getViewers = function() {

	var vw = document.querySelectorAll("span.stream-viewers");
	return Array.prototype.map.call(vw, function(e) {
		return e.innerHTML;
	});
}

getDesc = function() {

	var ds = document.querySelectorAll("span.stream-desc");
	return Array.prototype.map.call(ds, function(e) {
		return e.innerHTML;
	});
}

getName = function(){
return document.querySelector('.white-username').text;
}

getDescription = function(){
			return document.querySelector('#description').text;
		}

getLinks = function() {

	var linksHtml = document.querySelectorAll("div.stream-frame a");
	var urls = Array.prototype.map.call(linksHtml, function(e) {
		return e.getAttribute("href");
	});

	return urls.filter(function(elem, pos) {
		return urls.indexOf(elem) == pos;
	});

};

getTipProgress = function(){
			return document.querySelector('.progress-text').text;
		}

getTips = function(){
	debugger;
			var ds = document.querySelectorAll(".username");
			var u= Array.prototype.map.call(ds, function(e) {
				return e.text;		});
			ds = document.querySelectorAll(".tokens");
			var t= Array.prototype.map.call(ds, function(e) {
				return e.text;		});
			var tip=[];
			for(i=0;i<u.length;i++){
				tip.push({'user':u[i], 'tip':t[i]});
			}
			return tip;
			
		}

getChat = function(){
			var lis = document.querySelectorAll("li");
			return Array.prototype.map.call(lis, function(e) {
				sp =e.childNodes[0]; 
				type = sp.className.split(/\s+/)[1];		
				name = e.getAttribute('login');
				message = e.childNodes[1].text;
				return {'user':name, 'type':type, 'message':message};
			});
		}

casper.start();

casper.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X)');

casper.thenOpen("http://showup.tv/", function() {

	this.echo(this.getTitle());
	timestr = getTimeStr();
	mainFolder = root + timestr+"\\";
	imgFolder =  mainFolder+"imgs\\";
	
});

/***** CLICK BUTTON  ****/
casper.then(function() {

	// Click -btnon 1st result link
	this.click("a.pink-btn");
	this.viewport(1400, 4000);

	this.waitForText("Program Partnerski", function() {
		this.echo("loaded main");
		//casper.page.injectJs("/PATH/TO/jquery.js");
		this.fill("form#quick-login-form", {
			'email': 'tomek.palka1@o2.pl',
			'password':'cluelesS7'
		}, false);
		this.click('.submit');
		//this.capture(root + timestr + "\\" + timestr + ".png");
	});
});

/*
/***** GetLinks  *****/
casper.then(function() {

	this.viewport(1400, 4000);
	this.capture(root + timestr + "\\" + timestr + ".png");
	
	imgs = this.evaluate(getImgs);
	links = this.evaluate(getLinks);
	viewers = this.evaluate(getViewers);
	descriptions = this.evaluate(getDesc);
	names = this.evaluate(getNames);

	mainData.imgs = imgs;
	mainData.links = links;
	mainData.watchers = viewers;
	mainData.descriptions = descriptions;
	mainData.names = names;

	NumberOfLinks = links.length;

	this.echo("(') " + NumberOfLinks);

	mainData.noShows = this.fetchText('#trans-num');
	mainData.noWatchers = this.fetchText('#viewers-num');

	this.echo("<o> " + mainData.noWatchers);

	var fs = require("fs");
	var cont = this.getPageContent();
	fs.write(mainFolder+ timestr + ".html", cont, "w");
	
	mainData.mainFolder = mainFolder;
	mainData.htmlFile =  timestr + ".html";
	mainData.filePath = root + timestr + '\\';

	this.echo("Page saved");

	var i = 0;
	var fileNames = [];
	var fn='';

	this.each(imgs, function(self, img) {
		fn= timestr + "_"+i+"_"+ links[i++].substring(1) + ".png"
		self.download("http://showup.tv/" + img, imgFolder +fn);
		fileNames.push(fn);
	});

	mainData.imgFiles = fileNames;

	this.echo("Img down: " + i);

	mainData.time = timestr;

	saveData(mainData, 'main');
});

grabPages = function() {
	this.then(selectLink);
};

selectLink = function() {
	if (currentLink <2/*NumberOfLinks*/) {
		this.then(getShow);
	} else {
		//finish
	}
};
getTipGoal = function(){
			return document.querySelector('.transmission-goal').text;
		}

getShow = function() {

	casper.open('http://showup.tv' + links[currentLink]).then(function() {
		//this.wait(10000);
		this.echo(this.getTitle());
		showData.timeRun=timestr;

		showData.time  = getTimeStr();

		showData.tipGoal  =this.evaluate(getTipGoal);
		showData.tipProgress  =this.evaluate(getTipProgress);
		showData.description  =this.evaluate(getDescription);
		debugger;
		showData.tips =this.evaluate(getTips);
		
		showData.chat =this.evaluate(getChat);

		showData.sname = this.evaluate(getName);
		console.log("ooooooooooooooooo  "+showData.sname);
		showData.fullHtml = this.getPageContent();
		saveData(showData, 'shows')
		this.echo("processing item " + (currentLink + 1) + " out of " + NumberOfLinks + " | " + showData.sname);
	});

	this.then(processPage);
};

processPage = function() {

	filePrefix = root + timestr + "\\" + timestr + "_" + showData.sname + '_capture_' + currentLink;

	var fs = require("fs");

	this.echo("Dumping to string@ " + filePrefix + ".serialized");

	var filename = filePrefix + ".serialized";
	fs.write(filename, JSON.stringify(showData), "w");
	var filename = filePrefix + ".html";
	fs.write(filename, showData.fullHtml, "w");

	this.echo("Capturing@" + filePrefix + ".png");
	this.capture(filePrefix + ".png");

	currentLink++;
	this.then(selectLink);
};

casper.then(grabPages);

casper.run(function() {
	this.exit();
});

function getTimeStr() {
	var currentTime = new Date();
	var month = currentTime.getMonth() + 1;
	var day = currentTime.getDate();
	var year = currentTime.getFullYear();
	var hour = currentTime.getHours();
	var minute = currentTime.getMinutes();
	if (secs) {
		minute += currentTime.getSeconds();
	}
	return year + "_" + month + "_" + day + "__" + hour + "_" + minute;
}