//log.js
//简单log
console.log('log worker start!');
var log = function(data) {
	console.log('worker said log:' + data);
	postMessage('LOG:' + data);
};
onmessage = function(ent) {
	log(ent.data);
};