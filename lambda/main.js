'use strict';

const writeFile = require('fs').writeFileSync;
const aws = require('aws-sdk');
const Promise = require('bluebird');
const dotenv = require('dotenv');
const join = require('path').join;
const _ = require('lodash');
const ghRetrieve = require('../build/retrieve').default;

exports.handler = function(event, context) {
  const s3 = new S3();
  const prms = (promiseIn) => Promise.resolve(promiseIn);
  const envFile = { Bucket: 'cb1-artifacts', Key: 'ApplyExperience/lambda/gh_notify.env'}


  function loadEnv() {
    return prms(s3.getObject(envFile).promise())
    // .then(parseContent)
    .then(o => o.Body)
    .then(dotenv.parse)
    .tap(env => console.log('ENV', env))
    .error(err => console.error('ERR', err));
  }

  function parseContent(obj) {
    const content = obj.Body.toString();
    writeFile(join(__dirname, '.env'), content);
  }

  // return ghRetrieve({ repo: 'cbax-' })
  //   .then(function(repos) { return context.succeed(repos) })
  //   .catch(function(err) { return context.fail(err) });
};
