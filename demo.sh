#!/usr/bin/env bash

DIR=$(realpath $0) && DIR=${DIR%/*}
cd $DIR
set -ex

build
_18X=$HOME/demo/i18n/18x
rm -rf $_18X
mkdir -p $_18X
cp -r lib $_18X/
cp -r lib.package.json $_18X/
