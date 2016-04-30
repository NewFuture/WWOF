// Dependencies  
var fs = require('fs');
var url = require('url');
var http = require('http');
var crypto = require('crypto');
//下载目录
module.DOWNLOAD_DIR = './download/';

module.exports = function(file_url, callback) {
    var uri = url.parse(file_url);
    // console.log(uri); 
    var file_name = crypto.createHash('md5').update(file_url).digest('hex') + Math.random() + '.js'
    var file_name = module.DOWNLOAD_DIR + file_name;
    var file = fs.createWriteStream(file_name);

    http.get(uri, function(res) {
        res.on('data', function(data) {
            file.write(data);
        }).on('end', function() {
            file.end();
            console.log(file_name + ' is downloaded ');
            callback(file_name);
        });
    });
};