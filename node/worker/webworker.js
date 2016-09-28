"use strict";

const fork = require("child_process").fork;
const download = require("./download.js");

const worker = __dirname + "/worker.js";
const events = /^(error|message)$/;

class Worker {
	constructor(url, ready_callback) {

		this.child = fork(worker);
		this.onerror = undefined;
		this.onmessage = undefined;

		this.child.on("error", e => {
			if (this.onerror) {
				this.onerror.call(this, e);
			}
		});
		this.child.on("message", msg => {
			if (this.onmessage) {
				this.onmessage.call(this, JSON.parse(msg));
			}
		});
		
		download(url, script => {
			this.child.send(script);
			if (ready_callback) {
				ready_callback();
			}
		});
	}

	addEventListener(event, fn) {
		if (events.test(event)) {
			this["on" + event] = fn;
		}
	}

	postMessage(msg) {
		this.child.send(JSON.stringify({
			data: msg
		}));
	}

	terminate() {
		this.child.kill("SIGHUP");
	}
}

module.exports = Worker;