/****************************
How to start redis and stop redis


****************************/

1. To start
	$cd (project directory)
	$cd redis-logs
	$./goredis.sh

2. To check redis is working

	$cd (project directory)
	$cd redis-logs
	$./cli-red.sh
	127.0.0.1:6379>ping        // command to see if it is alive or not
	PONG                       //  PONG means redis is alive.
	127.0.0.1:6379>        

3. To stop 
	$cd (project directory)
	$cd redis-logs
	$./cli-red.sh
	127.0.0.1:6379>shutdown nosave         // command to stop redis.  Uppercase or not of command does not matter.
											// nosave or same means if current memory is save or not.
    not connected> exit                    // exit redis client.
    $



