// worker 管理分配模块
// for example
// require('MasterWorker.js')(8888);
var WebSocketServer = require('ws').Server; //websocket server
var Worker = require('webworker-threads').Worker; //服务器上运行的worker
var download = require('./down.js'); //下载

function LOG(msg) {
  console.log(Date.now() + msg);
}
//服务器端worker封装
var ServerWorker = function(file, websocket) {

  websocket.worker_status = 1;
  Master.liveWorker++;
  // var LOG = function(msg) {
  //       LOG('[' + websocket.id +']'+ msg);
  //   }
  //serverWorker接口
  var worker = new Worker(file);
  var sWorker = {
    /*post Message*/
    postMessage: function(msg) {
      websocket.LOG('C->S: ' + msg);
      //向worker发送指令时间
      return worker.postMessage(msg);
    },
    /*关闭*/
    close: function() {
      worker.terminate();
      Master.liveWorker--;
      websocket.worker_status = -1;
      websocket.LOG('worker terminate!');
    }, //close
  }; //sWorker;

  worker.onerror = function(data) {
    Master.liveWorker--;
    websocket.post(-1, data);
    websocket.worker_status = -1;
    websocket.LOG('error');
  };

  worker.onmessage = function(ent) {
    websocket.LOG('S->C: ' + ent.data);
    websocket.post(2, ent.data);
  };
  return sWorker;
}; //ServerWorker

var Master = function(port, host) {
  port = port || 8888;
  host = host || '::';
  this.startTime = new Date(); //记录启动时间
  LOG(this.startTime.toString() + "\nStart Server at, wait for connection!");

  //开启web socket server
  this.wss = new WebSocketServer({
    'port': port,
    'host': host
  });

  //收到链接之后
  this.wss.on('connection', function(ws) {
    Master.counter++;
    ws.worker = null; //服务器上运行的 worker
    ws.id = Master.counter;
    ws.worker_status = -1; //worker的状态

    ws.LOG = function(msg) {
      LOG('[' + ws.id + ']' + String(msg).substring(0, 100));
    }

    /*发送数据给客户端*/
    ws.post = function(code, msg) {
      ws.send(JSON.stringify({
        'status': code,
        'data': msg
      }));
    };

    ws.LOG(ws.upgradeReq.headers.origin);
    ws.LOG(ws.upgradeReq.headers['user-agent']);

    /*响应客户端数据*/
    ws.onmessage = function(ent) {

      var info = JSON.parse(ent.data);
      switch (info.cmd) {

        case 2: //postMessage
          if (ws.worker_status > 0) {
            ws.worker.postMessage(info.data);
          } else {
            //worker未创建！
            ws.LOG('post without worker');
            ws.post(ws.worker_status, 'worker is not available')
          }
          break;

        case 1: //创建worker
          url = info.data; //文件地址
          ws.worker_status = 0;
          ws.LOG('worker create :' + url);

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
      ws.LOG('web socket is closed\n');
    });
  });
  return this;
}; //master

Master.counter = 0; //链接总数
Master.liveWorker = 0; //正在运行的worker数量
module.exports = Master;