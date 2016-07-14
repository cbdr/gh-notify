#!/bin/sh -e

# install dependencies, run unit tests, and bundle all the files into a deployable zip file.
if [ ! -f ./config.json ]; then
    echo "Unable to build Lambda.zip! \"config.json\" is required!"
    exit 1
fi


cd ..

npm install

rm -rf ./dist
mkdir -p dist

# npm test

# add main handler
zip -j -q dist/gh_notify.zip lambda/main.js
# add dependencies
zip -r -q dist/gh_notify.zip node_modules/**/* ./service/build \
  -x ./*\.sh ./.git/**\* ./dist ./spec ./lambda/** ./.idea
