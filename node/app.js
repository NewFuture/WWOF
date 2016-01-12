
var fs = require('fs');
var http = require('http');
var https = require('https');
var download = require('./down.js')


var app = http.createServer().listen( 8888 );
var WebSocketServer = require('ws').Server,
wss = new WebSocketServer( { server : app } );

var file_downloaded = false;

wss.on('connection', function( ws ) {
    console.log('connection successful!');
    ws.send('hello client!');

    ws.on('message', function( data, flags ) {

      if(data.substr(-3) == '.js' && !file_downloaded){

        download(data, function(file_name){
          //ws.send("Success download " + file_name);
          file_downloaded = true;
          //var worker = new Worker('./temp/' + file_name);
        });          

      }
        
      //do something here
      console.log(data);
    });
    ws.on('close', function() {
      console.log('stopping client');
    });
});





/*var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(8888);

function handler (req, res) {

  fs.readFile(__dirname + '/index.html',
  function (err, data) {
	if (err) {
	  res.writeHead(500);
	  return res.end('Error loading index.html');
	}
	res.writeHead(200);
	res.end(data);
  });
}

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
	console.log(data);
  });
});*/