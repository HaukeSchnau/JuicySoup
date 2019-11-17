#!/usr/bin/env bash

cd ./web
npm run build
cd ../server
rsync -avz --exclude node_modules -L . deploy@edu-net.schule:juicy_soup/server
ssh deploy@edu-net.schule "cd juicy_soup/server; npm i"
