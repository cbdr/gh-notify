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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXRyaWV2ZS9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztrQkFLd0IsZTs7QUFMeEI7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFDQSxJQUFNLGlCQUFpQix3QkFBdkI7O0FBRWUsU0FBUyxlQUFULE9BQW1DO0FBQUEsTUFBUixJQUFRLFFBQVIsSUFBUTs7QUFDaEQsU0FBTyxjQUFjLHFCQUFkLEVBQXFDO0FBQzFDLFVBQU07QUFDSixTQUFNLElBQU47QUFESTtBQURvQyxHQUFyQyxFQUtOLEdBTE0sQ0FLRixPQUxFLEVBTU4sSUFOTSxDQU1EO0FBQUEsV0FBUyxvQkFBTyxLQUFQLEVBQWMsVUFBQyxDQUFEO0FBQUEsYUFBTyxFQUFFLEtBQUYsQ0FBUSxLQUFSLEtBQWtCLE1BQXpCO0FBQUEsS0FBZCxDQUFUO0FBQUEsR0FOQztBQU9QO0FBUE8sR0FRTixHQVJNLENBUUYsZ0JBUkUsRUFTTixHQVRNLENBU0YsYUFBSztBQUNSLFdBQU87QUFDTCxZQUFNLEVBQUUsSUFESDtBQUVMLGFBQU8sRUFBRSxLQUFGLENBQVEsS0FGVjtBQUdMLGNBQVEsRUFBRSxNQUhMO0FBSUwsb0JBQWMsRUFBRTtBQUpYLEtBQVA7QUFNRCxHQWhCTSxDQUFQO0FBaUJEOztBQUVELFNBQVMsZ0JBQVQsQ0FBMEIsSUFBMUIsRUFBZ0M7QUFBQSxNQUN4QixTQUR3QixHQUNWLElBRFUsQ0FDeEIsU0FEd0I7O0FBRTlCLFNBQU8sY0FBYyxTQUFkLEVBQ0osR0FESSxDQUNBLGNBREEsRUFFSixHQUZJLENBRUE7QUFBQSxXQUFNO0FBQ1QsVUFBSSxFQUFFLEVBREc7QUFFVCxhQUFPLEVBQUUsSUFGQTtBQUdULGNBQVEsRUFBRSxNQUhEO0FBSVQsYUFBTyxFQUFFLEtBSkE7QUFLVCxXQUFLLEVBQUUsUUFMRTtBQU1ULGlCQUFXLEVBQUUsU0FOSjtBQU9ULGVBQVMsRUFBRSxVQVBGO0FBUVQsZUFBUyxFQUFFLFVBUkY7QUFTVCxnQkFBVSxFQUFFO0FBVEgsS0FBTjtBQUFBLEdBRkEsRUFhSixJQWJJLENBYUM7QUFBQSxXQUFTLG9CQUFPLEVBQVAsRUFBVyxJQUFYLHNCQUFvQixjQUFwQixFQUFxQyxLQUFyQyxFQUFUO0FBQUEsR0FiRCxFQWNKLEtBZEksQ0FjRSxlQUFPO0FBQ1osWUFBUSxLQUFSLENBQWMsR0FBZDtBQUNBLFVBQU0sR0FBTjtBQUNELEdBakJJLENBQVA7QUFrQkQ7O0FBRUQsU0FBUyxjQUFULENBQXdCLEVBQXhCLEVBQTRCO0FBQUEsTUFDcEIsWUFEb0IsR0FDSCxFQURHLENBQ3BCLFlBRG9COztBQUUxQixTQUFPLGNBQWMsWUFBZCxFQUNKLElBREksQ0FDQztBQUFBLFdBQVksb0JBQU8sRUFBUCxFQUFXLEVBQVgsRUFBZSxFQUFFLGtCQUFGLEVBQWYsQ0FBWjtBQUFBLEdBREQsQ0FBUDtBQUVEOztBQUVELFNBQVMsY0FBVCxDQUF3QixJQUF4QixFQUE4QjtBQUFBLE1BQ3RCLFVBRHNCLEdBQ1AsSUFETyxDQUN0QixVQURzQjs7QUFFNUIsU0FBTyxjQUFjLFVBQWQsRUFDSixHQURJLENBQ0E7QUFBQSxXQUFNLEVBQUUsSUFBSSxFQUFFLEVBQVIsRUFBWSxRQUFRLEVBQUUsTUFBdEIsRUFBOEIsT0FBTyxFQUFFLEtBQXZDLEVBQThDLEtBQUssRUFBRSxHQUFyRCxFQUEwRCxXQUFXLEVBQUUsU0FBdkUsRUFBTjtBQUFBLEdBREEsRUFFSixJQUZJLENBRUM7QUFBQSxXQUFVLG9CQUFPLEVBQVAsRUFBVyxJQUFYLEVBQWlCLEVBQUUsY0FBRixFQUFqQixDQUFWO0FBQUEsR0FGRCxFQUdKLEtBSEksQ0FHRSxlQUFPO0FBQ1osWUFBUSxLQUFSLENBQWMsR0FBZDtBQUNBLFVBQU0sR0FBTjtBQUNELEdBTkksQ0FBUDtBQU9EOztBQUVELFNBQVMsaUJBQVQsQ0FBMkIsR0FBM0IsRUFBZ0MsV0FBaEMsRUFBNkM7QUFDM0MsU0FBTyxJQUFJLE9BQUosQ0FBWSxJQUFJLE1BQUosUUFBZ0IsV0FBaEIsT0FBWixFQUE2QyxFQUE3QyxDQUFQO0FBQ0Q7O0FBRUQsU0FBUyxhQUFULENBQXVCLFFBQXZCLEVBQXVFO0FBQUE7O0FBQUEsb0VBQUosRUFBSTs7QUFBQSx5QkFBcEMsSUFBb0M7QUFBQSxNQUFwQyxJQUFvQyw4QkFBN0IsRUFBNkI7QUFBQSw4QkFBekIsU0FBeUI7QUFBQSxNQUF6QixTQUF5QixtQ0FBYixJQUFhOztBQUNyRSxTQUFPLG1CQUFRLE9BQVIsQ0FBZ0I7QUFDckIsU0FBSyxnQkFBZ0IsUUFBaEIsSUFBNEI7QUFEWiwrQkFFcEIsU0FGb0IsRUFFUixJQUZRLHdDQUdaO0FBQ1AsZ0NBQTBCLFFBQVEsR0FBUixDQUFZLG9CQUQvQjtBQUVQLGtCQUFjLGdCQUZQO0FBR1AsY0FBVTtBQUhILEdBSFkscUNBUWYsSUFSZSxhQUFoQixDQUFQO0FBVUQ7O0FBRUQsU0FBUyxlQUFULENBQXlCLEtBQXpCLEVBQWdDO0FBQzlCLFVBQVEsa0JBQWtCLEtBQWxCLEVBQXlCLFFBQXpCLENBQVI7QUFDQSxTQUFPLHNCQUFTLEtBQVQsRUFBZ0IsY0FBaEIsSUFDTCxLQURLLEdBQ00sY0FETixTQUN3QixLQUQvQjtBQUVEIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHJlcXVlc3QgZnJvbSAncmVxdWVzdC1wcm9taXNlJztcbmltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCB7IGFzc2lnbiwgZmlsdGVyLCBpbmNsdWRlcyB9IGZyb20gJ2xvZGFzaCc7XG5jb25zdCBHSVRIVUJfQVBJX1VSTCA9ICdodHRwczovL2FwaS5naXRodWIuY29tJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0UmVwb3NpdG9yaWVzKHsgcmVwbyB9KSB7XG4gIHJldHVybiBnaXRodWJSZXF1ZXN0KCdzZWFyY2gvcmVwb3NpdG9yaWVzJywge1xuICAgIGRhdGE6IHtcbiAgICAgIHE6IGAke3JlcG99IGluOm5hbWUgcHVzaGVkOj49MjAxNi0wMS0wMWBcbiAgICB9XG4gIH0pXG4gIC5nZXQoJ2l0ZW1zJylcbiAgLnRoZW4ocmVwb3MgPT4gZmlsdGVyKHJlcG9zLCAocikgPT4gci5vd25lci5sb2dpbiA9PT0gJ2NiZHInKSlcbiAgLy8gLm1hcChsb2FkUmVwb0lzc3VlcylcbiAgLm1hcChsb2FkUHVsbFJlcXVlc3RzKVxuICAubWFwKHIgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiByLm5hbWUsXG4gICAgICBvd25lcjogci5vd25lci5sb2dpbixcbiAgICAgIGlzc3Vlczogci5pc3N1ZXMsXG4gICAgICBwdWxsUmVxdWVzdHM6IHIucHVsbFJlcXVlc3RzXG4gICAgfTtcbiAgfSk7XG59O1xuXG5mdW5jdGlvbiBsb2FkUHVsbFJlcXVlc3RzKHJlcG8pIHtcbiAgbGV0IHsgcHVsbHNfdXJsIH0gPSByZXBvO1xuICByZXR1cm4gZ2l0aHViUmVxdWVzdChwdWxsc191cmwpXG4gICAgLm1hcChsb2FkUFJDb21tZW50cylcbiAgICAubWFwKHAgPT4gKHtcbiAgICAgIGlkOiBwLmlkLFxuICAgICAgb3duZXI6IHAudXNlcixcbiAgICAgIG51bWJlcjogcC5udW1iZXIsXG4gICAgICB0aXRsZTogcC50aXRsZSxcbiAgICAgIHVybDogcC5odG1sX3VybCxcbiAgICAgIGFzc2lnbmVlczogcC5hc3NpZ25lZXMsXG4gICAgICBjcmVhdGVkOiBwLmNyZWF0ZWRfYXQsXG4gICAgICB1cGRhdGVkOiBwLnVwZGF0ZWRfYXQsXG4gICAgICBjb21tZW50czogcC5jb21tZW50c1xuICAgIH0pKVxuICAgIC50aGVuKHB1bGxzID0+IGFzc2lnbih7fSwgcmVwbywgeyBbJ3B1bGxSZXF1ZXN0cyddOiBwdWxscyB9KSlcbiAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKVxuICAgICAgdGhyb3cgZXJyO1xuICAgIH0pXG59XG5cbmZ1bmN0aW9uIGxvYWRQUkNvbW1lbnRzKHByKSB7XG4gIGxldCB7IGNvbW1lbnRzX3VybCB9ID0gcHI7XG4gIHJldHVybiBnaXRodWJSZXF1ZXN0KGNvbW1lbnRzX3VybClcbiAgICAudGhlbihjb21tZW50cyA9PiBhc3NpZ24oe30sIHByLCB7IGNvbW1lbnRzIH0pKVxufVxuXG5mdW5jdGlvbiBsb2FkUmVwb0lzc3VlcyhyZXBvKSB7XG4gIGxldCB7IGlzc3Vlc191cmwgfSA9IHJlcG87XG4gIHJldHVybiBnaXRodWJSZXF1ZXN0KGlzc3Vlc191cmwpXG4gICAgLm1hcChpID0+ICh7IGlkOiBpLmlkLCBudW1iZXI6IGkubnVtYmVyLCB0aXRsZTogaS50aXRsZSwgdXJsOiBpLnVybCwgYXNzaWduZWVzOiBpLmFzc2lnbmVlcyB9KSlcbiAgICAudGhlbihpc3N1ZXMgPT4gYXNzaWduKHt9LCByZXBvLCB7IGlzc3VlcyB9KSlcbiAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKVxuICAgICAgdGhyb3cgZXJyO1xuICAgIH0pXG59XG5cbmZ1bmN0aW9uIHJlbW92ZVBsYWNlaG9sZGVyKHVybCwgcGxhY2Vob2xkZXIpIHtcbiAgcmV0dXJuIHVybC5yZXBsYWNlKG5ldyBSZWdFeHAoYHsvJHtwbGFjZWhvbGRlcn19YCksICcnKTtcbn1cblxuZnVuY3Rpb24gZ2l0aHViUmVxdWVzdChlbmRwb2ludCwgeyBkYXRhID0ge30sIGRhdGFGaWVsZCA9ICdxcycgfSA9IHt9KSB7XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVxdWVzdCh7XG4gICAgdXJsOiBwcmVwRW5kcG9pbnRVcmwoZW5kcG9pbnQpICsgJz9wZXJfcGFnZT0xMDAnLFxuICAgIFtkYXRhRmllbGRdOiBkYXRhLFxuICAgIGhlYWRlcnM6IHtcbiAgICAgICdBdXRob3JpemF0aW9uJzogYHRva2VuICR7cHJvY2Vzcy5lbnYuR0hfTk9USUZZX0FVVEhfVE9LRU59YCxcbiAgICAgICdVc2VyLUFnZW50JzogJ2NiYXgvZ2gtbm90aWZ5JyxcbiAgICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vdm5kLmdpdGh1Yi5jZXJiZXJ1cy1wcmV2aWV3K2pzb24nXG4gICAgfSxcbiAgICBqc29uOiB0cnVlXG4gIH0pKVxufVxuXG5mdW5jdGlvbiBwcmVwRW5kcG9pbnRVcmwodXJsSW4pIHtcbiAgdXJsSW4gPSByZW1vdmVQbGFjZWhvbGRlcih1cmxJbiwgJ251bWJlcicpO1xuICByZXR1cm4gaW5jbHVkZXModXJsSW4sIEdJVEhVQl9BUElfVVJMKSA/XG4gICAgdXJsSW4gOiBgJHtHSVRIVUJfQVBJX1VSTH0vJHt1cmxJbn1gO1xufSJdfQ==