'use strict'

var MasterWorker = require('./masterworker.js')
var WebServer = require('./webserver.js')

var port = 8888
var host = '::'

var server = WebServer(port, host)
MasterWorker({server: server})
