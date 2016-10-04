/**
 * 自动加载offworker
 */
'use strict'

function request (key) {
  if (undefined === request.params) {
    request.params = {}
    location.search.slice(1).split('&').forEach(function (s) {
      var i = s.indexOf('=')
      request.params[s.slice(0, i)] = s.slice(i + 1)
    })
  }
  return request.params[key] // hasOwnProperty
}

function addScript (url) {
  var script = document.querySelector('#offworker-script')
  if (!script) {
    script = document.createElement('script')
    script.id = 'offworker-script'
    document.getElementsByTagName('head')[0].appendChild(script)
  }
  script.src = 'http://' + url
}

window.onload = function () {
  var ServerUrl = request('ws')
  if (ServerUrl) {
    addScript(ServerUrl)
    var s = document.querySelector('#offload-server')
    if (s) {
      s.value = ServerUrl
    }
  }
  var WorkerUrl = request('url')
  if (WorkerUrl) {
    var connect = document.querySelector('#connect-url')
    if (connect) { connect.value = WorkerUrl }
  }
}
this.offloadserver = request('ws')
if (this.offloadserver) addScript(offloadserver)
