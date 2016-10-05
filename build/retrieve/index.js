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

  return githubRequest('search/repositories', {
    data: {
      q: repo + ' in:name pushed:>=2016-01-01'
    }
  }).get('items').then(function (repos) {
    return (0, _lodash.filter)(repos, function (r) {
      return r.owner.login === 'cbdr';
    });
  })
  //.map(loadRepoIssues)
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

  return githubRequest(pulls_url).map(loadPRComments).map(loadPRIssues).map(function (p) {
    return {
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

function loadPRIssues(pr) {
  var issue_url = pr.issue_url;

  return githubRequest(issue_url).then(function (issues) {
    return (0, _lodash.map)(issues.labels, justTheName);
  }).then(function (labels) {
    return (0, _lodash.assign)({}, pr, { labels: labels });
  });

  function justTheName(issue) {
    return issue.name;
  }
}

function loadRepoIssues(repo) {
  var issues_url = repo.issues_url;

  return githubRequest(issues_url).then(function (issues) {
    return (0, _lodash.assign)({}, repo, { labels: issues.labels });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXRyaWV2ZS9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztrQkFLd0IsZTs7QUFMeEI7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFDQSxJQUFNLGlCQUFpQix3QkFBdkI7O0FBRWUsU0FBUyxlQUFULE9BQW1DO0FBQUEsTUFBUixJQUFRLFFBQVIsSUFBUTs7QUFDaEQsU0FBTyxjQUFjLHFCQUFkLEVBQXFDO0FBQzFDLFVBQU07QUFDSixTQUFNLElBQU47QUFESTtBQURvQyxHQUFyQyxFQUtOLEdBTE0sQ0FLRixPQUxFLEVBTU4sSUFOTSxDQU1EO0FBQUEsV0FBUyxvQkFBTyxLQUFQLEVBQWMsVUFBQyxDQUFEO0FBQUEsYUFBTyxFQUFFLEtBQUYsQ0FBUSxLQUFSLEtBQWtCLE1BQXpCO0FBQUEsS0FBZCxDQUFUO0FBQUEsR0FOQzs7QUFBQSxHQVFOLEdBUk0sQ0FRRixnQkFSRSxFQVNOLEdBVE0sQ0FTRixhQUFLO0FBQ1IsV0FBTztBQUNMLFlBQU0sRUFBRSxJQURIO0FBRUwsYUFBTyxFQUFFLEtBQUYsQ0FBUSxLQUZWO0FBR0wsY0FBUSxFQUFFLE1BSEw7QUFJTCxvQkFBYyxFQUFFO0FBSlgsS0FBUDtBQU1ELEdBaEJNLENBQVA7QUFpQkQ7O0FBRUQsU0FBUyxnQkFBVCxDQUEwQixJQUExQixFQUFnQztBQUFBLE1BQ3hCLFNBRHdCLEdBQ1YsSUFEVSxDQUN4QixTQUR3Qjs7QUFFOUIsU0FBTyxjQUFjLFNBQWQsRUFDSixHQURJLENBQ0EsY0FEQSxFQUVKLEdBRkksQ0FFQSxZQUZBLEVBR0osR0FISSxDQUdBO0FBQUEsV0FBTTtBQUNULFVBQUksRUFBRSxFQURHO0FBRVQsYUFBTyxFQUFFLElBRkE7QUFHVCxjQUFRLEVBQUUsTUFIRDtBQUlULGFBQU8sRUFBRSxLQUpBO0FBS1QsV0FBSyxFQUFFLFFBTEU7QUFNVCxpQkFBVyxFQUFFLFNBTko7QUFPVCxlQUFTLEVBQUUsVUFQRjtBQVFULGVBQVMsRUFBRSxVQVJGO0FBU1QsZ0JBQVUsRUFBRSxRQVRIO0FBVVQsY0FBUSxFQUFFO0FBVkQsS0FBTjtBQUFBLEdBSEEsRUFlSixJQWZJLENBZUM7QUFBQSxXQUFTLG9CQUFPLEVBQVAsRUFBVyxJQUFYLHNCQUFvQixjQUFwQixFQUFxQyxLQUFyQyxFQUFUO0FBQUEsR0FmRCxFQWdCSixLQWhCSSxDQWdCRSxlQUFPO0FBQ1osWUFBUSxLQUFSLENBQWMsR0FBZDtBQUNBLFVBQU0sR0FBTjtBQUNELEdBbkJJLENBQVA7QUFvQkQ7O0FBRUQsU0FBUyxjQUFULENBQXdCLEVBQXhCLEVBQTRCO0FBQUEsTUFDcEIsWUFEb0IsR0FDSCxFQURHLENBQ3BCLFlBRG9COztBQUUxQixTQUFPLGNBQWMsWUFBZCxFQUNKLElBREksQ0FDQztBQUFBLFdBQVksb0JBQU8sRUFBUCxFQUFXLEVBQVgsRUFBZSxFQUFFLGtCQUFGLEVBQWYsQ0FBWjtBQUFBLEdBREQsQ0FBUDtBQUVEOztBQUVELFNBQVMsWUFBVCxDQUFzQixFQUF0QixFQUEwQjtBQUFBLE1BQ2xCLFNBRGtCLEdBQ0osRUFESSxDQUNsQixTQURrQjs7QUFFeEIsU0FBTyxjQUFjLFNBQWQsRUFDSixJQURJLENBQ0M7QUFBQSxXQUFVLGlCQUFJLE9BQU8sTUFBWCxFQUFtQixXQUFuQixDQUFWO0FBQUEsR0FERCxFQUVKLElBRkksQ0FFQztBQUFBLFdBQVUsb0JBQU8sRUFBUCxFQUFXLEVBQVgsRUFBZSxFQUFFLGNBQUYsRUFBZixDQUFWO0FBQUEsR0FGRCxDQUFQOztBQUlFLFdBQVMsV0FBVCxDQUFxQixLQUFyQixFQUE0QjtBQUMxQixXQUFPLE1BQU0sSUFBYjtBQUNEO0FBQ0o7O0FBRUQsU0FBUyxjQUFULENBQXdCLElBQXhCLEVBQThCO0FBQUEsTUFDdEIsVUFEc0IsR0FDUCxJQURPLENBQ3RCLFVBRHNCOztBQUU1QixTQUFPLGNBQWMsVUFBZCxFQUNKLElBREksQ0FDQztBQUFBLFdBQVUsb0JBQU8sRUFBUCxFQUFXLElBQVgsRUFBaUIsRUFBRSxRQUFRLE9BQU8sTUFBakIsRUFBakIsQ0FBVjtBQUFBLEdBREQsRUFFSixLQUZJLENBRUUsZUFBTztBQUNaLFlBQVEsS0FBUixDQUFjLEdBQWQ7QUFDQSxVQUFNLEdBQU47QUFDRCxHQUxJLENBQVA7QUFNRDs7QUFFRCxTQUFTLGlCQUFULENBQTJCLEdBQTNCLEVBQWdDLFdBQWhDLEVBQTZDO0FBQzNDLFNBQU8sSUFBSSxPQUFKLENBQVksSUFBSSxNQUFKLFFBQWdCLFdBQWhCLE9BQVosRUFBNkMsRUFBN0MsQ0FBUDtBQUNEOztBQUVELFNBQVMsYUFBVCxDQUF1QixRQUF2QixFQUF1RTtBQUFBOztBQUFBLG9FQUFKLEVBQUk7O0FBQUEseUJBQXBDLElBQW9DO0FBQUEsTUFBcEMsSUFBb0MsOEJBQTdCLEVBQTZCO0FBQUEsOEJBQXpCLFNBQXlCO0FBQUEsTUFBekIsU0FBeUIsbUNBQWIsSUFBYTs7QUFDckUsU0FBTyxtQkFBUSxPQUFSLENBQWdCO0FBQ3JCLFNBQUssZ0JBQWdCLFFBQWhCLElBQTRCO0FBRFosK0JBRXBCLFNBRm9CLEVBRVIsSUFGUSx3Q0FHWjtBQUNQLGdDQUEwQixRQUFRLEdBQVIsQ0FBWSxvQkFEL0I7QUFFUCxrQkFBYyxnQkFGUDtBQUdQLGNBQVU7QUFISCxHQUhZLHFDQVFmLElBUmUsYUFBaEIsQ0FBUDtBQVVEOztBQUVELFNBQVMsZUFBVCxDQUF5QixLQUF6QixFQUFnQztBQUM5QixVQUFRLGtCQUFrQixLQUFsQixFQUF5QixRQUF6QixDQUFSO0FBQ0EsU0FBTyxzQkFBUyxLQUFULEVBQWdCLGNBQWhCLElBQ0wsS0FESyxHQUNNLGNBRE4sU0FDd0IsS0FEL0I7QUFFRCIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCByZXF1ZXN0IGZyb20gJ3JlcXVlc3QtcHJvbWlzZSc7XG5pbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgeyBhc3NpZ24sIGZpbHRlciwgaW5jbHVkZXMsIG1hcCB9IGZyb20gJ2xvZGFzaCc7XG5jb25zdCBHSVRIVUJfQVBJX1VSTCA9ICdodHRwczovL2FwaS5naXRodWIuY29tJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0UmVwb3NpdG9yaWVzKHsgcmVwbyB9KSB7XG4gIHJldHVybiBnaXRodWJSZXF1ZXN0KCdzZWFyY2gvcmVwb3NpdG9yaWVzJywge1xuICAgIGRhdGE6IHtcbiAgICAgIHE6IGAke3JlcG99IGluOm5hbWUgcHVzaGVkOj49MjAxNi0wMS0wMWBcbiAgICB9XG4gIH0pXG4gIC5nZXQoJ2l0ZW1zJylcbiAgLnRoZW4ocmVwb3MgPT4gZmlsdGVyKHJlcG9zLCAocikgPT4gci5vd25lci5sb2dpbiA9PT0gJ2NiZHInKSlcbiAgLy8ubWFwKGxvYWRSZXBvSXNzdWVzKVxuICAubWFwKGxvYWRQdWxsUmVxdWVzdHMpXG4gIC5tYXAociA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IHIubmFtZSxcbiAgICAgIG93bmVyOiByLm93bmVyLmxvZ2luLFxuICAgICAgaXNzdWVzOiByLmlzc3VlcyxcbiAgICAgIHB1bGxSZXF1ZXN0czogci5wdWxsUmVxdWVzdHNcbiAgICB9O1xuICB9KTtcbn07XG5cbmZ1bmN0aW9uIGxvYWRQdWxsUmVxdWVzdHMocmVwbykge1xuICBsZXQgeyBwdWxsc191cmwgfSA9IHJlcG87XG4gIHJldHVybiBnaXRodWJSZXF1ZXN0KHB1bGxzX3VybClcbiAgICAubWFwKGxvYWRQUkNvbW1lbnRzKVxuICAgIC5tYXAobG9hZFBSSXNzdWVzKVxuICAgIC5tYXAocCA9PiAoe1xuICAgICAgaWQ6IHAuaWQsXG4gICAgICBvd25lcjogcC51c2VyLFxuICAgICAgbnVtYmVyOiBwLm51bWJlcixcbiAgICAgIHRpdGxlOiBwLnRpdGxlLFxuICAgICAgdXJsOiBwLmh0bWxfdXJsLFxuICAgICAgYXNzaWduZWVzOiBwLmFzc2lnbmVlcyxcbiAgICAgIGNyZWF0ZWQ6IHAuY3JlYXRlZF9hdCxcbiAgICAgIHVwZGF0ZWQ6IHAudXBkYXRlZF9hdCxcbiAgICAgIGNvbW1lbnRzOiBwLmNvbW1lbnRzLFxuICAgICAgbGFiZWxzOiBwLmxhYmVsc1xuICAgIH0pKVxuICAgIC50aGVuKHB1bGxzID0+IGFzc2lnbih7fSwgcmVwbywgeyBbJ3B1bGxSZXF1ZXN0cyddOiBwdWxscyB9KSlcbiAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKVxuICAgICAgdGhyb3cgZXJyO1xuICAgIH0pXG59XG5cbmZ1bmN0aW9uIGxvYWRQUkNvbW1lbnRzKHByKSB7XG4gIGxldCB7IGNvbW1lbnRzX3VybCB9ID0gcHI7XG4gIHJldHVybiBnaXRodWJSZXF1ZXN0KGNvbW1lbnRzX3VybClcbiAgICAudGhlbihjb21tZW50cyA9PiBhc3NpZ24oe30sIHByLCB7IGNvbW1lbnRzIH0pKVxufVxuXG5mdW5jdGlvbiBsb2FkUFJJc3N1ZXMocHIpIHtcbiAgbGV0IHsgaXNzdWVfdXJsIH0gPSBwcjtcbiAgcmV0dXJuIGdpdGh1YlJlcXVlc3QoaXNzdWVfdXJsKVxuICAgIC50aGVuKGlzc3VlcyA9PiBtYXAoaXNzdWVzLmxhYmVscywganVzdFRoZU5hbWUpKVxuICAgIC50aGVuKGxhYmVscyA9PiBhc3NpZ24oe30sIHByLCB7IGxhYmVscyB9KSlcblxuICAgIGZ1bmN0aW9uIGp1c3RUaGVOYW1lKGlzc3VlKSB7XG4gICAgICByZXR1cm4gaXNzdWUubmFtZTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGxvYWRSZXBvSXNzdWVzKHJlcG8pIHtcbiAgbGV0IHsgaXNzdWVzX3VybCB9ID0gcmVwbztcbiAgcmV0dXJuIGdpdGh1YlJlcXVlc3QoaXNzdWVzX3VybClcbiAgICAudGhlbihpc3N1ZXMgPT4gYXNzaWduKHt9LCByZXBvLCB7IGxhYmVsczogaXNzdWVzLmxhYmVscyB9KSlcbiAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKVxuICAgICAgdGhyb3cgZXJyO1xuICAgIH0pXG59XG5cbmZ1bmN0aW9uIHJlbW92ZVBsYWNlaG9sZGVyKHVybCwgcGxhY2Vob2xkZXIpIHtcbiAgcmV0dXJuIHVybC5yZXBsYWNlKG5ldyBSZWdFeHAoYHsvJHtwbGFjZWhvbGRlcn19YCksICcnKTtcbn1cblxuZnVuY3Rpb24gZ2l0aHViUmVxdWVzdChlbmRwb2ludCwgeyBkYXRhID0ge30sIGRhdGFGaWVsZCA9ICdxcycgfSA9IHt9KSB7XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVxdWVzdCh7XG4gICAgdXJsOiBwcmVwRW5kcG9pbnRVcmwoZW5kcG9pbnQpICsgJz9wZXJfcGFnZT0xMDAnLFxuICAgIFtkYXRhRmllbGRdOiBkYXRhLFxuICAgIGhlYWRlcnM6IHtcbiAgICAgICdBdXRob3JpemF0aW9uJzogYHRva2VuICR7cHJvY2Vzcy5lbnYuR0hfTk9USUZZX0FVVEhfVE9LRU59YCxcbiAgICAgICdVc2VyLUFnZW50JzogJ2NiYXgvZ2gtbm90aWZ5JyxcbiAgICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vdm5kLmdpdGh1Yi5jZXJiZXJ1cy1wcmV2aWV3K2pzb24nXG4gICAgfSxcbiAgICBqc29uOiB0cnVlXG4gIH0pKVxufVxuXG5mdW5jdGlvbiBwcmVwRW5kcG9pbnRVcmwodXJsSW4pIHtcbiAgdXJsSW4gPSByZW1vdmVQbGFjZWhvbGRlcih1cmxJbiwgJ251bWJlcicpO1xuICByZXR1cm4gaW5jbHVkZXModXJsSW4sIEdJVEhVQl9BUElfVVJMKSA/XG4gICAgdXJsSW4gOiBgJHtHSVRIVUJfQVBJX1VSTH0vJHt1cmxJbn1gO1xufSJdfQ==