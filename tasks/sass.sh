#!/bin/bash

set -e
ARCH="x64"
TARGET=$(node -e "console.log(require('./package.json').devDependencies.electron.match(/\d+\.\d+.\d+/)[0])")
PLATFORM=$(node -e "console.log(process.platform)")
VENDOR="vendor/$PLATFORM-$ARCH-69"

cd node_modules/node-sass/

if [ ! -e "build/Release/binding.node" ]; then
  node-gyp rebuild --target=$TARGET --arch=$ARCH --dist-url=https://atom.io/download/electron
  mkdir -p $VENDOR
fi

# Build for Electron for current version
cp build/Release/binding.node $VENDOR
