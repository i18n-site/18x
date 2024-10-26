#!/usr/bin/env bash

DIR=$(realpath ${0%/*})
cd $DIR
set -ex

bun i
rm -rf lib
bun x cep -o lib -c src
rsync -av --include='*/' \
  --include='*.styl' \
  --exclude=* src/ lib/

./build.js
rm -rf lib
