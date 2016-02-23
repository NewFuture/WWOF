 //fibonacci.js
 //计算斐波那契数列
 var fibonacci = function(n) {
 	return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
 };
 onmessage = function(event) {
 	postMessage(fibonacci(event.data));
 };