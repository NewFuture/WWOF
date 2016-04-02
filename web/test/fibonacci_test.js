 //fibonacci.js
 var fibonacci = function(n) {
 	return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
 };
 onmessage = function(event) {
    var data = event.data;
    var start = Date.now();
    var res = fibonacci(data);
    var current = Date.now();
    var runtime = current - start;
    var response = "data," + data + ",res," + res + ",runtime," + runtime;
 	postMessage(response);
 };