#!/usr/bin/env bash

cd ./web
npm run build
cd ../server
rsync -avz --exclude node_modules -L . deploy@edu-net.schule:juicy_soup/server
ssh deploy@edu-net.schule "cd juicy_soup/server; npm i"

cd ..

# Database
username=$(awk '{print $1}' ./mongocreds)
password=$(awk '{print $2}' ./mongocreds)
mongodump --archive --db juicy_soup | mongorestore --archive --drop --db juicy_soup --host=edu-net.schule --username $username --password $password --authenticationDatabase admin
