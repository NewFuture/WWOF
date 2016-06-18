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
            res.on('data', (chunk) => {
                    callback(chunk.toString());
                })
                .on('error', (e) => {
                    console.log(`[download] read error: ${e.message}`);
                });
        })
        .on('error', (e) => {
            console.log(`[download] error: ${e.message}`);
        });
};

module.exports = download;