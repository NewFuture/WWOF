'use strict'
var fs = require('fs')
var http = require('http')

var DEFAULT_HOST = '127.0.0.1:8888'
var javascript = fs.readFileSync('public/offworker.js', 'utf-8') // read the file at init

var WebServer = http.createServer(function (request, response) {
  if ('/' === request.url || '/offworker.js' === request.url) {
    response.writeHead(200, {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'max-age=2592000, public'
    })
    // return the code and replace the host
    if (request.headers.host) {
      response.end(javascript.replace(DEFAULT_HOST,request.headers.host))
    }else {
      response.end(javascript)
    }
  }else {
    console.log((new Date()) + ' NOT FOUND request for ' + request.url)
    response.writeHead(404, {'Content-Type': 'text/html'})
    response.end('using WebSocket to connect!')
  }
})

module.exports = function (port, host) {
  WebServer.listen(port, host, function () {
    console.log((new Date()) + ' Server is listening on port %s', port)
  })
  return WebServer
}
