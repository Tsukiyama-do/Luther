// HEADER INFORMATION
// Redis defined.

// other modules
const SHA256 = require("crypto-js/sha256");
const fs = require('fs');

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

var mining_ac_nickname = 'HRC7774441';  // マイニング用の口座のニックネーム
var g_pendingTransactions = [];  // ペンディング・トランザクションの配列

var jikan = require('./jikan.js');   // 時刻データのフォーマットツール
var jikan_dt = new jikan();


// blockchain section
class Transaction{
    constructor(value_date, amount, currency, tran_name, fromAddress, toAddress, remarks, email){
        this.value_date = value_date;
        this.amount = amount;
        this.currency = currency;
        this.tran_name = tran_name;
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.remarks = remarks;
        this.email = email;
        this.tran_timestamp = jikan_dt.ima_m();
    }
}

class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.previousHash + this.timestamp +
JSON.stringify(this.transactions) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        // ハッシュ値の調査
        while (this.hash.substring(0, difficulty) !== Array(difficulty
+ 1).join("0")) {         //  ハッシュの先頭がゼロか？　チェック
            this.nonce++;      //  ナンスの繰上げ
            this.hash = this.calculateHash();    // 新たなハッシュ値を算出
        }
        console.log("block info is : " + JSON.stringify(this));
        fs.writeFileSync( "./db/" + this.hash + ".json" , JSON.stringify(this));  // ブロックをファイルにエクスポート

        console.log("BLOCK MINED: " + this.hash);
    }
}


class Blockchain{
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 3;    //  set difficulty here
        this.miningReward = 1;  //  1 HRD for rewarding of mining
    }

    createGenesisBlock() {
        return new Block(Date.parse("2017-01-01"), [], "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), g_pendingTransactions,this.getLatestBlock().hash); // 新たにブロックの宣言
        block.mineBlock(this.difficulty);   // 新たなブロックのための計算処理とコミット（確定）

        console.log('Block successfully mined!');
        this.chain.push(block);   //  ブロックの主な情報をチェーンに追加
        g_pendingTransactions = [];  // ペンディング・トランザクションの初期化
    }

    createTransaction(transaction){
        g_pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }

                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}

function ac_find(nickname) {    // 口座情報のファイルを元に、口座ニックネームと実際の口座番号を検索する
    return fs.readFileSync( __dirname + '/master/' + nickname + '.hash' , 'utf-8');
}

let hiroseCoin = new Blockchain();   // start blockchain of hiroseCoin


class recTrans {      // Redisのキューに溜まった、トランザクションデータを抽出し、キューを空にする
  constructor(chain) {
    this.count = 0;
    this.rectrans = [];

  }
  checktrans(queue = 'webtochain') {

    var ar_t = [];
    redisClient.lrange(queue, 0, -1, function(err, items) {  // Redis のキューをアクセス

      if (err) throw err;
      var cnt = items.length;
      items.forEach(function (reply, index) {   //  一件ずつ、Redisデータを拾う。
        console.log("Just received a Transaction from Redis ( " + index + " ) : " + reply);

        var msgobj = JSON.parse(reply);   //  JSON からオブジェクトへデータ変換

        hiroseCoin.createTransaction(new Transaction(msgobj.value_date, msgobj.amount, msgobj.currency, msgobj.tran_name, ac_find(msgobj.fromAddress), ac_find(msgobj.toAddress), msgobj.remarks, msgobj.email));   // トランザクションを、ペンティング・トランザクション・プールに追加
      });

      for (var i = 0; i < cnt; i++ ) {
        redisClient.lpop(queue, function(err, items){  //  Redisに残っているデータを削除している
          if (err) throw err;
        });
      }
    });
    return ar_t;
  }
}



var rec_data = new recTrans();    // create receiving program.
var rec_msgs = [];
var timer1, timer2 = null;
var cnt = 0;
var s_monitor = 0;

class maintenance {       //   本プログラムの一時停止などを行う。
    constructor(){
    }
    watch_mining_s(){

          redisClient.lrange('maintenance', 0, -1, function(err, items) {

            if (err) throw err;
            var cnt = items.length;
            items.forEach(function (reply, index) {
              console.log("Reply " + index + ": " + reply);
              var msgobj = JSON.parse(reply);
              if (msgobj.server == 'mining_s') {
                s_monitor = 1 ;                         // monitor flag to stop mining_s or not.
                console.log('mining_s will stop soon.');
              }

            });

            for (var i = 0; i < cnt; i++ ) {
              redisClient.lpop('maintenance', function(err, items){
                if (err) throw err;
              });
            }
          });

    }
}

var mainte = new maintenance();
// rec_msgs = rec_data.checktrans('webtochain');   //  export transactions from redis


var mining_main = function(){   // this is callback function for timer.

  if (s_monitor == 0 ) {
      mainte.watch_mining_s();      //  check stop-mining
  }

  rec_msgs = rec_data.checktrans('webtochain');   //  redis から取引ログを抽出して、ペンティングトランザクションに追加

  if ( g_pendingTransactions.length > 0 ) {   // ペンディング・トランザクションがあれば、マイニングを行う。
    g_pendingTransactions.push(new Transaction(jikan_dt.ima_m().substring(0,7), 1, 'HRD', 'MINING', null, ac_find(mining_ac_nickname), null, null));   // マイニング報酬用のトランザクション  1 HRD for mining reward

    console.log("Start mining with trans! " );

    hiroseCoin.minePendingTransactions(ac_find(mining_ac_nickname));    // マイニングの開始
    cnt = 0;

  } else {
//      cnt += 1;
//      console.log("No mining " + cnt + " times.");
    g_pendingTransactions.push(new Transaction(jikan_dt.ima_m().substring(0,7), 1, 'HRD', 'MINING', null, ac_find(mining_ac_nickname), null, null));   // マイニング報酬用のトランザクション 1 HRD for mining reward

    console.log("Start mining without a tran! " );

    hiroseCoin.minePendingTransactions(ac_find(mining_ac_nickname));    // マイニングの開始
    cnt = 0;

  }
  if (s_monitor == 1) {
     clearInterval(timer1);   // stop timer
  }
}

timer1 = setInterval(mining_main, 20000);   // timer : call callback every 20 seconds.
