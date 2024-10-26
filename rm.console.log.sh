#!/usr/bin/env bash

DIR=$(realpath $0) && DIR=${DIR%/*}
cd $DIR
set -ex

rmlog() {
  fd --type file --regex '.*.(js|coffee)' $1 | xargs -I {} sed -i '/console\.log/d' {}
}

rmlog src
rmlog serviceWorker
