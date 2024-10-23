#!/usr/bin/env bash

DIR=$(realpath $0) && DIR=${DIR%/*}
cd $DIR
set -ex

rm -rf lib
de() {
  mise exec -- $@
}
de build
de ./pkg.ver.coffee
gci
cp README.md lib
cd lib
pnpm publish --access=public --publish-branch $(git symbolic-ref --short -q HEAD)
