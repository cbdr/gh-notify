import request from 'request-promise';
import Promise from 'bluebird';
import { assign, filter, includes } from 'lodash';
const GITHUB_API_URL = 'https://api.github.com';

export default function getRepositories({ repo }) {
  debugger
  return githubRequest('search/repositories', {
    data: {
      q: `${repo} in:name pushed:>=2016-01-01`
    }
  })
  .get('items')
  .then(repos => filter(repos, (r) => r.owner.login === 'cbdr'))
  // .map(loadRepoIssues)
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
    .map(p => ({
      id: p.id,
      owner: p.user,
      number: p.number,
      title: p.title,
      url: p.html_url,
      assignees: p.assignees,
      created: p.created_at,
      updated: p.updated_at,
      comments: p.comments
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

function loadRepoIssues(repo) {
  let { issues_url } = repo;
  return githubRequest(issues_url)
    .map(i => ({ id: i.id, number: i.number, title: i.title, url: i.url, assignees: i.assignees }))
    .then(issues => assign({}, repo, { issues }))
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