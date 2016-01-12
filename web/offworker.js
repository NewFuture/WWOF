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
		var ws = offWorker.prototype._ws = new WebSocket(server || offWorker.DEFAULTSERVER);

		ws.onopen = function() {
			ws.send(url);
		}

		ws.onmessage = function(event) {
			if (typeof this.onmessage != 'function') {
				return;
			} else {
				this.onmessage(event);
			}
		}.bind(this);
	}

	offWorker.prototype.postMessage = function(value) {
		if (this._ws.readyState == WSREADYSTATE.CONNECTING) {
			setTimeout(function() {
				this.postMessage(value);
			}.bind(this));
		} else {
			if (WSCLOSED) {
				this._ws.close();
				return;
			} else {
				this._ws.send(value);
			}
		}
	}

	offWorker.prototype.close = function() {
		if (this._ws.readyState == WSREADYSTATE.CONNECTING) {
			setTimeout(function() {
				this.close();
			}.bind(this));
		} else {
			WSCLOSED = true;
		}	
	}

	offWorker.DEFAULTSERVER = 'ws://localhost:8888';

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