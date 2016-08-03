'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getRepositories;

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var GITHUB_API_URL = 'https://api.github.com';

function getRepositories(_ref) {
  var repo = _ref.repo;

  debugger;
  return githubRequest('search/repositories', {
    data: {
      q: repo + ' in:name pushed:>=2016-01-01'
    }
  }).get('items').then(function (repos) {
    return (0, _lodash.filter)(repos, function (r) {
      return r.owner.login === 'cbdr';
    });
  })
  // .map(loadRepoIssues)
  .map(loadPullRequests).map(function (r) {
    return {
      name: r.name,
      owner: r.owner.login,
      issues: r.issues,
      pullRequests: r.pullRequests
    };
  });
};

function loadPullRequests(repo) {
  var pulls_url = repo.pulls_url;

  return githubRequest(pulls_url).map(loadPRComments).map(function (p) {
    return {
      id: p.id,
      owner: p.user,
      number: p.number,
      title: p.title,
      url: p.html_url,
      assignees: p.assignees,
      created: p.created_at,
      updated: p.updated_at,
      comments: p.comments
    };
  }).then(function (pulls) {
    return (0, _lodash.assign)({}, repo, _defineProperty({}, 'pullRequests', pulls));
  }).catch(function (err) {
    console.error(err);
    throw err;
  });
}

function loadPRComments(pr) {
  var comments_url = pr.comments_url;

  return githubRequest(comments_url).then(function (comments) {
    return (0, _lodash.assign)({}, pr, { comments: comments });
  });
}

function loadRepoIssues(repo) {
  var issues_url = repo.issues_url;

  return githubRequest(issues_url).map(function (i) {
    return { id: i.id, number: i.number, title: i.title, url: i.url, assignees: i.assignees };
  }).then(function (issues) {
    return (0, _lodash.assign)({}, repo, { issues: issues });
  }).catch(function (err) {
    console.error(err);
    throw err;
  });
}

function removePlaceholder(url, placeholder) {
  return url.replace(new RegExp('{/' + placeholder + '}'), '');
}

function githubRequest(endpoint) {
  var _request;

  var _ref2 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var _ref2$data = _ref2.data;
  var data = _ref2$data === undefined ? {} : _ref2$data;
  var _ref2$dataField = _ref2.dataField;
  var dataField = _ref2$dataField === undefined ? 'qs' : _ref2$dataField;

  return _bluebird2.default.resolve((0, _requestPromise2.default)((_request = {
    url: prepEndpointUrl(endpoint) + '?per_page=100'
  }, _defineProperty(_request, dataField, data), _defineProperty(_request, 'headers', {
    'Authorization': 'token ' + process.env.GH_NOTIFY_AUTH_TOKEN,
    'User-Agent': 'cbax/gh-notify',
    'Accept': 'application/vnd.github.cerberus-preview+json'
  }), _defineProperty(_request, 'json', true), _request)));
}

