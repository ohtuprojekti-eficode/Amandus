#!/bin/bash

[ ! -d "jsonrpc-ws-proxy/dist" ] && cd jsonrpc-ws-proxy && npm install && npm run prepare && cd ..
[ ! -d "monaco-languageclient/node_modules" ] && cd monaco-languageclient && yarn && cd example && yarn && yarn run build && cd ../..
[ ! -d "rf-server/out" ] && cd rf-server && npm install && npm run build && cd .. 

node ./jsonrpc-ws-proxy/dist/server.js --port 3000 --languageServers jsonrpc-ws-proxy/config.yml &
cd ./monaco-languageclient/example && yarn run start