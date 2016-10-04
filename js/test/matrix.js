'use strict'

var WORKER_URL = 'worker/matrix_mul.js'
var TIMES = 8
var M = 200,N = 10
var MatrixA = []
var MatrixB = []

function run () {
  for (var i = 0; i < M; i++) {
    MatrixA[i] = []
    for (var j = 0; j < M; j++) {
      MatrixA[i][j] = i * M + j
    }
  }
  // for (var i = 0; i < M; i++) {
  //   MatrixB[i] = new Array()
  //   for (var j = 0; j < M; j++) {
  //     MatrixB[i][j] = j * M + i
  //   }
  // }
  var data = [MatrixA, N]

  document.write('<table border="1"><tr><th>NO.</th><th>StartTime</th><th>FinishTime</th><th>Result</th><th>UseTime</th></tr>')
  // var startTime = Date.now()
  for (var i = 0; i < TIMES; i++) {
    var test_worker = new Worker(WORKER_URL)
    test_worker.id = i
    test_worker.onmessage = function (event) {
      // console.log(event.data)
      var current = Date.now()
      var resTime = current - this.startTime
      var tds = document.getElementById('t_' + this.id).childNodes
      tds[2].innerHTML = current
      tds[3].innerHTML = event.data
      tds[4].innerHTML = resTime
      // tds[5].innerHTML = current - startTime
      this.terminate()
    }
    test_worker.startTime = Date.now()
    test_worker.postMessage(data)
    document.write('<tr id="t_' + i + '"><td>' + i + '</td><td>' + test_worker.startTime + '</td><td>running...</td><td>running...</td><td>running...</td></tr>')
  }
  document.write('</table>')
}
