//简单的应答测试
//响应you said ：输入
onmessage=function(ent){
	postMessage('you said:'+ent.data);
};