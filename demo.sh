#!/usr/bin/env bash

DIR=$(realpath $0) && DIR=${DIR%/*}
cd $DIR
set -ex

_18X=$HOME/demo/i18n/18x
rm -rf $_18X
git worktree add $_18X -f

cd $_18X
bun i
mise exec -- build