function prepEndpointUrl(urlIn) {
  urlIn = removePlaceholder(urlIn, 'number');
  return (0, _lodash.includes)(urlIn, GITHUB_API_URL) ? urlIn : GITHUB_API_URL + '/' + urlIn;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXRyaWV2ZS9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztrQkFLd0IsZTs7QUFMeEI7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFDQSxJQUFNLGlCQUFpQix3QkFBdkI7O0FBRWUsU0FBUyxlQUFULE9BQW1DO0FBQUEsTUFBUixJQUFRLFFBQVIsSUFBUTs7QUFDaEQ7QUFDQSxTQUFPLGNBQWMscUJBQWQsRUFBcUM7QUFDMUMsVUFBTTtBQUNKLFNBQU0sSUFBTjtBQURJO0FBRG9DLEdBQXJDLEVBS04sR0FMTSxDQUtGLE9BTEUsRUFNTixJQU5NLENBTUQ7QUFBQSxXQUFTLG9CQUFPLEtBQVAsRUFBYyxVQUFDLENBQUQ7QUFBQSxhQUFPLEVBQUUsS0FBRixDQUFRLEtBQVIsS0FBa0IsTUFBekI7QUFBQSxLQUFkLENBQVQ7QUFBQSxHQU5DOztBQUFBLEdBUU4sR0FSTSxDQVFGLGdCQVJFLEVBU04sR0FUTSxDQVNGLGFBQUs7QUFDUixXQUFPO0FBQ0wsWUFBTSxFQUFFLElBREg7QUFFTCxhQUFPLEVBQUUsS0FBRixDQUFRLEtBRlY7QUFHTCxjQUFRLEVBQUUsTUFITDtBQUlMLG9CQUFjLEVBQUU7QUFKWCxLQUFQO0FBTUQsR0FoQk0sQ0FBUDtBQWlCRDs7QUFFRCxTQUFTLGdCQUFULENBQTBCLElBQTFCLEVBQWdDO0FBQUEsTUFDeEIsU0FEd0IsR0FDVixJQURVLENBQ3hCLFNBRHdCOztBQUU5QixTQUFPLGNBQWMsU0FBZCxFQUNKLEdBREksQ0FDQSxjQURBLEVBRUosR0FGSSxDQUVBO0FBQUEsV0FBTTtBQUNULFVBQUksRUFBRSxFQURHO0FBRVQsYUFBTyxFQUFFLElBRkE7QUFHVCxjQUFRLEVBQUUsTUFIRDtBQUlULGFBQU8sRUFBRSxLQUpBO0FBS1QsV0FBSyxFQUFFLFFBTEU7QUFNVCxpQkFBVyxFQUFFLFNBTko7QUFPVCxlQUFTLEVBQUUsVUFQRjtBQVFULGVBQVMsRUFBRSxVQVJGO0FBU1QsZ0JBQVUsRUFBRTtBQVRILEtBQU47QUFBQSxHQUZBLEVBYUosSUFiSSxDQWFDO0FBQUEsV0FBUyxvQkFBTyxFQUFQLEVBQVcsSUFBWCxzQkFBb0IsY0FBcEIsRUFBcUMsS0FBckMsRUFBVDtBQUFBLEdBYkQsRUFjSixLQWRJLENBY0UsZUFBTztBQUNaLFlBQVEsS0FBUixDQUFjLEdBQWQ7QUFDQSxVQUFNLEdBQU47QUFDRCxHQWpCSSxDQUFQO0FBa0JEOztBQUVELFNBQVMsY0FBVCxDQUF3QixFQUF4QixFQUE0QjtBQUFBLE1BQ3BCLFlBRG9CLEdBQ0gsRUFERyxDQUNwQixZQURvQjs7QUFFMUIsU0FBTyxjQUFjLFlBQWQsRUFDSixJQURJLENBQ0M7QUFBQSxXQUFZLG9CQUFPLEVBQVAsRUFBVyxFQUFYLEVBQWUsRUFBRSxrQkFBRixFQUFmLENBQVo7QUFBQSxHQURELENBQVA7QUFFRDs7QUFFRCxTQUFTLGNBQVQsQ0FBd0IsSUFBeEIsRUFBOEI7QUFBQSxNQUN0QixVQURzQixHQUNQLElBRE8sQ0FDdEIsVUFEc0I7O0FBRTVCLFNBQU8sY0FBYyxVQUFkLEVBQ0osR0FESSxDQUNBO0FBQUEsV0FBTSxFQUFFLElBQUksRUFBRSxFQUFSLEVBQVksUUFBUSxFQUFFLE1BQXRCLEVBQThCLE9BQU8sRUFBRSxLQUF2QyxFQUE4QyxLQUFLLEVBQUUsR0FBckQsRUFBMEQsV0FBVyxFQUFFLFNBQXZFLEVBQU47QUFBQSxHQURBLEVBRUosSUFGSSxDQUVDO0FBQUEsV0FBVSxvQkFBTyxFQUFQLEVBQVcsSUFBWCxFQUFpQixFQUFFLGNBQUYsRUFBakIsQ0FBVjtBQUFBLEdBRkQsRUFHSixLQUhJLENBR0UsZUFBTztBQUNaLFlBQVEsS0FBUixDQUFjLEdBQWQ7QUFDQSxVQUFNLEdBQU47QUFDRCxHQU5JLENBQVA7QUFPRDs7QUFFRCxTQUFTLGlCQUFULENBQTJCLEdBQTNCLEVBQWdDLFdBQWhDLEVBQTZDO0FBQzNDLFNBQU8sSUFBSSxPQUFKLENBQVksSUFBSSxNQUFKLFFBQWdCLFdBQWhCLE9BQVosRUFBNkMsRUFBN0MsQ0FBUDtBQUNEOztBQUVELFNBQVMsYUFBVCxDQUF1QixRQUF2QixFQUF1RTtBQUFBOztBQUFBLG9FQUFKLEVBQUk7O0FBQUEseUJBQXBDLElBQW9DO0FBQUEsTUFBcEMsSUFBb0MsOEJBQTdCLEVBQTZCO0FBQUEsOEJBQXpCLFNBQXlCO0FBQUEsTUFBekIsU0FBeUIsbUNBQWIsSUFBYTs7QUFDckUsU0FBTyxtQkFBUSxPQUFSLENBQWdCO0FBQ3JCLFNBQUssZ0JBQWdCLFFBQWhCLElBQTRCO0FBRFosK0JBRXBCLFNBRm9CLEVBRVIsSUFGUSx3Q0FHWjtBQUNQLGdDQUEwQixRQUFRLEdBQVIsQ0FBWSxvQkFEL0I7QUFFUCxrQkFBYyxnQkFGUDtBQUdQLGNBQVU7QUFISCxHQUhZLHFDQVFmLElBUmUsYUFBaEIsQ0FBUDtBQVVEOztBQUVELFNBQVMsZUFBVCxDQUF5QixLQUF6QixFQUFnQztBQUM5QixVQUFRLGtCQUFrQixLQUFsQixFQUF5QixRQUF6QixDQUFSO0FBQ0EsU0FBTyxzQkFBUyxLQUFULEVBQWdCLGNBQWhCLElBQ0wsS0FESyxHQUNNLGNBRE4sU0FDd0IsS0FEL0I7QUFFRCIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCByZXF1ZXN0IGZyb20gJ3JlcXVlc3QtcHJvbWlzZSc7XG5pbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgeyBhc3NpZ24sIGZpbHRlciwgaW5jbHVkZXMgfSBmcm9tICdsb2Rhc2gnO1xuY29uc3QgR0lUSFVCX0FQSV9VUkwgPSAnaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldFJlcG9zaXRvcmllcyh7IHJlcG8gfSkge1xuICBkZWJ1Z2dlclxuICByZXR1cm4gZ2l0aHViUmVxdWVzdCgnc2VhcmNoL3JlcG9zaXRvcmllcycsIHtcbiAgICBkYXRhOiB7XG4gICAgICBxOiBgJHtyZXBvfSBpbjpuYW1lIHB1c2hlZDo+PTIwMTYtMDEtMDFgXG4gICAgfVxuICB9KVxuICAuZ2V0KCdpdGVtcycpXG4gIC50aGVuKHJlcG9zID0+IGZpbHRlcihyZXBvcywgKHIpID0+IHIub3duZXIubG9naW4gPT09ICdjYmRyJykpXG4gIC8vIC5tYXAobG9hZFJlcG9Jc3N1ZXMpXG4gIC5tYXAobG9hZFB1bGxSZXF1ZXN0cylcbiAgLm1hcChyID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogci5uYW1lLFxuICAgICAgb3duZXI6IHIub3duZXIubG9naW4sXG4gICAgICBpc3N1ZXM6IHIuaXNzdWVzLFxuICAgICAgcHVsbFJlcXVlc3RzOiByLnB1bGxSZXF1ZXN0c1xuICAgIH07XG4gIH0pO1xufTtcblxuZnVuY3Rpb24gbG9hZFB1bGxSZXF1ZXN0cyhyZXBvKSB7XG4gIGxldCB7IHB1bGxzX3VybCB9ID0gcmVwbztcbiAgcmV0dXJuIGdpdGh1YlJlcXVlc3QocHVsbHNfdXJsKVxuICAgIC5tYXAobG9hZFBSQ29tbWVudHMpXG4gICAgLm1hcChwID0+ICh7XG4gICAgICBpZDogcC5pZCxcbiAgICAgIG93bmVyOiBwLnVzZXIsXG4gICAgICBudW1iZXI6IHAubnVtYmVyLFxuICAgICAgdGl0bGU6IHAudGl0bGUsXG4gICAgICB1cmw6IHAuaHRtbF91cmwsXG4gICAgICBhc3NpZ25lZXM6IHAuYXNzaWduZWVzLFxuICAgICAgY3JlYXRlZDogcC5jcmVhdGVkX2F0LFxuICAgICAgdXBkYXRlZDogcC51cGRhdGVkX2F0LFxuICAgICAgY29tbWVudHM6IHAuY29tbWVudHNcbiAgICB9KSlcbiAgICAudGhlbihwdWxscyA9PiBhc3NpZ24oe30sIHJlcG8sIHsgWydwdWxsUmVxdWVzdHMnXTogcHVsbHMgfSkpXG4gICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICBjb25zb2xlLmVycm9yKGVycilcbiAgICAgIHRocm93IGVycjtcbiAgICB9KVxufVxuXG5mdW5jdGlvbiBsb2FkUFJDb21tZW50cyhwcikge1xuICBsZXQgeyBjb21tZW50c191cmwgfSA9IHByO1xuICByZXR1cm4gZ2l0aHViUmVxdWVzdChjb21tZW50c191cmwpXG4gICAgLnRoZW4oY29tbWVudHMgPT4gYXNzaWduKHt9LCBwciwgeyBjb21tZW50cyB9KSlcbn1cblxuZnVuY3Rpb24gbG9hZFJlcG9Jc3N1ZXMocmVwbykge1xuICBsZXQgeyBpc3N1ZXNfdXJsIH0gPSByZXBvO1xuICByZXR1cm4gZ2l0aHViUmVxdWVzdChpc3N1ZXNfdXJsKVxuICAgIC5tYXAoaSA9PiAoeyBpZDogaS5pZCwgbnVtYmVyOiBpLm51bWJlciwgdGl0bGU6IGkudGl0bGUsIHVybDogaS51cmwsIGFzc2lnbmVlczogaS5hc3NpZ25lZXMgfSkpXG4gICAgLnRoZW4oaXNzdWVzID0+IGFzc2lnbih7fSwgcmVwbywgeyBpc3N1ZXMgfSkpXG4gICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICBjb25zb2xlLmVycm9yKGVycilcbiAgICAgIHRocm93IGVycjtcbiAgICB9KVxufVxuXG5mdW5jdGlvbiByZW1vdmVQbGFjZWhvbGRlcih1cmwsIHBsYWNlaG9sZGVyKSB7XG4gIHJldHVybiB1cmwucmVwbGFjZShuZXcgUmVnRXhwKGB7LyR7cGxhY2Vob2xkZXJ9fWApLCAnJyk7XG59XG5cbmZ1bmN0aW9uIGdpdGh1YlJlcXVlc3QoZW5kcG9pbnQsIHsgZGF0YSA9IHt9LCBkYXRhRmllbGQgPSAncXMnIH0gPSB7fSkge1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlcXVlc3Qoe1xuICAgIHVybDogcHJlcEVuZHBvaW50VXJsKGVuZHBvaW50KSArICc/cGVyX3BhZ2U9MTAwJyxcbiAgICBbZGF0YUZpZWxkXTogZGF0YSxcbiAgICBoZWFkZXJzOiB7XG4gICAgICAnQXV0aG9yaXphdGlvbic6IGB0b2tlbiAke3Byb2Nlc3MuZW52LkdIX05PVElGWV9BVVRIX1RPS0VOfWAsXG4gICAgICAnVXNlci1BZ2VudCc6ICdjYmF4L2doLW5vdGlmeScsXG4gICAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL3ZuZC5naXRodWIuY2VyYmVydXMtcHJldmlldytqc29uJ1xuICAgIH0sXG4gICAganNvbjogdHJ1ZVxuICB9KSlcbn1cblxuZnVuY3Rpb24gcHJlcEVuZHBvaW50VXJsKHVybEluKSB7XG4gIHVybEluID0gcmVtb3ZlUGxhY2Vob2xkZXIodXJsSW4sICdudW1iZXInKTtcbiAgcmV0dXJuIGluY2x1ZGVzKHVybEluLCBHSVRIVUJfQVBJX1VSTCkgP1xuICAgIHVybEluIDogYCR7R0lUSFVCX0FQSV9VUkx9LyR7dXJsSW59YDtcbn0iXX0=