import _ from 'lodash';
import Promise from 'bluebird';
import fs from 'fs';
import getRepositories from '../retrieve';

let oneDay = 24 * 60 * 60 * 1000;

export default function processPRs() {
  return getRepositories({ repo: 'cbax-' })
    .then((repos) => _.filter(repos, (r) => r.pullRequests.length > 0 ))
    .then((repos) => _.map(repos, mapPRs))
    .tap(console.log)
    .then((PRs) => _.flatten(PRs))
    .tap(console.log);
}

function mapPRs(repo) {
  return _.map(repo.pullRequests, (PR) => {

    PR.repo = repo.name;
    PR.owner = PR.owner.login;
    PR.link = PR.url;
    PR.timeOpen = (new Date() - new Date(PR.created)) / oneDay;
    PR.workingDays = getWorkingDaysSince(PR.created);
    PR.timeSinceLastModified = (new Date() - new Date(PR.updated)) / oneDay;

    PR.assignees = _.map(PR.assignees, (assignee) => assignee.login);
    PR.level = getLevel(PR);

    PR = prune(PR);

    return PR;
  });
}

function getWorkingDaysSince(date) {
  const start = new Date(date);
  const end = new Date();

  let days = 0;
  let currentDay = start;

  while(currentDay < end) {
    currentDay = new Date(currentDay);
    if(currentDay.getDay() != 0 && currentDay.getDay() != 6) {
      days++;
    }
    currentDay = new Date(currentDay.getTime() + oneDay);
  }

  return days;
}

function getLevel(PR) {
  PR.comments = _.filter(PR.comments, (comment) => {
    if(comment.user.login !== PR.owner) {
      return true;
    }
  });
  let hasLabels = PR.labels.length > 0;
  let noComments = PR.comments.length === 0;
  if((PR.assignees.length === 0 || PR.workingDays >= 4) && !hasLabels) {
    return 10; //red: no assignees or stale
  }
  if((PR.workingDays >= 2 || (PR.workingDays > 1 && noComments)) && !hasLabels) {
    return 5; //yellow going stale (outstanding > 2 days or no comments from assignees yet && older than 16 hours)
  }
  return 0; //green
}

function prune(PR) {
  let fieldsToRemove = [
    'id',
    'number',
    'url',
    'comments',
    'created',
    'updated',
    'timeOpen',
    'timeSinceLastModified'
  ];

  return _.omit(PR, fieldsToRemove);
}