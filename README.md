# gh-notify
function to pull PR assignees from github API

## **LAMBDA QUICKIE**
1. [role created in IAM](https://console.aws.amazon.com/iam/home?region=us-east-1#roles/cbax_lambda_basic_execution)
2. [function created and configured in lambda](https://console.aws.amazon.com/lambda/home?region=us-east-1#/functions/cbaxGHNotifier?tab=code)
3. **`src`** - main application code
4. **`lambda/index.js`** - lambda function code
  * **_NOTICE_** this function is executed with a path that is adjacent to the main application `build` directory
4. build main application - `npm run build`
5. build lambda package - `./lambda/scripts/build.sh`
  * will create `gh_notify.zip` in project root
6. upload `gh_notify.zip` to function listed in #2
7. save, test, check logs

**_`LOST HIPCHAT NOTIFICATION SOMEWHERE (HASTY CLEANUP)`_**

## TODO

* ___deployment (docker?)___
  * put api in aws
  * manage lambda function
    * needs to be in SC and some sort of deployment mechanism
* ___lambda function___
  * get data from API
  * notify team which PR they are currently assigned to
* ___FUTURE FEATURES___
  * UI to view current state of PR's
  * auto assign engineers to a PR
