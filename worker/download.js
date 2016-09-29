/**
 * download remote file via http
 * TODO：
 *      https https://nodejs.org/api/https.html#https_https_get_options_callback
 *      file cache 
 *      support cookie
 */
"use strict";
const http = require('http');

var download = function(url, callback) {
    http.get(url, (res) => {
            var data = "";
            res.on('data', (chunk) => {
                data += chunk;
            }).on('end', () => {
                callback(data);
            }).on('error', (e) => {
                console.log(`[download] read error: ${e.message}`);
            });
        })
        .on('error', (e) => {
            console.log(`[download] error: ${e.message}`);
        });
};

module.exports = download;