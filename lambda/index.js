'use strict';

// THIS FILE IS ACTUALLY RUN FROM A DIFFERENT PATH
// WHEN RUN IT WILL BE ADJACENT TO THE BUILD DIR

const writeFile = require('fs').writeFileSync;
const aws = require('aws-sdk');
const Promise = require('bluebird');
const dotenv = require('dotenv');
const join = require('path').join;
const _ = require('lodash');
const processPRs = require('./build/process').default;
const notifyHipchat = require('./build/notify').default;

exports.handler = function(event, context, cb) {
  const s3 = new aws.S3();
  const prms = (promiseIn) => Promise.resolve(promiseIn);
  const envFile = { Bucket: 'cb1-artifacts', Key: 'ApplyExperience/lambda/gh_notify.env'}

  return loadEnv()
    .then(processPRs)
    .then(notifyHipchat)
    .tap(repos => cb(null, repos))
    .error(cb);

  function loadEnv() {
    return prms(s3.getObject(envFile).promise())
    .then(o => o.Body.toString())
    .then(file => dotenv.parse(file))
    .tap(vars => _.assign(process.env, vars))
  }
};

exports.cocacola = function(event, context, cb) {
  const s3 = new aws.S3();
  const prms = (promiseIn) => Promise.resolve(promiseIn);
  const envFile = { Bucket: 'cb1-artifacts', Key: 'ApplyExperience/lambda/gh_notify.env'}

  return loadEnv()
    .then(processPRs)
    .then(spitOutPRs)
    .tap(repos => cb(null, repos))
    .error(cb);

  function loadEnv() {
    return prms(s3.getObject(envFile).promise())
    .then(o => o.Body.toString())
    .then(file => dotenv.parse(file))
    .tap(vars => _.assign(process.env, vars))
  } 

  function spitOutPRs(pullRequests){
    var repos = [];
    _.forEach(pullRequests, function formatPR(pr){
      repos.push({
        subject: {
          title: pr.title,
          type: 'Pull Request',
          url: pr.link,
          urgency: pr.level,
          assignees: pr.assignees
        },
        repository: {
          full_name: pr.repo,
          owner: {
            name: pr.owner
          }
        }
      });
    })
    return repos;
  }
}
