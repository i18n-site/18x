#!/usr/bin/env bash

DIR=$(realpath $0) && DIR=${DIR%/*}
cd $DIR
set -ex

fd --type file --regex '.*.(js|coffee)' src | xargs -I {} sed -i '/console\.log/d' {}
