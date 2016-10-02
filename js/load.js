function request (paras) {
  var url = location.href
  var paraString = url.substring(url.indexOf('?') + 1, url.length).split('&')
  var paraObj = {}
  for (i = 0; j = paraString[i]; i++) {
    paraObj[j.substring(0, j.indexOf('=')).toLowerCase()] = j.substring(j.indexOf('=') + 1, j.length)
  }
  var returnValue = paraObj[paras.toLowerCase()]
  if (typeof (returnValue) == 'undefined') {
    return ''
  } else {
    return returnValue
  }
}

function init (url) {
  document.querySelector('#offworker').src = "http://"+ url
}

window.onload = function () {
  var WorkerUrl = request('url')
  var ServerUrl = request('ws')
  if (WorkerUrl) document.querySelector('#connect-url').value = WorkerUrl
  if (ServerUrl) {
    init(ServerUrl)
    document.querySelector('#worker-server').value = ServerUrl
  }
}
