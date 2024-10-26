#!/usr/bin/env bash

DIR=$(dirname $(realpath "$0"))
cd $DIR
set -ex

zip() {
  bun x svgo --config $DIR/svgo.config.cjs -r -f $1 -o $1
}

cd svg
find . -name "*.svg" -exec sed -i 's/class="icon"//g' {} \;

cd ..

zip svg
