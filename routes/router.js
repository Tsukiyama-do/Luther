var express = require('express');
var router = express.Router();
var url = require('url');
var http = require('http');



var redisURL = url.parse('redis://127.0.0.1:6379');

var ac_counter = "";
var redisClient = require('redis').createClient(
  redisURL.port,
  redisURL.hostname,
  { no_ready_check: true }
);
if (redisURL.auth) {
  redisClient.auth(redisURL.auth.split(':')[1]);
}

router.use((req, res, next) => {
// debug  console.log(' req session id :' + req.session.id );
          // redis client for counter
  redisClient.get('count', function (err, reply) {
    if (err) {
        throw err;
      }
    var count1 = reply;
    if (count1 === null) {
        count1 = 0;
    }
    if (!req.session.repeater) {
        redisClient.set('count', ++count1);
        req.session.repeater = true;
    }
     console.log('redis counter is ' + count1 + ' . ');
    ac_counter = String(count1);
  });
  next();
});

router.get('/', (req, res, next) => {    //  Request path : '/'   get request.
      var ac_t = {   //  Additional data for main screen
                  'ac_cnter' : ac_counter
      };
      res.render('main',{rec_data:ac_t});   // return rendering screen-html with addionals
      next();
});


/*
router.post('/reference', (req,res) => {

      console.log('response is : ' + req.body.account_s);
      var data3 = amountsearch(req.body.account_s);
            res.json(data3);
      });

function amountsearch(act) {
    if ( act == '0' ) {
      return { 'resp' : String(100000)};
    } else if ( act == '1' ) {
      return { 'resp' : String(100001)};
    } else if ( act == '2' ) {
      return { 'resp' : String(100002)};
    } else if ( act == '3' ) {
      return { 'resp' : String(100003)};
    } else if ( act == '4' ) {
      return { 'resp' : String(100004)};
    } else if ( act == '5' ) {
      return { 'resp' : String(100005)};
    } else  {
      return { 'resp' : String(100999)};
    }
}
*/

router.use(logHandler);
router.use(errorHandler);

//エラーログ出力用関数
function logHandler(err, req, res, next) {
              console.error("[" + new Date + "] " + err.toString());
              next(err);
                    }

//エラーハンドリング用関数
function errorHandler(err, req, res, next) {
                      res.status(500);
                      res.send(err.message)
}




module.exports = router;
