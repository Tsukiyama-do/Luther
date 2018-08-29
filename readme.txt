/* *****************************************
readme

Created by Hirose, Yuichi on August 1, 2018
Updated by Hirose, Yuichi on

****************************************** */

1. Installation of applications

  1.1  Prerequisites
           OS :  Linux
           Middleware :  node.js, redis, git
                            node.js of any version,  LTS is recommended.
                            redis of any version, Stable is recommended.
                            git of any version.
           - node.js
           	download modules of node.js from https://nodejs.org/en/download/ and install it according to proper documents.

           - redis.js
           	download modules of redis from https://redis.io/download/ and install it according to proper documents.

            - git
          	install git according to https://git-scm.com/book/en/v2/Getting-Started-Installing-Git

            Currently tested at 8.0.0 of node.js and 4.0.8 of redis and 2.7.4 of git

  1.2  Download applications and setup files

    1.2.1 Download the main applications

      Using terminal mode, put the following commands:
        1. move to directory that you want to install to    (ex. ~/github.com/Tsukiyama)
        2. $git clone

    1.2.2 Setup to run redis
        1. open the file :
        2.

    1.2.3 Setup npm

      Using terminal mode, put the following commands:
        1. $npm -v
        2. upgrade npm to the latest according to the message.

    1.2.4 Install packages of Javascript

        1. $ls package.json
        2. $npm install
        3. confirm that node_modules directory is created.

    1.2.5 Make directories
        1. $cd (project directory)
        2. $mkdir db




2. Run applications
    Note that there are two modules. Both can be run independently.

    2.1 Start redis
      1. $cd (project directory)
      2. $cd redis-log
      3. $./goredis.sh

    2.2  start the mining module.
        1. $cd (project directory)
        2. $nodemon --ignore ./db   mining_s.js

        It is found that mining logs will be created on stdout in 30 seconds.

    2.2-1  stop the mining module.
            1. $cd (project directory)
            2. $node stop_mining.js


    2.3  start the web server module.
            1. $cd (project directory)
            2. $nodemon --ignore ./db web_s.js

    2.3-1  stop the web server module.
            1. Put Ctl-c to console of the above.

3. Architecture

//////////// Web Screen /////////////

Web server to put transactions from browsers to mining server, and to return account lists to user or show to history of transactions.  Use socket io - browser <--> Web server, use Redis - Web server <--> mining server

Consists of three menu:
Account :  show account list and balances of each of account.
Transaction : Register a transaction of fromAccount to toAccount with amount, currency, valuedate, beneficiary, order_cust, remarks.
History : show all transactions associated with particular accounts.

1. Open up Chrome
2. URL to access web page :   http://localhost:3030/
3. Go to Developer Tool and change to iphone mode

//////////// Mining server /////////////

Mining server to collect transactions and mine them, or to pick up account lists, to return history of transactions, or to send transactions to other server as p2p.  Use socket io - mining server <--> Dummy server, use Redis - Web server <--> mining server.

To start collecting transactions and then start mining, and send trans to p2p,  every 30 seconds.


//////////// files and directories ////////

-- views  rendering files
-- routes  express routing files
-- public  public folder for express
-- ssl    files of keys  -- we do not use them this time.

web_s.js  --  web server using express.
mining_s.js  -- mining server
dummy_s.js  --  dummy server
