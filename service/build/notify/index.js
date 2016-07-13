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
      message = '<b>There are ' + groupedPRs[key].length + ' ' + levels[key] + ' pull requests.</b><br/>' + '<br/><b style="font-size: 0.8em">' + message + '</b><br/>' + '<img src="https://dujrsrsgsd3nh.cloudfront.net/img/emoticons/disappear-1417754650@2x.gif" />';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ub3RpZnkvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7a0JBSXdCLGE7O0FBSnhCOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVlLFNBQVMsYUFBVCxDQUF1QixZQUF2QixFQUFxQztBQUNsRCxNQUFJLGFBQWEseUJBQWUsMENBQWYsQ0FBakI7QUFDQSxNQUFJLFNBQVM7QUFDWCxTQUFLLE9BRE07QUFFWCxTQUFLLFFBRk07QUFHWCxVQUFNO0FBSEssR0FBYjtBQUtBLE1BQUksU0FBUztBQUNYLFNBQUssS0FETTtBQUVYLFNBQUssYUFGTTtBQUdYLFVBQU07QUFISyxHQUFiO0FBS0EsTUFBSSxhQUFhO0FBQ2YsU0FBSyxFQURVO0FBRWYsU0FBSyxFQUZVO0FBR2YsVUFBTTtBQUhTLEdBQWpCO0FBS0EsTUFBSSxXQUFXO0FBQ2IsU0FBSyxFQURRO0FBRWIsU0FBSyxFQUZRO0FBR2IsVUFBTTtBQUhPLEdBQWY7QUFLQSxNQUFJLGdCQUFnQjtBQUNsQixpQkFBYSxlQURLO0FBRWxCLHVCQUFtQjtBQUZELEdBQXBCOztBQUtBLGlCQUFlLGdCQUFnQixDQUFDO0FBQzVCLFVBQU0sc0RBRHNCO0FBRTVCLFdBQU8sb0JBRnFCO0FBRzVCLFFBQUksR0FId0I7QUFJNUIsZUFBVyxDQUFDLGlCQUFELEVBQW1CLFdBQW5CLENBSmlCO0FBSzVCLFdBQU87QUFMcUIsR0FBRCxDQUEvQjs7QUFRQSx1QkFBUSxZQUFSLEVBQXNCLFFBQXRCO0FBQ0EsdUJBQVEsUUFBUixFQUFrQixlQUFsQjs7QUFFQSxXQUFTLFFBQVQsQ0FBa0IsRUFBbEIsRUFBc0I7QUFDcEIsZUFBVyxHQUFHLEtBQWQsRUFBcUIsSUFBckIsQ0FBMEIsRUFBMUI7QUFDQSxhQUFTLEdBQUcsS0FBWixLQUFzQixRQUFPLEdBQUcsSUFBVixHQUFnQixhQUFoQixHQUErQixHQUFHLElBQWxDLEdBQXdDLElBQXhDLEdBQStDLEdBQUcsS0FBbEQsR0FBMEQsNkJBQTFELEdBQXlGLEdBQUcsU0FBNUYsR0FBdUcsV0FBN0g7QUFDRDs7QUFFRCxXQUFTLGVBQVQsQ0FBeUIsT0FBekIsRUFBa0MsR0FBbEMsRUFBdUM7QUFDckMsUUFBRyxXQUFXLEdBQVgsRUFBZ0IsTUFBaEIsR0FBeUIsQ0FBNUIsRUFBK0I7QUFDN0IsZ0JBQVUsa0JBQWtCLFdBQVcsR0FBWCxFQUFnQixNQUFsQyxHQUEyQyxHQUEzQyxHQUFpRCxPQUFPLEdBQVAsQ0FBakQsR0FBK0QsMEJBQS9ELEdBQ1IsbUNBRFEsR0FDOEIsT0FEOUIsR0FDd0MsV0FEeEMsR0FFUiw4RkFGRjtBQUdBLGlCQUFXLE1BQVgsQ0FBa0IsWUFBbEIsRUFDSTtBQUNJLGlCQUFTLE9BRGI7QUFFSSxlQUFPLE9BQU8sR0FBUCxDQUZYO0FBR0ksZ0JBQVEsSUFIWjtBQUlJLGVBQU87QUFKWCxPQURKLEVBTU8sVUFBUyxHQUFULEVBQWE7QUFDWixZQUFJLE9BQU8sSUFBWCxFQUFpQixRQUFRLEdBQVIsQ0FBWSxpQ0FBWjtBQUN4QixPQVJEO0FBU0Q7QUFDRjs7QUFFRCxXQUFTLGtCQUFULENBQTRCLFNBQTVCLEVBQXVDO0FBQ3JDLFFBQUksV0FBVyxFQUFmO0FBQ0EseUJBQVEsU0FBUixFQUFtQixjQUFuQjtBQUNBLFdBQU8sUUFBUDs7QUFFQSxhQUFTLGNBQVQsQ0FBd0IsY0FBeEIsRUFBd0M7QUFDdEMsa0JBQVksY0FBYyxjQUFkLEtBQWlDLGNBQTdDO0FBQ0Q7QUFDRjs7QUFFSCxTQUFPLG1CQUFRLE9BQVIsRUFBUDtBQUVDIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEhpcGNoYXR0ZXIgZnJvbSAnaGlwY2hhdHRlcic7XG5pbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgeyBmb3JFYWNoIH0gZnJvbSAnbG9kYXNoJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbm90aWZ5SGlwY2hhdChwdWxsUmVxdWVzdHMpIHtcbiAgbGV0IGhpcGNoYXR0ZXIgPSBuZXcgSGlwY2hhdHRlcignWDdxUVUwWFBTak5uODZyajZlTGNaRVg0dFExcm02aG9qUDd0TEZ1cScpO1xuICBsZXQgY29sb3JzID0ge1xuICAgICcwJzogJ2dyZWVuJyxcbiAgICAnNSc6ICd5ZWxsb3cnLFxuICAgICcxMCc6ICdyZWQnICBcbiAgfTtcbiAgbGV0IGxldmVscyA9IHtcbiAgICAnMCc6ICduZXcnLFxuICAgICc1JzogJ291dHN0YW5kaW5nJyxcbiAgICAnMTAnOiAndW5hc3NpZ25lZCBvciBzdGFsZSdcbiAgfVxuICBsZXQgZ3JvdXBlZFBScyA9IHtcbiAgICAnMCc6IFtdLFxuICAgICc1JzogW10sXG4gICAgJzEwJzogW11cbiAgfVxuICBsZXQgbWVzc2FnZXMgPSB7XG4gICAgJzAnOiAnJyxcbiAgICAnNSc6ICcnLFxuICAgICcxMCc6ICcnXG4gIH1cbiAgbGV0IGdpdGh1YlVzZXJNYXAgPSB7XG4gICAgJ21tb2xkYXZhbic6ICdATWF0dE1vbGRhdmFuJyxcbiAgICAnZGVycmlja3dpbGxpYW1zJzogJ0BEZXJyaWNrVydcbiAgfVxuXG4gIHB1bGxSZXF1ZXN0cyA9IHB1bGxSZXF1ZXN0cyB8fCBbe1xuICAgICAgbGluazogJ2h0dHBzOi8vZ2l0aHViLmNvbS9jYmRyL2NiYXgtYXBwbHktcGxhdGZvcm0vcHVsbC8yNzEnLFxuICAgICAgdGl0bGU6ICdBZGQgcmVkaXJlY3QgdG8gQ0InLFxuICAgICAgaWQ6IDI3MSxcbiAgICAgIGFzc2lnbmVlczogWydkZXJyaWNrd2lsbGlhbXMnLCdtbW9sZGF2YW4nXSxcbiAgICAgIGxldmVsOiAnbm9ybWFsJ1xuICAgIH1dXG5cbiAgZm9yRWFjaChwdWxsUmVxdWVzdHMsIGdyb3VwUFJzKTtcbiAgZm9yRWFjaChtZXNzYWdlcywgc2VuZE5vdGlmY2F0aW9uKTtcblxuICBmdW5jdGlvbiBncm91cFBScyhwcikge1xuICAgIGdyb3VwZWRQUnNbcHIubGV2ZWxdLnB1c2gocHIpO1xuICAgIG1lc3NhZ2VzW3ByLmxldmVsXSArPSAnPGI+JyArcHIucmVwbyArJzogPGEgaHJlZj1cIicrIHByLmxpbmsgKydcIj4nICsgcHIudGl0bGUgKyAnPC9hPjwvYj48L2JyPjxpPkFzc2lnbmVlczogJysgcHIuYXNzaWduZWVzICsnPC9pPjxici8+J1xuICB9XG5cbiAgZnVuY3Rpb24gc2VuZE5vdGlmY2F0aW9uKG1lc3NhZ2UsIGtleSkge1xuICAgIGlmKGdyb3VwZWRQUnNba2V5XS5sZW5ndGggPiAwKSB7XG4gICAgICBtZXNzYWdlID0gJzxiPlRoZXJlIGFyZSAnICsgZ3JvdXBlZFBSc1trZXldLmxlbmd0aCArICcgJyArIGxldmVsc1trZXldICsgJyBwdWxsIHJlcXVlc3RzLjwvYj48YnIvPicgK1xuICAgICAgICAnPGJyLz48YiBzdHlsZT1cImZvbnQtc2l6ZTogMC44ZW1cIj4nICsgbWVzc2FnZSArICc8L2I+PGJyLz4nICtcbiAgICAgICAgJzxpbWcgc3JjPVwiaHR0cHM6Ly9kdWpyc3JzZ3NkM25oLmNsb3VkZnJvbnQubmV0L2ltZy9lbW90aWNvbnMvZGlzYXBwZWFyLTE0MTc3NTQ2NTBAMnguZ2lmXCIgLz4nO1xuICAgICAgaGlwY2hhdHRlci5ub3RpZnkoJ0NCQVggU2NydW0nLCBcbiAgICAgICAgICB7XG4gICAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgICAgICAgICAgIGNvbG9yOiBjb2xvcnNba2V5XSxcbiAgICAgICAgICAgICAgbm90aWZ5OiB0cnVlLFxuICAgICAgICAgICAgICB0b2tlbjogJzdiNkZsQ2ZpRmpnVmFOcGdNM1lMT0JOZUozRnhJZ1IyVHExQkMxSnAnXG4gICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgaWYgKGVyciA9PSBudWxsKSBjb25zb2xlLmxvZygnU3VjY2Vzc2Z1bGx5IG5vdGlmaWVkIHRoZSByb29tLicpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0SGlwY2hhdE1lbnRpb25zKGFzc2lnbmVlcykge1xuICAgIGxldCBtZW50aW9ucyA9ICcnO1xuICAgIGZvckVhY2goYXNzaWduZWVzLCBnZXRIaXBDaGF0VXNlcilcbiAgICByZXR1cm4gbWVudGlvbnM7XG5cbiAgICBmdW5jdGlvbiBnZXRIaXBDaGF0VXNlcihnaXRodWJVc2VybmFtZSkge1xuICAgICAgbWVudGlvbnMgKz0gZ2l0aHViVXNlck1hcFtnaXRodWJVc2VybmFtZV0gfHwgZ2l0aHViVXNlcm5hbWU7XG4gICAgfVxuICB9XG5cbnJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblxufSJdfQ==