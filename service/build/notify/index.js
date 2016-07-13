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
  var githubUserMap = {
    'mmoldavan': '@MattMoldavan',
    'derrickwilliams': '@DerrickW'
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
    if (groupedPRs[key].length > 0) {
      message = '<b>There are ' + groupedPRs[key].length + ' ' + levels[key] + ' pull requests.</b><br/>' + '<br/>' + message + '<br/>' + '<img src="https://dujrsrsgsd3nh.cloudfront.net/img/emoticons/disappear-1417754650@2x.gif" />';
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

  function getHipchatMentions(assignees) {
    var mentions = '';
    (0, _lodash.forEach)(assignees, getHipChatUser);
    return mentions;

    function getHipChatUser(githubUsername) {
      mentions += githubUserMap[githubUsername] || githubUsername;
    }
  }

  return _bluebird2.default.resolve();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ub3RpZnkvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7a0JBSXdCLGE7O0FBSnhCOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVlLFNBQVMsYUFBVCxDQUF1QixZQUF2QixFQUFxQztBQUNsRCxNQUFJLGFBQWEseUJBQWUsMENBQWYsQ0FBakI7QUFDQSxNQUFJLFNBQVM7QUFDWCxTQUFLLE9BRE07QUFFWCxTQUFLLFFBRk07QUFHWCxVQUFNO0FBSEssR0FBYjtBQUtBLE1BQUksU0FBUztBQUNYLFNBQUssS0FETTtBQUVYLFNBQUssYUFGTTtBQUdYLFVBQU07QUFISyxHQUFiO0FBS0EsTUFBSSxhQUFhO0FBQ2YsU0FBSyxFQURVO0FBRWYsU0FBSyxFQUZVO0FBR2YsVUFBTTtBQUhTLEdBQWpCO0FBS0EsTUFBSSxXQUFXO0FBQ2IsU0FBSyxFQURRO0FBRWIsU0FBSyxFQUZRO0FBR2IsVUFBTTtBQUhPLEdBQWY7QUFLQSxNQUFJLGdCQUFnQjtBQUNsQixpQkFBYSxlQURLO0FBRWxCLHVCQUFtQjtBQUZELEdBQXBCOztBQUtBLGlCQUFlLGdCQUFnQixDQUFDO0FBQzVCLFVBQU0sc0RBRHNCO0FBRTVCLFdBQU8sb0JBRnFCO0FBRzVCLFFBQUksR0FId0I7QUFJNUIsZUFBVyxDQUFDLGlCQUFELEVBQW1CLFdBQW5CLENBSmlCO0FBSzVCLFdBQU87QUFMcUIsR0FBRCxDQUEvQjs7QUFRQSx1QkFBUSxZQUFSLEVBQXNCLFFBQXRCO0FBQ0EsdUJBQVEsUUFBUixFQUFrQixlQUFsQjs7QUFFQSxXQUFTLFFBQVQsQ0FBa0IsRUFBbEIsRUFBc0I7QUFDcEIsZUFBVyxHQUFHLEtBQWQsRUFBcUIsSUFBckIsQ0FBMEIsRUFBMUI7QUFDQSxhQUFTLEdBQUcsS0FBWixLQUFzQixRQUFPLEdBQUcsSUFBVixHQUFnQixhQUFoQixHQUErQixHQUFHLElBQWxDLEdBQXdDLElBQXhDLEdBQStDLEdBQUcsS0FBbEQsR0FBMEQsNkJBQTFELEdBQXlGLEdBQUcsU0FBNUYsR0FBdUcsV0FBN0g7QUFDRDs7QUFFRCxXQUFTLGVBQVQsQ0FBeUIsT0FBekIsRUFBa0MsR0FBbEMsRUFBdUM7QUFDckMsUUFBRyxXQUFXLEdBQVgsRUFBZ0IsTUFBaEIsR0FBeUIsQ0FBNUIsRUFBK0I7QUFDN0IsZ0JBQVUsa0JBQWtCLFdBQVcsR0FBWCxFQUFnQixNQUFsQyxHQUEyQyxHQUEzQyxHQUFpRCxPQUFPLEdBQVAsQ0FBakQsR0FBK0QsMEJBQS9ELEdBQ1IsT0FEUSxHQUNFLE9BREYsR0FDWSxPQURaLEdBRVIsOEZBRkY7QUFHQSxpQkFBVyxNQUFYLENBQWtCLFlBQWxCLEVBQ0k7QUFDSSxpQkFBUyxPQURiO0FBRUksZUFBTyxPQUFPLEdBQVAsQ0FGWDtBQUdJLGdCQUFRLElBSFo7QUFJSSxlQUFPO0FBSlgsT0FESixFQU1PLFVBQVMsR0FBVCxFQUFhO0FBQ1osWUFBSSxPQUFPLElBQVgsRUFBaUIsUUFBUSxHQUFSLENBQVksaUNBQVo7QUFDeEIsT0FSRDtBQVNEO0FBQ0Y7O0FBRUQsV0FBUyxrQkFBVCxDQUE0QixTQUE1QixFQUF1QztBQUNyQyxRQUFJLFdBQVcsRUFBZjtBQUNBLHlCQUFRLFNBQVIsRUFBbUIsY0FBbkI7QUFDQSxXQUFPLFFBQVA7O0FBRUEsYUFBUyxjQUFULENBQXdCLGNBQXhCLEVBQXdDO0FBQ3RDLGtCQUFZLGNBQWMsY0FBZCxLQUFpQyxjQUE3QztBQUNEO0FBQ0Y7O0FBRUgsU0FBTyxtQkFBUSxPQUFSLEVBQVA7QUFFQyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBIaXBjaGF0dGVyIGZyb20gJ2hpcGNoYXR0ZXInO1xuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IHsgZm9yRWFjaCB9IGZyb20gJ2xvZGFzaCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG5vdGlmeUhpcGNoYXQocHVsbFJlcXVlc3RzKSB7XG4gIGxldCBoaXBjaGF0dGVyID0gbmV3IEhpcGNoYXR0ZXIoJ1g3cVFVMFhQU2pObjg2cmo2ZUxjWkVYNHRRMXJtNmhvalA3dExGdXEnKTtcbiAgbGV0IGNvbG9ycyA9IHtcbiAgICAnMCc6ICdncmVlbicsXG4gICAgJzUnOiAneWVsbG93JyxcbiAgICAnMTAnOiAncmVkJyAgXG4gIH07XG4gIGxldCBsZXZlbHMgPSB7XG4gICAgJzAnOiAnbmV3JyxcbiAgICAnNSc6ICdvdXRzdGFuZGluZycsXG4gICAgJzEwJzogJ3VuYXNzaWduZWQgb3Igc3RhbGUnXG4gIH1cbiAgbGV0IGdyb3VwZWRQUnMgPSB7XG4gICAgJzAnOiBbXSxcbiAgICAnNSc6IFtdLFxuICAgICcxMCc6IFtdXG4gIH1cbiAgbGV0IG1lc3NhZ2VzID0ge1xuICAgICcwJzogJycsXG4gICAgJzUnOiAnJyxcbiAgICAnMTAnOiAnJ1xuICB9XG4gIGxldCBnaXRodWJVc2VyTWFwID0ge1xuICAgICdtbW9sZGF2YW4nOiAnQE1hdHRNb2xkYXZhbicsXG4gICAgJ2RlcnJpY2t3aWxsaWFtcyc6ICdARGVycmlja1cnXG4gIH1cblxuICBwdWxsUmVxdWVzdHMgPSBwdWxsUmVxdWVzdHMgfHwgW3tcbiAgICAgIGxpbms6ICdodHRwczovL2dpdGh1Yi5jb20vY2Jkci9jYmF4LWFwcGx5LXBsYXRmb3JtL3B1bGwvMjcxJyxcbiAgICAgIHRpdGxlOiAnQWRkIHJlZGlyZWN0IHRvIENCJyxcbiAgICAgIGlkOiAyNzEsXG4gICAgICBhc3NpZ25lZXM6IFsnZGVycmlja3dpbGxpYW1zJywnbW1vbGRhdmFuJ10sXG4gICAgICBsZXZlbDogJ25vcm1hbCdcbiAgICB9XVxuXG4gIGZvckVhY2gocHVsbFJlcXVlc3RzLCBncm91cFBScyk7XG4gIGZvckVhY2gobWVzc2FnZXMsIHNlbmROb3RpZmNhdGlvbik7XG5cbiAgZnVuY3Rpb24gZ3JvdXBQUnMocHIpIHtcbiAgICBncm91cGVkUFJzW3ByLmxldmVsXS5wdXNoKHByKTtcbiAgICBtZXNzYWdlc1twci5sZXZlbF0gKz0gJzxiPicgK3ByLnJlcG8gKyc6IDxhIGhyZWY9XCInKyBwci5saW5rICsnXCI+JyArIHByLnRpdGxlICsgJzwvYT48L2I+PC9icj48aT5Bc3NpZ25lZXM6ICcrIHByLmFzc2lnbmVlcyArJzwvaT48YnIvPidcbiAgfVxuXG4gIGZ1bmN0aW9uIHNlbmROb3RpZmNhdGlvbihtZXNzYWdlLCBrZXkpIHtcbiAgICBpZihncm91cGVkUFJzW2tleV0ubGVuZ3RoID4gMCkge1xuICAgICAgbWVzc2FnZSA9ICc8Yj5UaGVyZSBhcmUgJyArIGdyb3VwZWRQUnNba2V5XS5sZW5ndGggKyAnICcgKyBsZXZlbHNba2V5XSArICcgcHVsbCByZXF1ZXN0cy48L2I+PGJyLz4nICtcbiAgICAgICAgJzxici8+JyArIG1lc3NhZ2UgKyAnPGJyLz4nICtcbiAgICAgICAgJzxpbWcgc3JjPVwiaHR0cHM6Ly9kdWpyc3JzZ3NkM25oLmNsb3VkZnJvbnQubmV0L2ltZy9lbW90aWNvbnMvZGlzYXBwZWFyLTE0MTc3NTQ2NTBAMnguZ2lmXCIgLz4nO1xuICAgICAgaGlwY2hhdHRlci5ub3RpZnkoJ0NCQVggU2NydW0nLCBcbiAgICAgICAgICB7XG4gICAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgICAgICAgICAgIGNvbG9yOiBjb2xvcnNba2V5XSxcbiAgICAgICAgICAgICAgbm90aWZ5OiB0cnVlLFxuICAgICAgICAgICAgICB0b2tlbjogJzdiNkZsQ2ZpRmpnVmFOcGdNM1lMT0JOZUozRnhJZ1IyVHExQkMxSnAnXG4gICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgaWYgKGVyciA9PSBudWxsKSBjb25zb2xlLmxvZygnU3VjY2Vzc2Z1bGx5IG5vdGlmaWVkIHRoZSByb29tLicpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0SGlwY2hhdE1lbnRpb25zKGFzc2lnbmVlcykge1xuICAgIGxldCBtZW50aW9ucyA9ICcnO1xuICAgIGZvckVhY2goYXNzaWduZWVzLCBnZXRIaXBDaGF0VXNlcilcbiAgICByZXR1cm4gbWVudGlvbnM7XG5cbiAgICBmdW5jdGlvbiBnZXRIaXBDaGF0VXNlcihnaXRodWJVc2VybmFtZSkge1xuICAgICAgbWVudGlvbnMgKz0gZ2l0aHViVXNlck1hcFtnaXRodWJVc2VybmFtZV0gfHwgZ2l0aHViVXNlcm5hbWU7XG4gICAgfVxuICB9XG5cbnJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblxufSJdfQ==