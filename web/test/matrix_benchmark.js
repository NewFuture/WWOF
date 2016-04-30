var TIMES = 4;
var WORKER_URL = './test/matrix_mul.js';
var OFFLOAD_SERVER = 'ws://server.newfuture.cc:8888';

var M = 500;
var MatrixA = new Array();
var MatrixB = new Array();
for (var i = 0; i < M; i++) {
  MatrixA[i] = new Array();
  for (var j = 0; j < M; j++) {
    MatrixA[i][j] = i * M + j;
  }
}
for (var i = 0; i < M; i++) {
  MatrixB[i] = new Array();
  for (var j = 0; j < M; j++) {
    MatrixB[i][j] = j * M + i;
  }
}
var data = [MatrixA, MatrixB];

document.write('<table border="1"><tr><th>NO.</th><th>StartTime</th><th>FinishTime</th><th>Result</th><th>UseTime</th></tr>');
// var startTime = Date.now();
for (var i = 0; i < TIMES; i++) {
  var test_worker = new Worker(WORKER_URL, OFFLOAD_SERVER);
  test_worker.id = i;
  test_worker.onmessage = function(event) {
    console.log(event.data);
    var current = Date.now();
    var resTime = current - this.startTime;
    var tds = document.getElementById('t_' + this.id).childNodes;
    tds[2].innerHTML = current;
    tds[3].innerHTML = event.data;
    tds[4].innerHTML = resTime;
    // tds[5].innerHTML = current - startTime;
    this.terminate();
  }
  test_worker.startTime = Date.now();
  test_worker.postMessage(data);
  document.write('<tr id="t_' + i + '"><td>' + i + '</td><td>' + test_worker.startTime + '</td><td>running...</td><td>running...</td><td>running...</td></tr>');
}
document.write('</table>');