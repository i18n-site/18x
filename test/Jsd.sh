#!/usr/bin/env bash

DIR=$(realpath $0) && DIR=${DIR%/*}
cd $DIR
set -ex

mkdir -p tmp

direnv exec . ../serviceWorker.build.coffee

cat ../lib/Jsd.js Jsd.js >tmp/Jsd.js

bun tmp/Jsd.js
