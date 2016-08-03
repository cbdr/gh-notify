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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXRyaWV2ZS9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztrQkFLd0IsZTs7QUFMeEI7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFDQSxJQUFNLGlCQUFpQix3QkFBdkI7O0FBRWUsU0FBUyxlQUFULE9BQW1DO0FBQUEsTUFBUixJQUFRLFFBQVIsSUFBUTs7QUFDaEQ7QUFDQSxTQUFPLGNBQWMscUJBQWQsRUFBcUM7QUFDMUMsVUFBTTtBQUNKLFNBQU0sSUFBTjtBQURJO0FBRG9DLEdBQXJDLEVBS04sR0FMTSxDQUtGLE9BTEUsRUFNTixJQU5NLENBTUQ7QUFBQSxXQUFTLG9CQUFPLEtBQVAsRUFBYyxVQUFDLENBQUQ7QUFBQSxhQUFPLEVBQUUsS0FBRixDQUFRLEtBQVIsS0FBa0IsTUFBekI7QUFBQSxLQUFkLENBQVQ7QUFBQSxHQU5DO0FBT1A7QUFQTyxHQVFOLEdBUk0sQ0FRRixnQkFSRSxFQVNOLEdBVE0sQ0FTRixhQUFLO0FBQ1IsV0FBTztBQUNMLFlBQU0sRUFBRSxJQURIO0FBRUwsYUFBTyxFQUFFLEtBQUYsQ0FBUSxLQUZWO0FBR0wsY0FBUSxFQUFFLE1BSEw7QUFJTCxvQkFBYyxFQUFFO0FBSlgsS0FBUDtBQU1ELEdBaEJNLENBQVA7QUFpQkQ7O0FBRUQsU0FBUyxnQkFBVCxDQUEwQixJQUExQixFQUFnQztBQUFBLE1BQ3hCLFNBRHdCLEdBQ1YsSUFEVSxDQUN4QixTQUR3Qjs7QUFFOUIsU0FBTyxjQUFjLFNBQWQsRUFDSixHQURJLENBQ0EsY0FEQSxFQUVKLEdBRkksQ0FFQTtBQUFBLFdBQU07QUFDVCxVQUFJLEVBQUUsRUFERztBQUVULGFBQU8sRUFBRSxJQUZBO0FBR1QsY0FBUSxFQUFFLE1BSEQ7QUFJVCxhQUFPLEVBQUUsS0FKQTtBQUtULFdBQUssRUFBRSxRQUxFO0FBTVQsaUJBQVcsRUFBRSxTQU5KO0FBT1QsZUFBUyxFQUFFLFVBUEY7QUFRVCxlQUFTLEVBQUUsVUFSRjtBQVNULGdCQUFVLEVBQUU7QUFUSCxLQUFOO0FBQUEsR0FGQSxFQWFKLElBYkksQ0FhQztBQUFBLFdBQVMsb0JBQU8sRUFBUCxFQUFXLElBQVgsc0JBQW9CLGNBQXBCLEVBQXFDLEtBQXJDLEVBQVQ7QUFBQSxHQWJELEVBY0osS0FkSSxDQWNFLGVBQU87QUFDWixZQUFRLEtBQVIsQ0FBYyxHQUFkO0FBQ0EsVUFBTSxHQUFOO0FBQ0QsR0FqQkksQ0FBUDtBQWtCRDs7QUFFRCxTQUFTLGNBQVQsQ0FBd0IsRUFBeEIsRUFBNEI7QUFBQSxNQUNwQixZQURvQixHQUNILEVBREcsQ0FDcEIsWUFEb0I7O0FBRTFCLFNBQU8sY0FBYyxZQUFkLEVBQ0osSUFESSxDQUNDO0FBQUEsV0FBWSxvQkFBTyxFQUFQLEVBQVcsRUFBWCxFQUFlLEVBQUUsa0JBQUYsRUFBZixDQUFaO0FBQUEsR0FERCxDQUFQO0FBRUQ7O0FBRUQsU0FBUyxjQUFULENBQXdCLElBQXhCLEVBQThCO0FBQUEsTUFDdEIsVUFEc0IsR0FDUCxJQURPLENBQ3RCLFVBRHNCOztBQUU1QixTQUFPLGNBQWMsVUFBZCxFQUNKLEdBREksQ0FDQTtBQUFBLFdBQU0sRUFBRSxJQUFJLEVBQUUsRUFBUixFQUFZLFFBQVEsRUFBRSxNQUF0QixFQUE4QixPQUFPLEVBQUUsS0FBdkMsRUFBOEMsS0FBSyxFQUFFLEdBQXJELEVBQTBELFdBQVcsRUFBRSxTQUF2RSxFQUFOO0FBQUEsR0FEQSxFQUVKLElBRkksQ0FFQztBQUFBLFdBQVUsb0JBQU8sRUFBUCxFQUFXLElBQVgsRUFBaUIsRUFBRSxjQUFGLEVBQWpCLENBQVY7QUFBQSxHQUZELEVBR0osS0FISSxDQUdFLGVBQU87QUFDWixZQUFRLEtBQVIsQ0FBYyxHQUFkO0FBQ0EsVUFBTSxHQUFOO0FBQ0QsR0FOSSxDQUFQO0FBT0Q7O0FBRUQsU0FBUyxpQkFBVCxDQUEyQixHQUEzQixFQUFnQyxXQUFoQyxFQUE2QztBQUMzQyxTQUFPLElBQUksT0FBSixDQUFZLElBQUksTUFBSixRQUFnQixXQUFoQixPQUFaLEVBQTZDLEVBQTdDLENBQVA7QUFDRDs7QUFFRCxTQUFTLGFBQVQsQ0FBdUIsUUFBdkIsRUFBdUU7QUFBQTs7QUFBQSxvRUFBSixFQUFJOztBQUFBLHlCQUFwQyxJQUFvQztBQUFBLE1BQXBDLElBQW9DLDhCQUE3QixFQUE2QjtBQUFBLDhCQUF6QixTQUF5QjtBQUFBLE1BQXpCLFNBQXlCLG1DQUFiLElBQWE7O0FBQ3JFLFNBQU8sbUJBQVEsT0FBUixDQUFnQjtBQUNyQixTQUFLLGdCQUFnQixRQUFoQixJQUE0QjtBQURaLCtCQUVwQixTQUZvQixFQUVSLElBRlEsd0NBR1o7QUFDUCxnQ0FBMEIsUUFBUSxHQUFSLENBQVksb0JBRC9CO0FBRVAsa0JBQWMsZ0JBRlA7QUFHUCxjQUFVO0FBSEgsR0FIWSxxQ0FRZixJQVJlLGFBQWhCLENBQVA7QUFVRDs7QUFFRCxTQUFTLGVBQVQsQ0FBeUIsS0FBekIsRUFBZ0M7QUFDOUIsVUFBUSxrQkFBa0IsS0FBbEIsRUFBeUIsUUFBekIsQ0FBUjtBQUNBLFNBQU8sc0JBQVMsS0FBVCxFQUFnQixjQUFoQixJQUNMLEtBREssR0FDTSxjQUROLFNBQ3dCLEtBRC9CO0FBRUQiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcmVxdWVzdCBmcm9tICdyZXF1ZXN0LXByb21pc2UnO1xuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IHsgYXNzaWduLCBmaWx0ZXIsIGluY2x1ZGVzIH0gZnJvbSAnbG9kYXNoJztcbmNvbnN0IEdJVEhVQl9BUElfVVJMID0gJ2h0dHBzOi8vYXBpLmdpdGh1Yi5jb20nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRSZXBvc2l0b3JpZXMoeyByZXBvIH0pIHtcbiAgZGVidWdnZXJcbiAgcmV0dXJuIGdpdGh1YlJlcXVlc3QoJ3NlYXJjaC9yZXBvc2l0b3JpZXMnLCB7XG4gICAgZGF0YToge1xuICAgICAgcTogYCR7cmVwb30gaW46bmFtZSBwdXNoZWQ6Pj0yMDE2LTAxLTAxYFxuICAgIH1cbiAgfSlcbiAgLmdldCgnaXRlbXMnKVxuICAudGhlbihyZXBvcyA9PiBmaWx0ZXIocmVwb3MsIChyKSA9PiByLm93bmVyLmxvZ2luID09PSAnY2JkcicpKVxuICAvLyAubWFwKGxvYWRSZXBvSXNzdWVzKVxuICAubWFwKGxvYWRQdWxsUmVxdWVzdHMpXG4gIC5tYXAociA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IHIubmFtZSxcbiAgICAgIG93bmVyOiByLm93bmVyLmxvZ2luLFxuICAgICAgaXNzdWVzOiByLmlzc3VlcyxcbiAgICAgIHB1bGxSZXF1ZXN0czogci5wdWxsUmVxdWVzdHNcbiAgICB9O1xuICB9KTtcbn07XG5cbmZ1bmN0aW9uIGxvYWRQdWxsUmVxdWVzdHMocmVwbykge1xuICBsZXQgeyBwdWxsc191cmwgfSA9IHJlcG87XG4gIHJldHVybiBnaXRodWJSZXF1ZXN0KHB1bGxzX3VybClcbiAgICAubWFwKGxvYWRQUkNvbW1lbnRzKVxuICAgIC5tYXAocCA9PiAoe1xuICAgICAgaWQ6IHAuaWQsXG4gICAgICBvd25lcjogcC51c2VyLFxuICAgICAgbnVtYmVyOiBwLm51bWJlcixcbiAgICAgIHRpdGxlOiBwLnRpdGxlLFxuICAgICAgdXJsOiBwLmh0bWxfdXJsLFxuICAgICAgYXNzaWduZWVzOiBwLmFzc2lnbmVlcyxcbiAgICAgIGNyZWF0ZWQ6IHAuY3JlYXRlZF9hdCxcbiAgICAgIHVwZGF0ZWQ6IHAudXBkYXRlZF9hdCxcbiAgICAgIGNvbW1lbnRzOiBwLmNvbW1lbnRzXG4gICAgfSkpXG4gICAgLnRoZW4ocHVsbHMgPT4gYXNzaWduKHt9LCByZXBvLCB7IFsncHVsbFJlcXVlc3RzJ106IHB1bGxzIH0pKVxuICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgY29uc29sZS5lcnJvcihlcnIpXG4gICAgICB0aHJvdyBlcnI7XG4gICAgfSlcbn1cblxuZnVuY3Rpb24gbG9hZFBSQ29tbWVudHMocHIpIHtcbiAgbGV0IHsgY29tbWVudHNfdXJsIH0gPSBwcjtcbiAgcmV0dXJuIGdpdGh1YlJlcXVlc3QoY29tbWVudHNfdXJsKVxuICAgIC50aGVuKGNvbW1lbnRzID0+IGFzc2lnbih7fSwgcHIsIHsgY29tbWVudHMgfSkpXG59XG5cbmZ1bmN0aW9uIGxvYWRSZXBvSXNzdWVzKHJlcG8pIHtcbiAgbGV0IHsgaXNzdWVzX3VybCB9ID0gcmVwbztcbiAgcmV0dXJuIGdpdGh1YlJlcXVlc3QoaXNzdWVzX3VybClcbiAgICAubWFwKGkgPT4gKHsgaWQ6IGkuaWQsIG51bWJlcjogaS5udW1iZXIsIHRpdGxlOiBpLnRpdGxlLCB1cmw6IGkudXJsLCBhc3NpZ25lZXM6IGkuYXNzaWduZWVzIH0pKVxuICAgIC50aGVuKGlzc3VlcyA9PiBhc3NpZ24oe30sIHJlcG8sIHsgaXNzdWVzIH0pKVxuICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgY29uc29sZS5lcnJvcihlcnIpXG4gICAgICB0aHJvdyBlcnI7XG4gICAgfSlcbn1cblxuZnVuY3Rpb24gcmVtb3ZlUGxhY2Vob2xkZXIodXJsLCBwbGFjZWhvbGRlcikge1xuICByZXR1cm4gdXJsLnJlcGxhY2UobmV3IFJlZ0V4cChgey8ke3BsYWNlaG9sZGVyfX1gKSwgJycpO1xufVxuXG5mdW5jdGlvbiBnaXRodWJSZXF1ZXN0KGVuZHBvaW50LCB7IGRhdGEgPSB7fSwgZGF0YUZpZWxkID0gJ3FzJyB9ID0ge30pIHtcbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZXF1ZXN0KHtcbiAgICB1cmw6IHByZXBFbmRwb2ludFVybChlbmRwb2ludCkgKyAnP3Blcl9wYWdlPTEwMCcsXG4gICAgW2RhdGFGaWVsZF06IGRhdGEsXG4gICAgaGVhZGVyczoge1xuICAgICAgJ0F1dGhvcml6YXRpb24nOiBgdG9rZW4gJHtwcm9jZXNzLmVudi5HSF9OT1RJRllfQVVUSF9UT0tFTn1gLFxuICAgICAgJ1VzZXItQWdlbnQnOiAnY2JheC9naC1ub3RpZnknLFxuICAgICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi92bmQuZ2l0aHViLmNlcmJlcnVzLXByZXZpZXcranNvbidcbiAgICB9LFxuICAgIGpzb246IHRydWVcbiAgfSkpXG59XG5cbmZ1bmN0aW9uIHByZXBFbmRwb2ludFVybCh1cmxJbikge1xuICB1cmxJbiA9IHJlbW92ZVBsYWNlaG9sZGVyKHVybEluLCAnbnVtYmVyJyk7XG4gIHJldHVybiBpbmNsdWRlcyh1cmxJbiwgR0lUSFVCX0FQSV9VUkwpID9cbiAgICB1cmxJbiA6IGAke0dJVEhVQl9BUElfVVJMfS8ke3VybElufWA7XG59Il19