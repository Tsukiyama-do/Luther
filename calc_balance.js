
// class object to calculate the balance to account.

var fs = require('fs');
var path = require('path');

class calc_balance {    // To calculate balance of the account subject to an argment
  constructor(){

  }
  act_find(s_nickname){         //
    var s_acno = fs.readFileSync( __dirname + '/master/' + s_nickname + '.hash' , 'utf-8');
    return s_acno;
  }    //  EOF of act_find

  get_calculated(tran_dir, tar_nickname){     // return balance of account
                            // tran_dir should be  __dir + /db    tar_nickname should be nickname of account no.
    var i_balance = 0;
    var s_acno = '';
    s_acno = this.act_find(tar_nickname);
// debug    console.log("nickname account is " + s_acno);
    var rslt = this.search_files(tran_dir);
    rslt.forEach(function(element){
      var block_json = fs.readFileSync(tran_dir + '/' + element);
      var block_obj = JSON.parse(block_json);
        block_obj.transactions.forEach(function(tras){
          if (tras.fromAddress == s_acno) {
            i_balance -= parseInt(tras.amount,10)
          }
          if (tras.toAddress == s_acno) {
            i_balance += parseInt(tras.amount,10)
          }
/* debug
          console.log("fromAddress : " + tras.fromAddress);
          console.log("toAddress : " + tras.toAddress);
          console.log("amount : " + tras.amount);
          if (i_balance < 0) { console.log("balance is minus.");}
          console.log("Current balance is " + i_balance.toString(10));
*/
        });
    });
// debug    console.log("balance of " + tar_nickname + " : " + i_balance.toString(10));
    return i_balance;

  }  //  EOF of get_calculated

  search_files(s_dir){    //  search block files subject to directory of argment
    try {
      var s_rst = [];
      var list = fs.readdirSync(s_dir);
      for (var i = 0; i < list.length; i++) {
        var stats = fs.statSync(path.join(s_dir, list[i]));
        if (stats.isFile() && path.extname(list[i]) == '.json') {
//            console.log(list[i]);
            s_rst.push(list[i]);
        }
      }
      return s_rst;       //  return array
    }  // end of try
    catch (err) {
      console.error(err);
    }
  }    //  EOF of search_files
}

var account_balance = new calc_balance();
module.exports = account_balance;
