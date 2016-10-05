// bubblesort.js
// 随机数组排序
// http://stackoverflow.com/questions/962802#962890
function shuffle (n) {
  for (var array = [], i = 0; i < n; ++i) array[i] = i
  var tmp, current, top = array.length
  if (top)
    while (--top) {
      current = Math.floor(Math.random() * (top + 1))
      tmp = array[current]
      array[current] = array[top]
      array[top] = tmp
  }
  return array
}

function bubbleSort (array) {
  var len = array.length,
    swapped,
    i,
    j

  for (i = 0; i < len; ++i) {
    swapped = false

    for (j = 0; j < len - 1; ++j) {
      if (array[j] < array[j + 1]) {
        var temp = array[j + 1]
        array[j] = array[j + 1]
        array[j + 1] = temp
        swapped = true
      }
    }

    if (!swapped) {
      break
    }
  }
  return array;
}

onmessage = function (event) {
  var data = event.data
  var start = Date.now()
  var res = bubbleSort(shuffle(data))
  var current = Date.now()
  var runtime = current - start
  var response = 'data,' + data + ',res,' + res[0] + ',runtime,' + runtime
  postMessage(response)
}
