var express = require('express');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var fs = require('fs');
var http = require('http');
// var https = require('https');
var bodyParser = require('body-parser');

var app = express();

//  session 情報
app.use(session({
  store : new RedisStore({
          host : '127.0.0.1',
          port : 6379 ,
          prefix:'azara.dev'
        }),
  secret : true,
  resave: true,
  saveUninitialized: true,
  cookie:{
    httpOnly: false,
    secure: true,
    maxage: 1000 * 60 * 30
  },
  loginUser : '',
  cartNumber : ''

}));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// static files
app.use(express.static(__dirname + '/public'));

// set up template engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// listen to port
var io = require('socket.io').listen(app.listen(3030));
console.log("Express server listening to port 3030 and socket.io is running.");


io.sockets.on('connection', function (socket) {
// debug    console.log('client connect');
    socket.on('echo', function (data) {
        io.sockets.emit('message', data);
    });
    socket.on('ping', function (data) {
        io.sockets.emit('message', 'OK');
    });

    socket.on('client_to_server', function (data) {
      var myobj = JSON.parse(data);

      if(myobj.tag == "acclst" || myobj.tag == "acclst2") {  //  to get list of accounts.
        var ac = require('./account_list.js');     // class object to search account list.
        var ac_l = ac.search_files(__dirname + '/master', '.hash');  //  find files of accounts
        var json_msg = [];
        ac_l.forEach(function(element){
          json_msg.push('{ "tag" : "' + myobj.tag + '" , "rst" : "' + element.replace('.hash','') + '" } ');
//          console.log("account list is " + '{ "tag" : "' + myobj.tag + '" , "rst" : "' + element.replace('.hash','') + '" } ');   // debug
        });
        io.sockets.emit('server_to_client', json_msg);
      }          //  End of if acclst

      if(myobj.tag == "accbalance") {  //  to get list of balance of the account.
        var cb = require('./calc_balance.js');     // class object to calculate the balance to account.
        var i_balance = cb.get_calculated(__dirname + '/db', myobj.rst);  //  get balance
        var json_msg = [];
        json_msg.push('{ "tag":"accbalance", "rst" : "' + String(i_balance) + '" } ');
        io.sockets.emit('server_to_client', json_msg);
      }            //  End of if accbalance

      if(myobj.tag == "tran") {  //  to get a message of a transaction
        var rd = require('./send_web_redis.js');     // class object to send data to redis
        var rcv = new rd();
        rcv.sendTTrans('webtochain', JSON.stringify(myobj.rst));      // send message to redis
        console.log("Here is message sent to Redis. " + JSON.stringify(myobj.rst));

        var json_msg = [];
        json_msg.push('{ "tag":"tran", "rst" : "Transaction is being sent to redis, blockchain!" } ');
        io.sockets.emit('server_to_client', json_msg);
      }            //  End of if accbalance



    });

});

// Make io accessible to our router
app.use(function(req,res,next){
    req.io = io;
    next();
});


// include routes
var routes = require('./routes/router');
app.use(routes);

module.exports = routes;
