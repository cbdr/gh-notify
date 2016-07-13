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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ub3RpZnkvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7a0JBSXdCLGE7O0FBSnhCOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVlLFNBQVMsYUFBVCxDQUF1QixZQUF2QixFQUFxQztBQUNsRCxNQUFJLGFBQWEseUJBQWUsMENBQWYsQ0FBakI7QUFDQSxNQUFJLFNBQVM7QUFDWCxTQUFLLE9BRE07QUFFWCxTQUFLLFFBRk07QUFHWCxVQUFNO0FBSEssR0FBYjtBQUtBLE1BQUksU0FBUztBQUNYLFNBQUssS0FETTtBQUVYLFNBQUssYUFGTTtBQUdYLFVBQU07QUFISyxHQUFiO0FBS0EsTUFBSSxhQUFhO0FBQ2YsU0FBSyxFQURVO0FBRWYsU0FBSyxFQUZVO0FBR2YsVUFBTTtBQUhTLEdBQWpCO0FBS0EsTUFBSSxXQUFXO0FBQ2IsU0FBSyxFQURRO0FBRWIsU0FBSyxFQUZRO0FBR2IsVUFBTTtBQUhPLEdBQWY7O0FBTUEsaUJBQWUsZ0JBQWdCLENBQUM7QUFDNUIsVUFBTSxzREFEc0I7QUFFNUIsV0FBTyxvQkFGcUI7QUFHNUIsUUFBSSxHQUh3QjtBQUk1QixlQUFXLENBQUMsaUJBQUQsRUFBbUIsV0FBbkIsQ0FKaUI7QUFLNUIsV0FBTztBQUxxQixHQUFELENBQS9COztBQVFBLHVCQUFRLFlBQVIsRUFBc0IsUUFBdEI7QUFDQSx1QkFBUSxRQUFSLEVBQWtCLGVBQWxCOztBQUVBLFdBQVMsUUFBVCxDQUFrQixFQUFsQixFQUFzQjtBQUNwQixlQUFXLEdBQUcsS0FBZCxFQUFxQixJQUFyQixDQUEwQixFQUExQjtBQUNBLGFBQVMsR0FBRyxLQUFaLEtBQXNCLFFBQU8sR0FBRyxJQUFWLEdBQWdCLGFBQWhCLEdBQStCLEdBQUcsSUFBbEMsR0FBd0MsSUFBeEMsR0FBK0MsR0FBRyxLQUFsRCxHQUEwRCw2QkFBMUQsR0FBd0YsR0FBRyxTQUEzRixHQUFxRyxXQUEzSDtBQUNEOztBQUVELFdBQVMsZUFBVCxDQUF5QixPQUF6QixFQUFrQyxHQUFsQyxFQUF1QztBQUNyQyxRQUFHLFdBQVcsR0FBWCxFQUFnQixNQUFoQixHQUF5QixDQUE1QixFQUErQjtBQUM3QixnQkFBVSxrQkFBa0IsV0FBVyxHQUFYLEVBQWdCLE1BQWxDLEdBQTJDLEdBQTNDLEdBQWlELE9BQU8sR0FBUCxDQUFqRCxHQUErRCwrQkFBL0QsR0FBaUcsT0FBM0c7QUFDQSxpQkFBVyxNQUFYLENBQWtCLFlBQWxCLEVBQ0k7QUFDSSxpQkFBUyxPQURiO0FBRUksZUFBTyxPQUFPLEdBQVAsQ0FGWDtBQUdJLGdCQUFRLElBSFo7QUFJSSxlQUFPO0FBSlgsT0FESixFQU1PLFVBQVMsR0FBVCxFQUFhO0FBQ1osWUFBSSxPQUFPLElBQVgsRUFBaUIsUUFBUSxHQUFSLENBQVksaUNBQVo7QUFDeEIsT0FSRDtBQVNEO0FBQ0Y7O0FBRUgsU0FBTyxtQkFBUSxPQUFSLEVBQVA7QUFFQyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBIaXBjaGF0dGVyIGZyb20gJ2hpcGNoYXR0ZXInO1xuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IHsgZm9yRWFjaCB9IGZyb20gJ2xvZGFzaCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG5vdGlmeUhpcGNoYXQocHVsbFJlcXVlc3RzKSB7XG4gIGxldCBoaXBjaGF0dGVyID0gbmV3IEhpcGNoYXR0ZXIoJ1g3cVFVMFhQU2pObjg2cmo2ZUxjWkVYNHRRMXJtNmhvalA3dExGdXEnKTtcbiAgbGV0IGNvbG9ycyA9IHtcbiAgICAnMCc6ICdncmVlbicsXG4gICAgJzUnOiAneWVsbG93JyxcbiAgICAnMTAnOiAncmVkJyAgXG4gIH07XG4gIGxldCBsZXZlbHMgPSB7XG4gICAgJzAnOiAnbmV3JyxcbiAgICAnNSc6ICdvdXRzdGFuZGluZycsXG4gICAgJzEwJzogJ3VuYXNzaWduZWQgb3Igc3RhbGUnXG4gIH1cbiAgbGV0IGdyb3VwZWRQUnMgPSB7XG4gICAgJzAnOiBbXSxcbiAgICAnNSc6IFtdLFxuICAgICcxMCc6IFtdXG4gIH1cbiAgbGV0IG1lc3NhZ2VzID0ge1xuICAgICcwJzogJycsXG4gICAgJzUnOiAnJyxcbiAgICAnMTAnOiAnJ1xuICB9XG5cbiAgcHVsbFJlcXVlc3RzID0gcHVsbFJlcXVlc3RzIHx8IFt7XG4gICAgICBsaW5rOiAnaHR0cHM6Ly9naXRodWIuY29tL2NiZHIvY2JheC1hcHBseS1wbGF0Zm9ybS9wdWxsLzI3MScsXG4gICAgICB0aXRsZTogJ0FkZCByZWRpcmVjdCB0byBDQicsXG4gICAgICBpZDogMjcxLFxuICAgICAgYXNzaWduZWVzOiBbJ2RlcnJpY2t3aWxsaWFtcycsJ21tb2xkYXZhbiddLFxuICAgICAgbGV2ZWw6ICdub3JtYWwnXG4gICAgfV1cblxuICBmb3JFYWNoKHB1bGxSZXF1ZXN0cywgZ3JvdXBQUnMpO1xuICBmb3JFYWNoKG1lc3NhZ2VzLCBzZW5kTm90aWZjYXRpb24pO1xuXG4gIGZ1bmN0aW9uIGdyb3VwUFJzKHByKSB7XG4gICAgZ3JvdXBlZFBSc1twci5sZXZlbF0ucHVzaChwcik7XG4gICAgbWVzc2FnZXNbcHIubGV2ZWxdICs9ICc8Yj4nICtwci5yZXBvICsnOiA8YSBocmVmPVwiJysgcHIubGluayArJ1wiPicgKyBwci50aXRsZSArICc8L2E+PC9iPjwvYnI+PGk+QXNzaWduZWVzOiAnK3ByLmFzc2lnbmVlcysnPC9pPjxici8+J1xuICB9XG5cbiAgZnVuY3Rpb24gc2VuZE5vdGlmY2F0aW9uKG1lc3NhZ2UsIGtleSkge1xuICAgIGlmKGdyb3VwZWRQUnNba2V5XS5sZW5ndGggPiAwKSB7XG4gICAgICBtZXNzYWdlID0gJzxiPlRoZXJlIGFyZSAnICsgZ3JvdXBlZFBSc1trZXldLmxlbmd0aCArICcgJyArIGxldmVsc1trZXldICsgJyBwdWxsIHJlcXVlc3RzLjwvYj48YnIvPjxici8+JyArIG1lc3NhZ2VcbiAgICAgIGhpcGNoYXR0ZXIubm90aWZ5KCdDQkFYIFNjcnVtJywgXG4gICAgICAgICAge1xuICAgICAgICAgICAgICBtZXNzYWdlOiBtZXNzYWdlLFxuICAgICAgICAgICAgICBjb2xvcjogY29sb3JzW2tleV0sXG4gICAgICAgICAgICAgIG5vdGlmeTogdHJ1ZSxcbiAgICAgICAgICAgICAgdG9rZW46ICc3YjZGbENmaUZqZ1ZhTnBnTTNZTE9CTmVKM0Z4SWdSMlRxMUJDMUpwJ1xuICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycil7XG4gICAgICAgICAgICAgIGlmIChlcnIgPT0gbnVsbCkgY29uc29sZS5sb2coJ1N1Y2Nlc3NmdWxseSBub3RpZmllZCB0aGUgcm9vbS4nKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG5yZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG5cbn0iXX0=