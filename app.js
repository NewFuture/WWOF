#!/usr/bin/env node

'use strict'

var MasterWorker = require('./masterworker.js')
var WebServer = require('./webserver.js')

var port = process.argv[2] || 8888
var host = '::'

var server = WebServer(port, host)
MasterWorker({server: server})
