const QUEUE_LENGTH = 1;
 
var numRunningJobs = 0;
var numWaitingJobs = 0;
 
var parrallelCallback = function() {
numRunningJobs --;
 
if (numRunningJobs === 0 && numWaitingJobs === 0) {
phantom.exit();
}
};
 
var addToQueue = function(func, obj, isWaiting) {
if (numRunningJobs >= QUEUE_LENGTH) {
if (!isWaiting) {
numWaitingJobs ++;
}
setTimeout(function() {
addToQueue(func, obj, true);
}, 100);
} else {
if (isWaiting) {
numWaitingJobs --;
}
numRunningJobs ++;
func(obj, parrallelCallback);
}
};
 
/* following is an example */
 
// a test function. it must call the callback function when work is done.
var testFunc = function(url, callback) {
var page = require('webpage').create();
page.settings.loadImages = false;
page.onConsoleMessage = function(msg) { console.log(msg); };
page.onLoadFinished = function() {
page.evaluate(function() {
console.log(document.title);
});
callback && callback();
};
page.open(url);
};
 
// some test data
var testObjs = [ 'http://showup.tv/LadyJessy82', 'http://showup.tv/NapalonaCzarnulka22', 'http://showup.tv/MrsStrangerXx' ];
 
// add to the queue
for (var i = 0; i < testObjs.length; i++) {
addToQueue(testFunc, testObjs[i]);
}