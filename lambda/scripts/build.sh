#!/bin/sh -e

# application structure:
# - root/
#   - src/
#   - build/ (built application files)
#   - lambda/
#     - dist/ (complete lambda function - app, dependencies, lambda boilerplate)
#       - gh_notify.zip (final archive built for aws)


# yeah... for now build script should be run from the root of project
APP_PATH=$PWD
LAMBDA_PATH=${APP_PATH}/lambda

LAMBDA_HANDLER=${LAMBDA_PATH}/index.js

DIST_DIR=${LAMBDA_PATH}/dist
DIST_FILE_NAME=gh_notify.zip
DIST_FILE=${APP_PATH}/${DIST_FILE_NAME}

echo "LET'S GET STARTED!"
echo 'PRECLEAN'
rm $DIST_FILE
rm -rf $DIST_DIR
mkdir -p $DIST_DIR

echo 'BUILDING'
npm config set loglevel error
npm install --no-progress
npm run build -- -q

echo 'PREPARE DIST'
cp -R ./node_modules $DIST_DIR/node_modules
cp -R ./build $DIST_DIR/build
cp $LAMBDA_HANDLER $DIST_DIR/

echo 'ZIPPING IT UP'
cd $DIST_DIR
zip -r -q ${DIST_FILE} ./index.js ./**/**

echo "POSTCLEANUP"
# rm -rf ${DIST_DIR}/*
# find $DIST_DIR -not -name $DIST_FILE_NAME -print0 | xargs -0 rm -rf --

echo "DISTRIBUTION AT ${DIST_FILE}"

# # add main handler
# zip -j -q dist/gh_notify.zip lambda/main.js
# # add dependencies
# zip -r -q dist/gh_notify.zip node_modules/**/* ./build \
#   -x ./*\.sh ./.git/**\* ./dist ./spec ./lambda/** ./.idea


