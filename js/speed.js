// JUST AN EXAMPLE, PLEASE USE YOUR OWN PICTURE!
// http://stackoverflow.com/questions/5529718/how-to-detect-internet-speed-in-javascript
var imageAddr = 'img/wwo.bmp'
var downloadSize = 3145782 // bytes

function ShowProgressMessage (msg) {
  if (console) {
    if (typeof msg == 'string') {
      console.log(msg)
    } else {
      for (var i = 0; i < msg.length; i++) {
        console.log(msg[i])
      }
    }
  }
  var oProgress = document.getElementById('progress')
  if (oProgress) {
    var actualHTML = (typeof msg == 'string') ? msg : msg.join('<br />')
    oProgress.innerHTML = actualHTML
  }
}
function InitiateSpeedDetection () {
  ShowProgressMessage('Loading the image, please wait...')
  window.setTimeout(MeasureConnectionSpeed, 1)
}

if (window.addEventListener) {
  window.addEventListener('load', InitiateSpeedDetection, false)
} else if (window.attachEvent) {
  window.attachEvent('onload', InitiateSpeedDetection)
}

function MeasureConnectionSpeed () {
  var startTime, endTime
  var download = new Image()
  download.onload = function () {
    endTime = (new Date()).getTime()
    showResults()
  }

  download.onerror = function (err, msg) {
    ShowProgressMessage('Invalid image, or error downloading')
  }

  startTime = (new Date()).getTime()
  var cacheBuster = '?nnn=' + startTime
  download.src = imageAddr + cacheBuster

  function showResults () {
    var duration = (endTime - startTime) / 1000
    // var bitsLoaded = downloadSize
    var speedBps = (downloadSize / duration).toFixed(2)
    var speedKBps = (speedBps / 1024).toFixed(2)
    var speedMBps = (speedKBps / 1024).toFixed(2)
    var speed_msg = speedBps + ' B/s (' + speedBps * 8 + ' bps)'
    if (speedMBps > 1) {
      speed_msg = speedMBps + ' MB/s (' + speedMBps * 8 + ' Mbps)'
    }else if (speedKBps > 1) {
      speed_msg = speedKBps + ' KB/s (' + speedKBps * 8 + ' Kbps)'
    }
    ShowProgressMessage([
      'Your connection speed is: ' + speed_msg,
      '当前下载速度: ' + speed_msg
    ])
  }
}
