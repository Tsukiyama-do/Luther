
class jikan {
  constructor () {

  }
  zero_p2(num) {
    return ('00' + num).slice( -2 );
  }
  zero_p3(num) {
    return ('000' + num).slice( -3 );
  }

  ima_s(zone) {
    var dt_n = new Date();

    if (zone == 'GMT') {
      var s_GMT = String(dt_n.getUTCFullYear()) + "/" +  this.zero_p2(dt_n.getUTCMonth() + 1) + "/" +  this.zero_p2(dt_n.getUTCDate()) + " " +  this.zero_p2(dt_n.getUTCHours()) + ":" + this.zero_p2(dt_n.getUTCMinutes()) + ":" + this.zero_p2( dt_n.getUTCSeconds());
      return s_GMT;
    } else {
      var s_JST = String(dt_n.getFullYear()) + "/" +  this.zero_p2(dt_n.getMonth() + 1) + "/" +  this.zero_p2(dt_n.getDate()) + " " +  this.zero_p2(dt_n.getHours()) + ":" + this.zero_p2(dt_n.getMinutes()) + ":" + this.zero_p2( dt_n.getSeconds());
      return s_JST;
    }
  }
  ima_m(zone) {
    var dt_n = new Date();
    if (zone == 'GMT') {
      var s_GMT = String(dt_n.getUTCFullYear()) +  this.zero_p2(dt_n.getUTCMonth() + 1)  + this.zero_p2(dt_n.getUTCDate()) +  this.zero_p2(dt_n.getUTCHours()) + this.zero_p2(dt_n.getUTCMinutes()) + this.zero_p2( dt_n.getUTCSeconds()) + this.zero_p3(dt_n.getUTCMilliseconds());
      return s_GMT;
    } else {
      var s_JST = String(dt_n.getFullYear()) +  this.zero_p2(dt_n.getMonth() + 1 ) +  this.zero_p2( dt_n.getDate()) +  this.zero_p2(dt_n.getHours()) + this.zero_p2(dt_n.getMinutes()) + this.zero_p2( dt_n.getSeconds()) + this.zero_p3(dt_n.getMilliseconds());
      return s_JST;
    }
  }
}
module.exports = jikan;

/*
var temp = new jikan();
console.log("It is :" + temp.ima_s());
console.log("It is :" + temp.ima_m());
console.log("It is :" + temp.ima_s('GMT'));
console.log("It is :" + temp.ima_m('GMT'));
*/

//console.log("It is now " + dt_n.getUTCFullYear() + "/" +  String(dt_n.getUTCMonth() + 1) + "/" +  String(dt_n.getUTCDate()) + " " +  String(dt_n.getUTCHours()) + ":" + String(dt_n.getUTCMinutes()) + ":" + String( dt_n.getUTCSeconds()) + " " ) ;

/*
var smallobj = new Object();

smallobj.fromAddress = '33332222aaa';
smallobj.toAddress = '323212cc';
smallobj.amount = 5000;



var myobj = new Object();

myobj.tag = 'acclst';
myobj.rst = smallobj;

console.log("conversion : " + JSON.stringify(myobj));
*/
