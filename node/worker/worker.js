/**
 * worker https://developer.mozilla.org/en-US/docs/Web/API/Worker
 * @todo:
 * 	importScripts = function(...files) 
 * 	navigator
 *	appName,appVersion,platform,userAgent
 */

"use strict";
const vm = require("vm");

process.once("message", function(script) {
	global.close = function() {
		process.exit(0);
	};
	global.postMessage = function(msg) {
		process.send(JSON.stringify({
			'data': msg
		}));
	};
	global.onmessage = function() {};
	global.onerror = function() {};
	global.addEventListener = function(event, fn) {
		if (event === "message") {
			global.onmessage = fn;
		} else if (event === "error") {
			global.onerror = fn;
		}
	};
	global.self = global;

	process.on("message", function(msg) {
		global.onmessage(JSON.parse(msg));
	});

	process.on("error", function(err) {
		global.onerror(err);
	});

	vm.createScript(script).runInThisContext();
});