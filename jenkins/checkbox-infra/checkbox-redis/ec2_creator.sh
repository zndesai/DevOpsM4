#!/bin/sh

if [ -s inventory ]
then
	echo 'directly running the playbook'     
	ansible-playbook -i inventory main.yml
	
else
	echo 'create nodes'
        node createAWS.js
	echo 'start sleeping'
	sleep 30s
	echo 'end sleeping'
	ansible-playbook -i inventory main.yml
fi
