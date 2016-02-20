;(function() {

	var objectTypes = {
    'function': true,
    'object': true
  };

	/** Detect free variable `exports`. */
  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = freeExports && freeModule && typeof global == 'object' && global && global.Object && global;

  /** Detect free variable `self`. */
  var freeSelf = objectTypes[typeof self] && self && self.Object && self;

  /** Detect free variable `window`. */
  var freeWindow = objectTypes[typeof window] && window && window.Object && window;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;

  /**
   * Used as a reference to the global object.
   *
   * The `this` value is used if it's the global object to avoid Greasemonkey's
   * restricted `window` object, otherwise the `window` object is used.
   */
  var root = freeGlobal || ((freeWindow !== (this && this.window)) && freeWindow) || freeSelf || this;

  var WSREADYSTATE = {
  	CONNECTING: 0,
  	OPEN: 1,
  	CLOSING: 2,
  	CLOSED: 3
  };

  var WSCLOSED = false;

	var offWorker = function(url, server) {
		var ws = this._ws = new WebSocket(server || offWorker.DEFAULTSERVER);

		ws.onopen = function() {

      var option = {
        cmd: 1,
        data: url
      };

			ws.send(JSON.stringify(option));
		}

		ws.onmessage = function(event) {
      if (JSON.parse(event.data).status == 1) {
        this.isReady = true;
      }
			if (typeof this.onmessage != 'function' || !this.isReady) {
				return;
			} else if(JSON.parse(event.data).status == 2) {
				this.onmessage(JSON.parse(event.data));
			}
		}.bind(this);

    ws.onerror = function(event) {
      if (typeof this.onerror != 'function' || !this.isReady) {
        return;
      } else {
        this.onerror(event);
      }
    }
	}

	offWorker.prototype.postMessage = function(value) {
		if (!this.isReady) {
			setTimeout(function() {
				this.postMessage(value);
			}.bind(this));
		} else {
			if (WSCLOSED) {
				return;
			} else {
				this._ws.send(JSON.stringify({cmd: 2, data: value}));
			}
		}
	}

	offWorker.prototype.close = function() {
		if (!this.isReady) {
			setTimeout(function() {
				this.close();
			}.bind(this));
		} else {
			WSCLOSED = true;
      this._ws.send(JSON.stringify({cmd: -1, data: 'close'}));
      this.isReady = false;
      this._ws.close();
		}
	}

	offWorker.DEFAULTSERVER = 'ws://127.0.0.1:8888';

  // Some AMD build optimizers like r.js check for condition patterns like the following:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    // Expose lodash to the global object when an AMD loader is present to avoid
    // errors in cases where lodash is loaded by a script tag and not intended
    // as an AMD module. See http://requirejs.org/docs/errors.html#mismatch for
    // more details.
    root.offWorker = offWorker;

    // Define as an anonymous module so, through path mapping, it can be
    // referenced as the "underscore" module.
    define(function() {
      return offWorker;
    });
  }
  // Check for `exports` after `define` in case a build optimizer adds an `exports` object.
  else if (freeExports && freeModule) {
    // Export for Node.js or RingoJS.
    if (moduleExports) {
      (freeModule.exports = offWorker).offWorker = offWorker;
    }
    // Export for Rhino with CommonJS support.
    else {
      freeExports.offWorker = offWorker;
    }
  }
  else {
    // Export for a browser or Rhino.
    root.offWorker = offWorker;
  }
}.call(this));
