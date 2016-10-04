//生成随机数组
// http://stackoverflow.com/questions/962802#962890
function shuffle(n) {
    for (var array = [], i = 0; i < n; ++i) array[i] = i;
    var tmp, current, top = array.length;
    if (top)
        while (--top) {
            current = Math.floor(Math.random() * (top + 1));
            tmp = array[current];
            array[current] = array[top];
            array[top] = tmp;
        }
    return array;
}

function bubbleSort(array) {
    var len = array.length,
        swapped,
        i,
        j;
    
    for (i = 0; i < len; ++i) {
      swapped = false;
      
      for (j = 0; j < len - 1; ++j) {
        if (_compare(j, '>', j+1)) {
          _swap(j, j+1);
          swapped = true;
        }
      }
      
      if (!swapped) {
        break;
      }
    }
};

 onmessage = function(event) {
    var data = event.data;
    var start = Date.now();
    var res = bubbleSort(shuffle(data));
    var current = Date.now();
    var runtime = current - start;
    var response = "data," + data + ",res," + res + ",runtime," + runtime;
 	postMessage(response);
 };