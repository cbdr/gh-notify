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
      // <<<<<<< a8e928d95ca38dddf1cbe41ce25e2a984cb6653e
      //       message = '<b>There are ' + groupedPRs[key].length + ' ' + levels[key] + ' pull requests.</b><br/>' +
      //         '<br/>' + message + '<br/>' +
      //         '<img src="https://dujrsrsgsd3nh.cloudfront.net/img/emoticons/disappear-1417754650@2x.gif" />';
      //       hipchatter.notify('CBAX Scrum',
      // =======
      message = '<b>There are ' + groupedPRs[key].length + ' ' + levels[key] + ' pull requests.</b><br/><br/>' + message;
      hipchatter.notify('CBAX Scrum',
      // >>>>>>> Here ya go!
      {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ub3RpZnkvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7a0JBSXdCLGE7O0FBSnhCOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVlLFNBQVMsYUFBVCxDQUF1QixZQUF2QixFQUFxQztBQUNsRCxNQUFJLGFBQWEseUJBQWUsMENBQWYsQ0FBakI7QUFDQSxNQUFJLFNBQVM7QUFDWCxTQUFLLE9BRE07QUFFWCxTQUFLLFFBRk07QUFHWCxVQUFNO0FBSEssR0FBYjtBQUtBLE1BQUksU0FBUztBQUNYLFNBQUssS0FETTtBQUVYLFNBQUssYUFGTTtBQUdYLFVBQU07QUFISyxHQUFiO0FBS0EsTUFBSSxhQUFhO0FBQ2YsU0FBSyxFQURVO0FBRWYsU0FBSyxFQUZVO0FBR2YsVUFBTTtBQUhTLEdBQWpCO0FBS0EsTUFBSSxXQUFXO0FBQ2IsU0FBSyxFQURRO0FBRWIsU0FBSyxFQUZRO0FBR2IsVUFBTTtBQUhPLEdBQWY7QUFLQSxNQUFJLGdCQUFnQjtBQUNsQixpQkFBYSxlQURLO0FBRWxCLHVCQUFtQjtBQUZELEdBQXBCOztBQUtBLGlCQUFlLGdCQUFnQixDQUFDO0FBQzVCLFVBQU0sc0RBRHNCO0FBRTVCLFdBQU8sb0JBRnFCO0FBRzVCLFFBQUksR0FId0I7QUFJNUIsZUFBVyxDQUFDLGlCQUFELEVBQW1CLFdBQW5CLENBSmlCO0FBSzVCLFdBQU87QUFMcUIsR0FBRCxDQUEvQjs7QUFRQSx1QkFBUSxZQUFSLEVBQXNCLFFBQXRCO0FBQ0EsdUJBQVEsUUFBUixFQUFrQixlQUFsQjs7QUFFQSxXQUFTLFFBQVQsQ0FBa0IsRUFBbEIsRUFBc0I7QUFDcEIsZUFBVyxHQUFHLEtBQWQsRUFBcUIsSUFBckIsQ0FBMEIsRUFBMUI7QUFDQSxhQUFTLEdBQUcsS0FBWixLQUFzQixRQUFPLEdBQUcsSUFBVixHQUFnQixhQUFoQixHQUErQixHQUFHLElBQWxDLEdBQXdDLElBQXhDLEdBQStDLEdBQUcsS0FBbEQsR0FBMEQsNkJBQTFELEdBQXlGLEdBQUcsU0FBNUYsR0FBdUcsV0FBN0g7QUFDRDs7QUFFRCxXQUFTLGVBQVQsQ0FBeUIsT0FBekIsRUFBa0MsR0FBbEMsRUFBdUM7QUFDckMsUUFBRyxXQUFXLEdBQVgsRUFBZ0IsTUFBaEIsR0FBeUIsQ0FBNUIsRUFBK0I7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ00sZ0JBQVUsa0JBQWtCLFdBQVcsR0FBWCxFQUFnQixNQUFsQyxHQUEyQyxHQUEzQyxHQUFpRCxPQUFPLEdBQVAsQ0FBakQsR0FBK0QsK0JBQS9ELEdBQWlHLE9BQTNHO0FBQ0EsaUJBQVcsTUFBWCxDQUFrQixZQUFsQjtBQUNOO0FBQ1U7QUFDSSxpQkFBUyxPQURiO0FBRUksZUFBTyxPQUFPLEdBQVAsQ0FGWDtBQUdJLGdCQUFRLElBSFo7QUFJSSxlQUFPO0FBSlgsT0FGSixFQU9PLFVBQVMsR0FBVCxFQUFhO0FBQ1osWUFBSSxPQUFPLElBQVgsRUFBaUIsUUFBUSxHQUFSLENBQVksaUNBQVo7QUFDeEIsT0FURDtBQVVEO0FBQ0Y7O0FBRUQsV0FBUyxrQkFBVCxDQUE0QixTQUE1QixFQUF1QztBQUNyQyxRQUFJLFdBQVcsRUFBZjtBQUNBLHlCQUFRLFNBQVIsRUFBbUIsY0FBbkI7QUFDQSxXQUFPLFFBQVA7O0FBRUEsYUFBUyxjQUFULENBQXdCLGNBQXhCLEVBQXdDO0FBQ3RDLGtCQUFZLGNBQWMsY0FBZCxLQUFpQyxjQUE3QztBQUNEO0FBQ0Y7O0FBRUgsU0FBTyxtQkFBUSxPQUFSLEVBQVA7QUFFQyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBIaXBjaGF0dGVyIGZyb20gJ2hpcGNoYXR0ZXInO1xuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IHsgZm9yRWFjaCB9IGZyb20gJ2xvZGFzaCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG5vdGlmeUhpcGNoYXQocHVsbFJlcXVlc3RzKSB7XG4gIGxldCBoaXBjaGF0dGVyID0gbmV3IEhpcGNoYXR0ZXIoJ1g3cVFVMFhQU2pObjg2cmo2ZUxjWkVYNHRRMXJtNmhvalA3dExGdXEnKTtcbiAgbGV0IGNvbG9ycyA9IHtcbiAgICAnMCc6ICdncmVlbicsXG4gICAgJzUnOiAneWVsbG93JyxcbiAgICAnMTAnOiAncmVkJ1xuICB9O1xuICBsZXQgbGV2ZWxzID0ge1xuICAgICcwJzogJ25ldycsXG4gICAgJzUnOiAnb3V0c3RhbmRpbmcnLFxuICAgICcxMCc6ICd1bmFzc2lnbmVkIG9yIHN0YWxlJ1xuICB9XG4gIGxldCBncm91cGVkUFJzID0ge1xuICAgICcwJzogW10sXG4gICAgJzUnOiBbXSxcbiAgICAnMTAnOiBbXVxuICB9XG4gIGxldCBtZXNzYWdlcyA9IHtcbiAgICAnMCc6ICcnLFxuICAgICc1JzogJycsXG4gICAgJzEwJzogJydcbiAgfVxuICBsZXQgZ2l0aHViVXNlck1hcCA9IHtcbiAgICAnbW1vbGRhdmFuJzogJ0BNYXR0TW9sZGF2YW4nLFxuICAgICdkZXJyaWNrd2lsbGlhbXMnOiAnQERlcnJpY2tXJ1xuICB9XG5cbiAgcHVsbFJlcXVlc3RzID0gcHVsbFJlcXVlc3RzIHx8IFt7XG4gICAgICBsaW5rOiAnaHR0cHM6Ly9naXRodWIuY29tL2NiZHIvY2JheC1hcHBseS1wbGF0Zm9ybS9wdWxsLzI3MScsXG4gICAgICB0aXRsZTogJ0FkZCByZWRpcmVjdCB0byBDQicsXG4gICAgICBpZDogMjcxLFxuICAgICAgYXNzaWduZWVzOiBbJ2RlcnJpY2t3aWxsaWFtcycsJ21tb2xkYXZhbiddLFxuICAgICAgbGV2ZWw6ICdub3JtYWwnXG4gICAgfV1cblxuICBmb3JFYWNoKHB1bGxSZXF1ZXN0cywgZ3JvdXBQUnMpO1xuICBmb3JFYWNoKG1lc3NhZ2VzLCBzZW5kTm90aWZjYXRpb24pO1xuXG4gIGZ1bmN0aW9uIGdyb3VwUFJzKHByKSB7XG4gICAgZ3JvdXBlZFBSc1twci5sZXZlbF0ucHVzaChwcik7XG4gICAgbWVzc2FnZXNbcHIubGV2ZWxdICs9ICc8Yj4nICtwci5yZXBvICsnOiA8YSBocmVmPVwiJysgcHIubGluayArJ1wiPicgKyBwci50aXRsZSArICc8L2E+PC9iPjwvYnI+PGk+QXNzaWduZWVzOiAnKyBwci5hc3NpZ25lZXMgKyc8L2k+PGJyLz4nXG4gIH1cblxuICBmdW5jdGlvbiBzZW5kTm90aWZjYXRpb24obWVzc2FnZSwga2V5KSB7XG4gICAgaWYoZ3JvdXBlZFBSc1trZXldLmxlbmd0aCA+IDApIHtcbi8vIDw8PDw8PDwgYThlOTI4ZDk1Y2EzOGRkZGYxY2JlNDFjZTI1ZTJhOTg0Y2I2NjUzZVxuLy8gICAgICAgbWVzc2FnZSA9ICc8Yj5UaGVyZSBhcmUgJyArIGdyb3VwZWRQUnNba2V5XS5sZW5ndGggKyAnICcgKyBsZXZlbHNba2V5XSArICcgcHVsbCByZXF1ZXN0cy48L2I+PGJyLz4nICtcbi8vICAgICAgICAgJzxici8+JyArIG1lc3NhZ2UgKyAnPGJyLz4nICtcbi8vICAgICAgICAgJzxpbWcgc3JjPVwiaHR0cHM6Ly9kdWpyc3JzZ3NkM25oLmNsb3VkZnJvbnQubmV0L2ltZy9lbW90aWNvbnMvZGlzYXBwZWFyLTE0MTc3NTQ2NTBAMnguZ2lmXCIgLz4nO1xuLy8gICAgICAgaGlwY2hhdHRlci5ub3RpZnkoJ0NCQVggU2NydW0nLFxuLy8gPT09PT09PVxuICAgICAgbWVzc2FnZSA9ICc8Yj5UaGVyZSBhcmUgJyArIGdyb3VwZWRQUnNba2V5XS5sZW5ndGggKyAnICcgKyBsZXZlbHNba2V5XSArICcgcHVsbCByZXF1ZXN0cy48L2I+PGJyLz48YnIvPicgKyBtZXNzYWdlXG4gICAgICBoaXBjaGF0dGVyLm5vdGlmeSgnQ0JBWCBTY3J1bScsXG4vLyA+Pj4+Pj4+IEhlcmUgeWEgZ28hXG4gICAgICAgICAge1xuICAgICAgICAgICAgICBtZXNzYWdlOiBtZXNzYWdlLFxuICAgICAgICAgICAgICBjb2xvcjogY29sb3JzW2tleV0sXG4gICAgICAgICAgICAgIG5vdGlmeTogdHJ1ZSxcbiAgICAgICAgICAgICAgdG9rZW46ICc3YjZGbENmaUZqZ1ZhTnBnTTNZTE9CTmVKM0Z4SWdSMlRxMUJDMUpwJ1xuICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycil7XG4gICAgICAgICAgICAgIGlmIChlcnIgPT0gbnVsbCkgY29uc29sZS5sb2coJ1N1Y2Nlc3NmdWxseSBub3RpZmllZCB0aGUgcm9vbS4nKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEhpcGNoYXRNZW50aW9ucyhhc3NpZ25lZXMpIHtcbiAgICBsZXQgbWVudGlvbnMgPSAnJztcbiAgICBmb3JFYWNoKGFzc2lnbmVlcywgZ2V0SGlwQ2hhdFVzZXIpXG4gICAgcmV0dXJuIG1lbnRpb25zO1xuXG4gICAgZnVuY3Rpb24gZ2V0SGlwQ2hhdFVzZXIoZ2l0aHViVXNlcm5hbWUpIHtcbiAgICAgIG1lbnRpb25zICs9IGdpdGh1YlVzZXJNYXBbZ2l0aHViVXNlcm5hbWVdIHx8IGdpdGh1YlVzZXJuYW1lO1xuICAgIH1cbiAgfVxuXG5yZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG5cbn0iXX0=