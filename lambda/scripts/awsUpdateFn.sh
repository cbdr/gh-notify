#!/bin/sh -e

# Build and upload the latest version of your code to AWS
[[ -z "$1" ]] && echo "Lambda name must be provided. Example ./awsUpdateFn.sh myLambda fnCode.zip" && exit 1;
[[ -z "$2" ]] && echo "Lambda code file must be provided. Example ./awsUpdateFn.sh myLambda fnCode.zip" && exit 1;

./build.sh

aws lambda update-function-code \
  --function-name "$1" \
  --zip-file fileb://$(pwd)/dist/gh_notify.zip