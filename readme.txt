/* *****************************************
readme

Created by Hirose, Yuichi on August 1, 2018
Updated by Hirose, Yuichi on August 29, 2018

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

            - web
            Web application needs to be connected to Internet since there are modules of JQuery mobile that accesses to the site of JQuery.

  1.2  Download applications and setup files

    1.2.1 Download the main applications

      Using terminal mode, put the following commands:
        1. move to project directory that you want to install to   (ex. ~/github.com/Tsukiyama)
        2. $git clone https://github.com/Tsukiyama-do/Luther.git

    1.2.2 Setup to run redis
        1. open the file : (project directory)/redis-log/goredis.sh
        2. edit the path of redis-server depending on the environment.
        3. save the file.
        4. open the file : (project directory)/redis-log/cli-redis.sh
        5. edit the path of redis-client depending on the environment.
        6. save the file.

    1.2.3 Setup npm

      Using terminal mode, put the following commands:
        1. $npm -v
        2. upgrade npm to the latest according to the message.
        note : npm will be installed simultaneously with node.js.

    1.2.4 Install packages of Javascript

        1. $cat (project diretory)/package.json
        2. $npm install
        3. To confirm that node_modules directory is created.

    1.2.5 Make directories
        1. $cd (project directory)
        2. $mkdir ./db
        3. $mkdir ./redis-log/logs


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

    2.3  start the web server module.
            1. $cd (project directory)
            2. $nodemon --ignore ./db web_s.js

    2.4  access to the web page of blockchain
            1. Run Chrome or Firefox.
            2. Acceess to URL  http://127.0.0.1:3030
            3. Change the screen to iphone mode if you prefer.

    2.5  suspend the mining module.
            1. $cd (project directory)
            2. $node stop_mining.js

    2.6  stop the mining module.
            1. $cd (project directory)
            2. Put Ctl-C to the console of mining_s

    2.7  stop the web server module.
            1. $cd (project directory)
            2. Put Ctl-C to the console of web_s

    2.8 Stop redis
      1. $cd (project directory)
      2. $cd redis-log
      3. $./cli-red.sh
      4. 127.0.0.1:6379> SHUTDOWN NOSAVE
      5. not connected> exit


3. Architecture

    See a powerpoint file in doc directory.


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

web_s.js  --  web server using express.
mining_s.js  -- mining server
