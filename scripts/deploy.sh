#!/bin/bash

# ng build --prod --output-path www --base-href /homeoverview/ --deploy-url /homeoverview/
# scp -r www/* root@192.168.90.1:/opt/iobroker/node_modules/iobroker.homeoverview/www/
# ssh -l root -t 192.168.90.1 'cd /opt/iobroker; iobroker upload homeoverview'

ng build --configuration=staging --prod --output-path www --base-href /homeoverview/ --deploy-url /homeoverview/

scp -r www/* root@192.168.90.100:/var/www/html/homeoverview/