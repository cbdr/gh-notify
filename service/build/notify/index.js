'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = notifyHipchat;

var _hipchatter = require('hipchatter');

var _hipchatter2 = _interopRequireDefault(_hipchatter);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function notifyHipchat(pullRequests) {
  console.log('pullRequests:', pullRequests);

  var hipchatter = new _hipchatter2.default('X7qQU0XPSjNn86rj6eLcZEX4tQ1rm6hojP7tLFuq');
  var colors = {
    '0': 'green',
    '5': 'yellow',
    '10': 'red'
  };
  var levels = {
    '0': 'new',
    '5': 'outstanding',
    '10': 'unassigned or stale'
  };
  var groupedPRs = {
    '0': [],
    '5': [],
    '10': []
  };
  var messages = {
    '0': '',
    '5': '',
    '10': ''
  };

  pullRequests = pullRequests || [{
    link: 'https://github.com/cbdr/cbax-apply-platform/pull/271',
    title: 'Add redirect to CB',
    id: 271,
    assignees: ['derrickwilliams', 'mmoldavan'],
    level: 'normal'
  }];

  (0, _lodash.forEach)(pullRequests, groupPRs);
  (0, _lodash.forEach)(messages, sendNotifcation);

  function groupPRs(pr) {
    groupedPRs[pr.level].push(pr);
    messages[pr.level] += '<b>' + pr.repo + ': <a href="' + pr.link + '">' + pr.title + '</a></b></br><i>Assignees: ' + pr.assignees + '</i><br/>';
  }

  function sendNotifcation(message, key) {
    console.log(key, message);
    if (groupedPRs[key].length > 0) {
      message = '<b>There are ' + groupedPRs[key].length + ' ' + levels[key] + ' pull requests.</b><br/><br/>' + message;
      hipchatter.notify('CBAX Scrum', {
        message: message,
        color: colors[key],
        notify: true,
        token: '7b6FlCfiFjgVaNpgM3YLOBNeJ3FxIgR2Tq1BC1Jp'
      }, function (err) {
        if (err == null) console.log('Successfully notified the room.');
      });
    }
  }

  return _bluebird2.default.resolve();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ub3RpZnkvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7a0JBSXdCLGE7O0FBSnhCOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVlLFNBQVMsYUFBVCxDQUF1QixZQUF2QixFQUFxQztBQUNsRCxVQUFRLEdBQVIsQ0FBWSxlQUFaLEVBQTRCLFlBQTVCOztBQUVBLE1BQUksYUFBYSx5QkFBZSwwQ0FBZixDQUFqQjtBQUNBLE1BQUksU0FBUztBQUNYLFNBQUssT0FETTtBQUVYLFNBQUssUUFGTTtBQUdYLFVBQU07QUFISyxHQUFiO0FBS0EsTUFBSSxTQUFTO0FBQ1gsU0FBSyxLQURNO0FBRVgsU0FBSyxhQUZNO0FBR1gsVUFBTTtBQUhLLEdBQWI7QUFLQSxNQUFJLGFBQWE7QUFDZixTQUFLLEVBRFU7QUFFZixTQUFLLEVBRlU7QUFHZixVQUFNO0FBSFMsR0FBakI7QUFLQSxNQUFJLFdBQVc7QUFDYixTQUFLLEVBRFE7QUFFYixTQUFLLEVBRlE7QUFHYixVQUFNO0FBSE8sR0FBZjs7QUFNQSxpQkFBZSxnQkFBZ0IsQ0FBQztBQUM1QixVQUFNLHNEQURzQjtBQUU1QixXQUFPLG9CQUZxQjtBQUc1QixRQUFJLEdBSHdCO0FBSTVCLGVBQVcsQ0FBQyxpQkFBRCxFQUFtQixXQUFuQixDQUppQjtBQUs1QixXQUFPO0FBTHFCLEdBQUQsQ0FBL0I7O0FBUUEsdUJBQVEsWUFBUixFQUFzQixRQUF0QjtBQUNBLHVCQUFRLFFBQVIsRUFBa0IsZUFBbEI7O0FBRUEsV0FBUyxRQUFULENBQWtCLEVBQWxCLEVBQXNCO0FBQ3BCLGVBQVcsR0FBRyxLQUFkLEVBQXFCLElBQXJCLENBQTBCLEVBQTFCO0FBQ0EsYUFBUyxHQUFHLEtBQVosS0FBc0IsUUFBTyxHQUFHLElBQVYsR0FBZ0IsYUFBaEIsR0FBK0IsR0FBRyxJQUFsQyxHQUF3QyxJQUF4QyxHQUErQyxHQUFHLEtBQWxELEdBQTBELDZCQUExRCxHQUF3RixHQUFHLFNBQTNGLEdBQXFHLFdBQTNIO0FBQ0Q7O0FBRUQsV0FBUyxlQUFULENBQXlCLE9BQXpCLEVBQWtDLEdBQWxDLEVBQXVDO0FBQ3JDLFlBQVEsR0FBUixDQUFZLEdBQVosRUFBaUIsT0FBakI7QUFDQSxRQUFHLFdBQVcsR0FBWCxFQUFnQixNQUFoQixHQUF5QixDQUE1QixFQUErQjtBQUM3QixnQkFBVSxrQkFBa0IsV0FBVyxHQUFYLEVBQWdCLE1BQWxDLEdBQTJDLEdBQTNDLEdBQWlELE9BQU8sR0FBUCxDQUFqRCxHQUErRCwrQkFBL0QsR0FBaUcsT0FBM0c7QUFDQSxpQkFBVyxNQUFYLENBQWtCLFlBQWxCLEVBQ0k7QUFDSSxpQkFBUyxPQURiO0FBRUksZUFBTyxPQUFPLEdBQVAsQ0FGWDtBQUdJLGdCQUFRLElBSFo7QUFJSSxlQUFPO0FBSlgsT0FESixFQU1PLFVBQVMsR0FBVCxFQUFhO0FBQ1osWUFBSSxPQUFPLElBQVgsRUFBaUIsUUFBUSxHQUFSLENBQVksaUNBQVo7QUFDeEIsT0FSRDtBQVNEO0FBQ0Y7O0FBRUgsU0FBTyxtQkFBUSxPQUFSLEVBQVA7QUFFQyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBIaXBjaGF0dGVyIGZyb20gJ2hpcGNoYXR0ZXInO1xuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IHsgZm9yRWFjaCB9IGZyb20gJ2xvZGFzaCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG5vdGlmeUhpcGNoYXQocHVsbFJlcXVlc3RzKSB7XG4gIGNvbnNvbGUubG9nKCdwdWxsUmVxdWVzdHM6JyxwdWxsUmVxdWVzdHMpO1xuXG4gIGxldCBoaXBjaGF0dGVyID0gbmV3IEhpcGNoYXR0ZXIoJ1g3cVFVMFhQU2pObjg2cmo2ZUxjWkVYNHRRMXJtNmhvalA3dExGdXEnKTtcbiAgbGV0IGNvbG9ycyA9IHtcbiAgICAnMCc6ICdncmVlbicsXG4gICAgJzUnOiAneWVsbG93JyxcbiAgICAnMTAnOiAncmVkJyAgXG4gIH07XG4gIGxldCBsZXZlbHMgPSB7XG4gICAgJzAnOiAnbmV3JyxcbiAgICAnNSc6ICdvdXRzdGFuZGluZycsXG4gICAgJzEwJzogJ3VuYXNzaWduZWQgb3Igc3RhbGUnXG4gIH1cbiAgbGV0IGdyb3VwZWRQUnMgPSB7XG4gICAgJzAnOiBbXSxcbiAgICAnNSc6IFtdLFxuICAgICcxMCc6IFtdXG4gIH1cbiAgbGV0IG1lc3NhZ2VzID0ge1xuICAgICcwJzogJycsXG4gICAgJzUnOiAnJyxcbiAgICAnMTAnOiAnJ1xuICB9XG5cbiAgcHVsbFJlcXVlc3RzID0gcHVsbFJlcXVlc3RzIHx8IFt7XG4gICAgICBsaW5rOiAnaHR0cHM6Ly9naXRodWIuY29tL2NiZHIvY2JheC1hcHBseS1wbGF0Zm9ybS9wdWxsLzI3MScsXG4gICAgICB0aXRsZTogJ0FkZCByZWRpcmVjdCB0byBDQicsXG4gICAgICBpZDogMjcxLFxuICAgICAgYXNzaWduZWVzOiBbJ2RlcnJpY2t3aWxsaWFtcycsJ21tb2xkYXZhbiddLFxuICAgICAgbGV2ZWw6ICdub3JtYWwnXG4gICAgfV1cblxuICBmb3JFYWNoKHB1bGxSZXF1ZXN0cywgZ3JvdXBQUnMpO1xuICBmb3JFYWNoKG1lc3NhZ2VzLCBzZW5kTm90aWZjYXRpb24pO1xuXG4gIGZ1bmN0aW9uIGdyb3VwUFJzKHByKSB7XG4gICAgZ3JvdXBlZFBSc1twci5sZXZlbF0ucHVzaChwcik7XG4gICAgbWVzc2FnZXNbcHIubGV2ZWxdICs9ICc8Yj4nICtwci5yZXBvICsnOiA8YSBocmVmPVwiJysgcHIubGluayArJ1wiPicgKyBwci50aXRsZSArICc8L2E+PC9iPjwvYnI+PGk+QXNzaWduZWVzOiAnK3ByLmFzc2lnbmVlcysnPC9pPjxici8+J1xuICB9XG5cbiAgZnVuY3Rpb24gc2VuZE5vdGlmY2F0aW9uKG1lc3NhZ2UsIGtleSkge1xuICAgIGNvbnNvbGUubG9nKGtleSwgbWVzc2FnZSk7XG4gICAgaWYoZ3JvdXBlZFBSc1trZXldLmxlbmd0aCA+IDApIHtcbiAgICAgIG1lc3NhZ2UgPSAnPGI+VGhlcmUgYXJlICcgKyBncm91cGVkUFJzW2tleV0ubGVuZ3RoICsgJyAnICsgbGV2ZWxzW2tleV0gKyAnIHB1bGwgcmVxdWVzdHMuPC9iPjxici8+PGJyLz4nICsgbWVzc2FnZVxuICAgICAgaGlwY2hhdHRlci5ub3RpZnkoJ0NCQVggU2NydW0nLCBcbiAgICAgICAgICB7XG4gICAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgICAgICAgICAgIGNvbG9yOiBjb2xvcnNba2V5XSxcbiAgICAgICAgICAgICAgbm90aWZ5OiB0cnVlLFxuICAgICAgICAgICAgICB0b2tlbjogJzdiNkZsQ2ZpRmpnVmFOcGdNM1lMT0JOZUozRnhJZ1IyVHExQkMxSnAnXG4gICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgaWYgKGVyciA9PSBudWxsKSBjb25zb2xlLmxvZygnU3VjY2Vzc2Z1bGx5IG5vdGlmaWVkIHRoZSByb29tLicpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbnJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblxufSJdfQ==