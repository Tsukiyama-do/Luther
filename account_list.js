
// Purpose : to return a list of accounts set on the node.


var fs = require('fs');
var path = require('path');

class account_list {
  constructor(){
  }
  search_files(s_dir, s_ext){
    this.s_dir = s_dir;
    this.s_ext = s_ext;
    try {
      var s_rst = [];
      var list = fs.readdirSync(this.s_dir);
      for (var i = 0; i < list.length; i++) {
        var stats = fs.statSync(path.join(this.s_dir, list[i]));
        if (stats.isFile() && path.extname(list[i]) == this.s_ext) {
//            console.log(list[i]);
            s_rst.push(list[i]);
        }
      }
      return s_rst;
    }  // end of try
    catch (err) {
      console.error(err);
    }
  }
}

var accounts = new account_list();

module.exports = accounts;
