#!/usr/bin/env bash

DIR=$(realpath $0) && DIR=${DIR%/*}
cd $DIR
set -ex

rm -rf lib
de() {
  direnv exec . $@
}
de ./swc.coffee
fd --type file --regex '.*.css' lib | xargs -I {} bash -c "X=\$(bun x minify {}) && echo \$X > {}"
de ./pkg.ver.coffee
gci
cp README.md lib
cd lib
pnpm publish --access=public --publish-branch $(git symbolic-ref --short -q HEAD)
