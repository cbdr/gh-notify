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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ub3RpZnkvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7a0JBSXdCLGE7O0FBSnhCOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVlLFNBQVMsYUFBVCxDQUF1QixZQUF2QixFQUFxQztBQUNsRCxNQUFJLGFBQWEseUJBQWUsMENBQWYsQ0FBakI7QUFDQSxNQUFJLFNBQVM7QUFDWCxTQUFLLE9BRE07QUFFWCxTQUFLLFFBRk07QUFHWCxVQUFNO0FBSEssR0FBYjtBQUtBLE1BQUksU0FBUztBQUNYLFNBQUssS0FETTtBQUVYLFNBQUssYUFGTTtBQUdYLFVBQU07QUFISyxHQUFiO0FBS0EsTUFBSSxhQUFhO0FBQ2YsU0FBSyxFQURVO0FBRWYsU0FBSyxFQUZVO0FBR2YsVUFBTTtBQUhTLEdBQWpCO0FBS0EsTUFBSSxXQUFXO0FBQ2IsU0FBSyxFQURRO0FBRWIsU0FBSyxFQUZRO0FBR2IsVUFBTTtBQUhPLEdBQWY7QUFLQSxNQUFJLGdCQUFnQjtBQUNsQixpQkFBYSxlQURLO0FBRWxCLHVCQUFtQjtBQUZELEdBQXBCOztBQUtBLGlCQUFlLGdCQUFnQixDQUFDO0FBQzVCLFVBQU0sc0RBRHNCO0FBRTVCLFdBQU8sb0JBRnFCO0FBRzVCLFFBQUksR0FId0I7QUFJNUIsZUFBVyxDQUFDLGlCQUFELEVBQW1CLFdBQW5CLENBSmlCO0FBSzVCLFdBQU87QUFMcUIsR0FBRCxDQUEvQjs7QUFRQSx1QkFBUSxZQUFSLEVBQXNCLFFBQXRCO0FBQ0EsdUJBQVEsUUFBUixFQUFrQixlQUFsQjs7QUFFQSxXQUFTLFFBQVQsQ0FBa0IsRUFBbEIsRUFBc0I7QUFDcEIsZUFBVyxHQUFHLEtBQWQsRUFBcUIsSUFBckIsQ0FBMEIsRUFBMUI7QUFDQSxhQUFTLEdBQUcsS0FBWixLQUFzQixRQUFPLEdBQUcsSUFBVixHQUFnQixhQUFoQixHQUErQixHQUFHLElBQWxDLEdBQXdDLElBQXhDLEdBQStDLEdBQUcsS0FBbEQsR0FBMEQsNkJBQTFELEdBQXlGLEdBQUcsU0FBNUYsR0FBdUcsV0FBN0g7QUFDRDs7QUFFRCxXQUFTLGVBQVQsQ0FBeUIsT0FBekIsRUFBa0MsR0FBbEMsRUFBdUM7QUFDckMsUUFBRyxXQUFXLEdBQVgsRUFBZ0IsTUFBaEIsR0FBeUIsQ0FBNUIsRUFBK0I7QUFDN0IsZ0JBQVUsa0JBQWtCLFdBQVcsR0FBWCxFQUFnQixNQUFsQyxHQUEyQyxHQUEzQyxHQUFpRCxPQUFPLEdBQVAsQ0FBakQsR0FBK0QsMEJBQS9ELEdBQ1IsT0FEUSxHQUNFLE9BREYsR0FDWSxPQURaLEdBRVIsOEZBRkY7QUFHQSxpQkFBVyxNQUFYLENBQWtCLFlBQWxCLEVBQ0k7QUFDSSxpQkFBUyxPQURiO0FBRUksZUFBTyxPQUFPLEdBQVAsQ0FGWDtBQUdJLGdCQUFRLElBSFo7QUFJSSxlQUFPO0FBSlgsT0FESixFQU1PLFVBQVMsR0FBVCxFQUFhO0FBQ1osWUFBSSxPQUFPLElBQVgsRUFBaUIsUUFBUSxHQUFSLENBQVksaUNBQVo7QUFDeEIsT0FSRDtBQVNEO0FBQ0Y7O0FBRUQsV0FBUyxrQkFBVCxDQUE0QixTQUE1QixFQUF1QztBQUNyQyxRQUFJLFdBQVcsRUFBZjtBQUNBLHlCQUFRLFNBQVIsRUFBbUIsY0FBbkI7QUFDQSxXQUFPLFFBQVA7O0FBRUEsYUFBUyxjQUFULENBQXdCLGNBQXhCLEVBQXdDO0FBQ3RDLGtCQUFZLGNBQWMsY0FBZCxLQUFpQyxjQUE3QztBQUNEO0FBQ0Y7O0FBRUgsU0FBTyxtQkFBUSxPQUFSLEVBQVA7QUFFQyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBIaXBjaGF0dGVyIGZyb20gJ2hpcGNoYXR0ZXInO1xuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IHsgZm9yRWFjaCB9IGZyb20gJ2xvZGFzaCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG5vdGlmeUhpcGNoYXQocHVsbFJlcXVlc3RzKSB7XG4gIGxldCBoaXBjaGF0dGVyID0gbmV3IEhpcGNoYXR0ZXIoJ1g3cVFVMFhQU2pObjg2cmo2ZUxjWkVYNHRRMXJtNmhvalA3dExGdXEnKTtcbiAgbGV0IGNvbG9ycyA9IHtcbiAgICAnMCc6ICdncmVlbicsXG4gICAgJzUnOiAneWVsbG93JyxcbiAgICAnMTAnOiAncmVkJ1xuICB9O1xuICBsZXQgbGV2ZWxzID0ge1xuICAgICcwJzogJ25ldycsXG4gICAgJzUnOiAnb3V0c3RhbmRpbmcnLFxuICAgICcxMCc6ICd1bmFzc2lnbmVkIG9yIHN0YWxlJ1xuICB9XG4gIGxldCBncm91cGVkUFJzID0ge1xuICAgICcwJzogW10sXG4gICAgJzUnOiBbXSxcbiAgICAnMTAnOiBbXVxuICB9XG4gIGxldCBtZXNzYWdlcyA9IHtcbiAgICAnMCc6ICcnLFxuICAgICc1JzogJycsXG4gICAgJzEwJzogJydcbiAgfVxuICBsZXQgZ2l0aHViVXNlck1hcCA9IHtcbiAgICAnbW1vbGRhdmFuJzogJ0BNYXR0TW9sZGF2YW4nLFxuICAgICdkZXJyaWNrd2lsbGlhbXMnOiAnQERlcnJpY2tXJ1xuICB9XG5cbiAgcHVsbFJlcXVlc3RzID0gcHVsbFJlcXVlc3RzIHx8IFt7XG4gICAgICBsaW5rOiAnaHR0cHM6Ly9naXRodWIuY29tL2NiZHIvY2JheC1hcHBseS1wbGF0Zm9ybS9wdWxsLzI3MScsXG4gICAgICB0aXRsZTogJ0FkZCByZWRpcmVjdCB0byBDQicsXG4gICAgICBpZDogMjcxLFxuICAgICAgYXNzaWduZWVzOiBbJ2RlcnJpY2t3aWxsaWFtcycsJ21tb2xkYXZhbiddLFxuICAgICAgbGV2ZWw6ICdub3JtYWwnXG4gICAgfV1cblxuICBmb3JFYWNoKHB1bGxSZXF1ZXN0cywgZ3JvdXBQUnMpO1xuICBmb3JFYWNoKG1lc3NhZ2VzLCBzZW5kTm90aWZjYXRpb24pO1xuXG4gIGZ1bmN0aW9uIGdyb3VwUFJzKHByKSB7XG4gICAgZ3JvdXBlZFBSc1twci5sZXZlbF0ucHVzaChwcik7XG4gICAgbWVzc2FnZXNbcHIubGV2ZWxdICs9ICc8Yj4nICtwci5yZXBvICsnOiA8YSBocmVmPVwiJysgcHIubGluayArJ1wiPicgKyBwci50aXRsZSArICc8L2E+PC9iPjwvYnI+PGk+QXNzaWduZWVzOiAnKyBwci5hc3NpZ25lZXMgKyc8L2k+PGJyLz4nXG4gIH1cblxuICBmdW5jdGlvbiBzZW5kTm90aWZjYXRpb24obWVzc2FnZSwga2V5KSB7XG4gICAgaWYoZ3JvdXBlZFBSc1trZXldLmxlbmd0aCA+IDApIHtcbiAgICAgIG1lc3NhZ2UgPSAnPGI+VGhlcmUgYXJlICcgKyBncm91cGVkUFJzW2tleV0ubGVuZ3RoICsgJyAnICsgbGV2ZWxzW2tleV0gKyAnIHB1bGwgcmVxdWVzdHMuPC9iPjxici8+JyArXG4gICAgICAgICc8YnIvPicgKyBtZXNzYWdlICsgJzxici8+JyArXG4gICAgICAgICc8aW1nIHNyYz1cImh0dHBzOi8vZHVqcnNyc2dzZDNuaC5jbG91ZGZyb250Lm5ldC9pbWcvZW1vdGljb25zL2Rpc2FwcGVhci0xNDE3NzU0NjUwQDJ4LmdpZlwiIC8+JztcbiAgICAgIGhpcGNoYXR0ZXIubm90aWZ5KCdDQkFYIFNjcnVtJyxcbiAgICAgICAgICB7XG4gICAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgICAgICAgICAgIGNvbG9yOiBjb2xvcnNba2V5XSxcbiAgICAgICAgICAgICAgbm90aWZ5OiB0cnVlLFxuICAgICAgICAgICAgICB0b2tlbjogJzdiNkZsQ2ZpRmpnVmFOcGdNM1lMT0JOZUozRnhJZ1IyVHExQkMxSnAnXG4gICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgaWYgKGVyciA9PSBudWxsKSBjb25zb2xlLmxvZygnU3VjY2Vzc2Z1bGx5IG5vdGlmaWVkIHRoZSByb29tLicpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0SGlwY2hhdE1lbnRpb25zKGFzc2lnbmVlcykge1xuICAgIGxldCBtZW50aW9ucyA9ICcnO1xuICAgIGZvckVhY2goYXNzaWduZWVzLCBnZXRIaXBDaGF0VXNlcilcbiAgICByZXR1cm4gbWVudGlvbnM7XG5cbiAgICBmdW5jdGlvbiBnZXRIaXBDaGF0VXNlcihnaXRodWJVc2VybmFtZSkge1xuICAgICAgbWVudGlvbnMgKz0gZ2l0aHViVXNlck1hcFtnaXRodWJVc2VybmFtZV0gfHwgZ2l0aHViVXNlcm5hbWU7XG4gICAgfVxuICB9XG5cbnJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblxufSJdfQ==