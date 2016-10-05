import request from 'request-promise';
import Promise from 'bluebird';
import { assign, filter, includes, map } from 'lodash';
const GITHUB_API_URL = 'https://api.github.com';

export default function getRepositories({ repo }) {
  return githubRequest('search/repositories', {
    data: {
      q: `${repo} in:name pushed:>=2016-01-01`
    }
  })
  .get('items')
  .then(repos => filter(repos, (r) => r.owner.login === 'cbdr'))
  //.map(loadRepoIssues)
  .map(loadPullRequests)
  .map(r => {
    return {
      name: r.name,
      owner: r.owner.login,
      issues: r.issues,
      pullRequests: r.pullRequests
    };
  });
};

function loadPullRequests(repo) {
  let { pulls_url } = repo;
  return githubRequest(pulls_url)
    .map(loadPRComments)
    .map(loadPRIssues)
    .map(p => ({
      id: p.id,
      owner: p.user,
      number: p.number,
      title: p.title,
      url: p.html_url,
      assignees: p.assignees,
      created: p.created_at,
      updated: p.updated_at,
      comments: p.comments,
      labels: p.labels
    }))
    .then(pulls => assign({}, repo, { ['pullRequests']: pulls }))
    .catch(err => {
      console.error(err)
      throw err;
    })
}

function loadPRComments(pr) {
  let { comments_url } = pr;
  return githubRequest(comments_url)
    .then(comments => assign({}, pr, { comments }))
}

function loadPRIssues(pr) {
  let { issue_url } = pr;
  return githubRequest(issue_url)
    .then(issues => map(issues.labels, justTheName))
    .then(labels => assign({}, pr, { labels }))

    function justTheName(issue) {
      return issue.name;
    }
}

function loadRepoIssues(repo) {
  let { issues_url } = repo;
  return githubRequest(issues_url)
    .then(issues => assign({}, repo, { labels: issues.labels }))
    .catch(err => {
      console.error(err)
      throw err;
    })
}

function removePlaceholder(url, placeholder) {
  return url.replace(new RegExp(`{/${placeholder}}`), '');
}

function githubRequest(endpoint, { data = {}, dataField = 'qs' } = {}) {
  return Promise.resolve(request({
    url: prepEndpointUrl(endpoint) + '?per_page=100',
    [dataField]: data,
    headers: {
      'Authorization': `token ${process.env.GH_NOTIFY_AUTH_TOKEN}`,
      'User-Agent': 'cbax/gh-notify',
      'Accept': 'application/vnd.github.cerberus-preview+json'
    },
    json: true
  }))
}

function prepEndpointUrl(urlIn) {
  urlIn = removePlaceholder(urlIn, 'number');
  return includes(urlIn, GITHUB_API_URL) ?
    urlIn : `${GITHUB_API_URL}/${urlIn}`;
}