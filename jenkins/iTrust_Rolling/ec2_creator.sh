#!/bin/sh
if [ -s inventory || ! -e inventory ]
then
        sudo node createAWS.js
	echo 'start sleeping'
	sleep 30s
	echo 'end sleeping'
	sudo ansible-playbook -i inventory main.yml
else
        sudo ansible-playbook -i inventory main.yml
fi
