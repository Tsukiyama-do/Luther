
/*
var ac = require('./account_list.js');
var json_msg = ac.search_files(__dirname + '/master', '.hash');
json_msg.forEach(function(element){
  console.log(element);
})
*/

var tran_obj = new Object();
tran_obj.server = 'mining_s';
tran_obj.msg = 'stop';



var fs = require('fs');
var url = require('url');
var redisURL = url.parse('redis://127.0.0.1:6379');
var redisClient = require('redis').createClient(
    redisURL.port,
    redisURL.hostname,
    { no_ready_check: true }
);
if (redisURL.auth) {
    redisClient.auth(redisURL.auth.split(':')[1]);
}

class sendToRedis {
    constructor() {
      this.count = 0;
      this.sendtrans = [];
    }
    sendTTrans(queue, msg) {
      redisClient.rpush(queue, msg, function(err, data) {
        if (err) throw err;
        return true;
      });
    }
}

var toredis = new sendToRedis();
console.log("object is " + JSON.stringify(tran_obj));
toredis.sendTTrans('maintenance', JSON.stringify(tran_obj));
