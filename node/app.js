var http = require('http');
var download = require('./down.js')
var Worker = require('webworker-threads').Worker;

function getFullURL(url)//获取完整的url
{
  return url;
}

console.log(Date.now()+" start");

var app = http.createServer().listen( 8888 );
var WebSocketServer = require('ws').Server,
//服务器上的socket
wss = new WebSocketServer( { server : app } );

wss.on('connection', function( ws ) {
  
 console.log('connection successful!');
  
  var worker=null;//worker

  ws.onmessage=function(ent){
    var info =JSON.parse(ent.data);
    switch(info.cmd)
    {
      case 2://postmessage
        if(worker)
        {
          worker.postMessage(info.data);
          console.log('worker receive :'+info.data);
        }else{
          //worker未创建！

        }
        break;
      case 1://创建worker
          url= getFullURL(info.data);//文件地址
          console.log('worker create :'+url);
          download(url, function(file_name){
           worker=new Worker(file_name);

            worker.onmessage=function(ent) {//worker响应数据返回客户端
              ret={'status':1,'data':ent.data};
              ws.send(JSON.stringify(ret));
            };
           });
        break;
      case -1://关闭worker
        worker.terminate();
        console.log('worker close');
        worker=null;
        break;
      default://未知情况，异常；
      ;
    }
  };

//socket关闭
  ws.on('close', function() {
      console.log('stopping client');
      if(worker)//关闭worker
      {
        worker.terminate();
        worker=null;
      }
   });
});