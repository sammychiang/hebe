#!/bin/bash
apt-get update ; apt-get -y install curl
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get install -y nodejs || sudo apt-get install -y -—fix-missing nodejs
apt-get -y install screen
wget https://gist.githubusercontent.com/joaopizani/2718397/raw/9e2560b77e1e1298ef24be16297d853f9885b20d/.screenrc
wget https://raw.githubusercontent.com/sammychiang/hebe/master/hebe.js
wget https://raw.githubusercontent.com/sammychiang/hebe/master/hebe_balance.js
npm install -g cnpm --registry=https://registry.npm.taobao.org
cnpm install request
cnpm install better-console
apt-get -y install htop
screen
