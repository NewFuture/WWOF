// worker 管理分配模块
// for example
// require('MasterWorker.js')(8888);
var WebSocketServer = require('ws').Server; //websocket server
var Worker = require('webworker-threads').Worker; //服务器上运行的worker
var download = require('./down.js'); //下载

//服务器端worker封装
var ServerWorker = function(file, websocket) {

  websocket.worker_status = 1;
  Master.liveWorker++;

  //serverWorker接口
  var worker = new Worker(file);
  var sWorker = {
    /*post Message*/
    postMessage: function(msg) {
      console.log('[' + websocket.id + '] C->S: ' + msg);
      return worker.postMessage(msg);
    },
    /*关闭*/
    close: function() {
      worker.terminate();
      Master.liveWorker--;
      websocket.worker_status = -1;
      console.log('[' + websocket.id + '] worker terminate!');
    }, //close
  }; //sWorker;

  worker.onerror = function(data) {
    Master.liveWorker--;
    websocket.post(-1, data);
    websocket.worker_status = -1;
    console.log('[' + websocket.id + '] error');
  };

  worker.onmessage = function(ent) {
    console.log('[' + websocket.id + '] S->C: ' + ent.data);
    websocket.post(2, ent.data);
  };
  return sWorker;
}; //ServerWorker

var Master = function(port) {

  this.startTime = new Date(); //记录启动时间
  console.log(this.startTime.toString() + "\nStart Server at, wait for connection!");

  //开启web socket server
  this.wss = new WebSocketServer({
    'port': port
  });

  //收到链接之后
  this.wss.on('connection', function(ws) {
    Master.counter++;
    ws.worker = null; //服务器上运行的 worker
    ws.id = Master.counter;
    ws.worker_status = -1; //worker的状态
    /*发送数据给客户端*/
    ws.post = function(code, msg) {
      ws.send(JSON.stringify({
        'status': code,
        'data': msg
      }));
    };

    console.log('\n[' + ws.id + '] connection from ' + ws.upgradeReq.headers.origin);
    console.log(ws.upgradeReq.headers['user-agent']);

    /*响应客户端数据*/
    ws.onmessage = function(ent) {

      var info = JSON.parse(ent.data);
      switch (info.cmd) {

        case 2: //postMessage
          if (ws.worker_status > 0) {
            ws.worker.postMessage(info.data);
          } else {
            //worker未创建！
            console.log('post without worker');
            ws.post(ws.worker_status, 'worker is not available')
          }
          break;

        case 1: //创建worker
          url = info.data; //文件地址
          ws.worker_status = 0;
          console.log('[' + ws.id + ']worker create :' + url);

          download(url, function(file_name) {
            ws.worker = new ServerWorker(file_name, ws);
            ws.post(1, 'ready');
          });
          break;

        case -1: //关闭worker
          ws.worker.close();
          break;
        default: //未知情况，异常；
          ws.post(-100, 'unkown');
      }
    };

    //socket关闭
    ws.on('close', function() {
      if (ws.worker_status > 0) {
        ws.worker.close(); //关闭worker
      }
      console.log('web socket is closed\n');
    });
  });
  return this;
}; //master

Master.counter = 0; //链接总数
Master.liveWorker = 0; //正在运行的worker数量
module.exports = Master;