#!/bin/bash

ng build --prod --output-path www --base-href http://192.168.90.1:8082/homeoverview/
scp -r www/* root@192.168.90.1:/opt/iobroker/node_modules/iobroker.homeoverview/www/
ssh -l root -t 192.168.90.1 'cd /opt/iobroker; iobroker upload homeoverview'