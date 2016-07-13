import Hipchatter from 'hipchatter';
import Promise from 'bluebird';
import { forEach } from 'lodash';

export default function notifyHipchat(pullRequests) {
  let hipchatter = new Hipchatter('X7qQU0XPSjNn86rj6eLcZEX4tQ1rm6hojP7tLFuq');
  let colors = {
    '0': 'green',
    '5': 'yellow',
    '10': 'red'  
  };
  let levels = {
    '0': 'new',
    '5': 'outstanding',
    '10': 'unassigned or stale'
  }
  let groupedPRs = {
    '0': [],
    '5': [],
    '10': []
  }
  let messages = {
    '0': '',
    '5': '',
    '10': ''
  }

  pullRequests = pullRequests || [{
      link: 'https://github.com/cbdr/cbax-apply-platform/pull/271',
      title: 'Add redirect to CB',
      id: 271,
      assignees: ['derrickwilliams','mmoldavan'],
      level: 'normal'
    }]

  forEach(pullRequests, groupPRs);
  forEach(messages, sendNotifcation);

  function groupPRs(pr) {
    groupedPRs[pr.level].push(pr);
    messages[pr.level] += '<b>' +pr.repo +': <a href="'+ pr.link +'">' + pr.title + '</a></b></br><i>Assignees: '+pr.assignees+'</i><br/>'
  }

  function sendNotifcation(message, key) {
    if(groupedPRs[key].length > 0) {
      message = '<b>There are ' + groupedPRs[key].length + ' ' + levels[key] + ' pull requests.</b><br/><br/>' + message
      hipchatter.notify('CBAX Scrum', 
          {
              message: message,
              color: colors[key],
              notify: true,
              token: '7b6FlCfiFjgVaNpgM3YLOBNeJ3FxIgR2Tq1BC1Jp'
          }, function(err){
              if (err == null) console.log('Successfully notified the room.');
      });
    }
  }

return Promise.resolve();

}