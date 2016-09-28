;
(function() {
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

  function getAbsoluteUrl(url) {
    var a = document.createElement('A');
    a.href = url; // 设置相对路径给Image, 此时会发送出请求
    url = a.href; // 此时相对路径已经变成绝对路径
    return url;
  }

  var _Worker = window.Worker;

  var offWorker = function(url, server) {
    var ws = this._ws = new WebSocket(server || offWorker.DEFAULTSERVER);

    this.url = url;
    this.isNative = false;
    this.collector = [];

    url = getAbsoluteUrl(url);

    ws.onopen = function() {
      var option = {
          cmd: 1,
          data: url
      };

      WSCLOSED = false;

      ws.send(JSON.stringify(option));
    }

    ws.onmessage = function(event) {
      var status = JSON.parse(event.data).status;
      if (status < 0) {
        this.goNative();
        return;
      }
      if (status == 1) {
        this.isReady = true;
        this.postMessage();
        return;
      }
      if (typeof this.onmessage != 'function' || !this.isReady) {
        return;
      } else if (status == 2) {
        this.onmessage(JSON.parse(event.data));
      }
    }.bind(this);

    ws.onerror = function(event) {
      this.goNative();
      if (typeof this.onerror != 'function' || !this.isReady) {
        return;
      } else {
        this.onerror(event);
      }
    }.bind(this);
  }

  offWorker.prototype.postMessage = function(value) {
    if (this.isNative) {
      value ? this.nativeWorker.postMessage(JSON.stringify({ cmd: 2, data: value })) : void 0;
      return;
    }
    if (!this.isReady) {
      this.collector.push(value);
    } else {
      if (WSCLOSED) {
          return;
      } else {
        if (this.collector.length) {
          for (var i = 0; i < this.collector.length; i++) {
            var prevData = this.collector[i];
            this._ws.send(JSON.stringify({ cmd: 2, data: prevData }));
          }
          this.collector = [];
        }
        value ? this._ws.send(JSON.stringify({ cmd: 2, data: value })) : void 0;
      }
    }
  }

  offWorker.prototype.terminate = function() {
    if (this.isNative) {
      this.nativeWorker.terminate();
      return;
    }
    if (!this.isReady) {
      setTimeout(function() {
        this.terminate();
      }.bind(this));
    } else {
      this.postMessage();
      WSCLOSED = true;
      this._ws.send(JSON.stringify({ cmd: -1, data: 'close' }));
      this.isReady = false;
      this._ws.close();
    }
  }

  offWorker.prototype.goNative = function() {
    this.isNative = true;
    this.nativeWorker = new _Worker(this.url);
    this.nativeWorker.onmessage = this.onmessage;
    this.nativeWorker.onerror = this.onerror;
    while (this.collector.length) {
      var msg = this.collector.shift();
      this.nativeWorker.postMessage(JSON.stringify({ cmd: 2, data: msg }));
    }
  }

  offWorker.DEFAULTSERVER = 'ws://127.0.0.1:8888';

  // Some AMD build optimizers like r.js check for condition patterns like the following:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    // Expose to the global object when an AMD loader is present to avoid
    // errors in cases where lodash is loaded by a script tag and not intended
    // as an AMD module. See http://requirejs.org/docs/errors.html#mismatch for
    // more details.
    root.Worker = offWorker;

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
      (freeModule.exports = offWorker).Worker = offWorker;
    }
    // Export for Rhino with CommonJS support.
    else {
      freeExports.Worker = offWorker;
    }
  } else {
    // Export for a browser or Rhino.
    root.Worker = offWorker;
  }
}.call(this));
