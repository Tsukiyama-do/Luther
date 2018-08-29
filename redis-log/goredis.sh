#!/bin/bash

# take backup of previous log file of redis server
if [ -s ./logs/red-console.log ]; then
 mv ./logs/red-console.log ./logs/red-console.log+`date +%Y%m%d%H%m%S`
fi

# Run redis-sever as follows.  Change the path depending on the path of redis-server.
~/redis-4.0.8/src/redis-server  >> ./logs/red-console.log &
