'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = processPRs;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _retrieve = require('../retrieve');

var _retrieve2 = _interopRequireDefault(_retrieve);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var oneDay = 24 * 60 * 60 * 1000;

function processPRs() {
  var repo = arguments.length <= 0 || arguments[0] === undefined ? { repo: 'cbax-' } : arguments[0];

  return (0, _retrieve2.default)(repo).then(function (repos) {
    return _lodash2.default.filter(repos, function (r) {
      return r.pullRequests.length > 0;
    });
  }).then(function (repos) {
    return _lodash2.default.map(repos, mapPRs);
  }).then(function (PRs) {
    return _lodash2.default.flatten(PRs);
  });
  //.tap(console.log);
}

function mapPRs(repo) {
  return _lodash2.default.map(repo.pullRequests, function (PR) {

    PR.repo = repo.name;
    PR.owner = PR.owner.login;
    PR.link = PR.url;
    PR.timeOpen = (new Date() - new Date(PR.created)) / oneDay;
    PR.workingDays = getWorkingDaysSince(PR.created);
    PR.timeSinceLastModified = (new Date() - new Date(PR.updated)) / oneDay;

    PR.assignees = _lodash2.default.map(PR.assignees, function (assignee) {
      return assignee.login;
    });
    PR.level = getLevel(PR);

    PR = prune(PR);

    return PR;
  });
}

function getWorkingDaysSince(date) {
  var start = new Date(date);
  var end = new Date();

  var days = 0;
  var currentDay = start;

  while (currentDay < end) {
    currentDay = new Date(currentDay);
    if (currentDay.getDay() != 0 && currentDay.getDay() != 6) {
      days++;
    }
    currentDay = new Date(currentDay.getTime() + oneDay);
  }

  return days;
}

function getLevel(PR) {
  PR.comments = _lodash2.default.filter(PR.comments, function (comment) {
    if (comment.user.login !== PR.owner) {
      return true;
    }
  });
  var hasLabels = PR.labels.length > 0;
  var noComments = PR.comments.length === 0;
  if ((PR.assignees.length === 0 || PR.workingDays >= 4) && !hasLabels) {
    return 10; //red: no assignees or stale
  }
  if ((PR.workingDays >= 2 || PR.workingDays > 1 && noComments) && !hasLabels) {
    return 5; //yellow going stale (outstanding > 2 days or no comments from assignees yet && older than 16 hours)
  }
  return 0; //green
}

function prune(PR) {
  var fieldsToRemove = ['id', 'number', 'url', 'comments', 'created', 'updated', 'timeOpen', 'timeSinceLastModified'];

  return _lodash2.default.omit(PR, fieldsToRemove);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wcm9jZXNzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O2tCQU93QixVOztBQVB4Qjs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBSSxTQUFTLEtBQUssRUFBTCxHQUFVLEVBQVYsR0FBZSxJQUE1Qjs7QUFFZSxTQUFTLFVBQVQsR0FBOEM7QUFBQSxNQUExQixJQUEwQix5REFBbkIsRUFBRSxNQUFNLE9BQVIsRUFBbUI7O0FBQzNELFNBQU8sd0JBQWdCLElBQWhCLEVBQ0osSUFESSxDQUNDLFVBQUMsS0FBRDtBQUFBLFdBQVcsaUJBQUUsTUFBRixDQUFTLEtBQVQsRUFBZ0IsVUFBQyxDQUFEO0FBQUEsYUFBTyxFQUFFLFlBQUYsQ0FBZSxNQUFmLEdBQXdCLENBQS9CO0FBQUEsS0FBaEIsQ0FBWDtBQUFBLEdBREQsRUFFSixJQUZJLENBRUMsVUFBQyxLQUFEO0FBQUEsV0FBVyxpQkFBRSxHQUFGLENBQU0sS0FBTixFQUFhLE1BQWIsQ0FBWDtBQUFBLEdBRkQsRUFHSixJQUhJLENBR0MsVUFBQyxHQUFEO0FBQUEsV0FBUyxpQkFBRSxPQUFGLENBQVUsR0FBVixDQUFUO0FBQUEsR0FIRCxDQUFQOztBQUtEOztBQUVELFNBQVMsTUFBVCxDQUFnQixJQUFoQixFQUFzQjtBQUNwQixTQUFPLGlCQUFFLEdBQUYsQ0FBTSxLQUFLLFlBQVgsRUFBeUIsVUFBQyxFQUFELEVBQVE7O0FBRXRDLE9BQUcsSUFBSCxHQUFVLEtBQUssSUFBZjtBQUNBLE9BQUcsS0FBSCxHQUFXLEdBQUcsS0FBSCxDQUFTLEtBQXBCO0FBQ0EsT0FBRyxJQUFILEdBQVUsR0FBRyxHQUFiO0FBQ0EsT0FBRyxRQUFILEdBQWMsQ0FBQyxJQUFJLElBQUosS0FBYSxJQUFJLElBQUosQ0FBUyxHQUFHLE9BQVosQ0FBZCxJQUFzQyxNQUFwRDtBQUNBLE9BQUcsV0FBSCxHQUFpQixvQkFBb0IsR0FBRyxPQUF2QixDQUFqQjtBQUNBLE9BQUcscUJBQUgsR0FBMkIsQ0FBQyxJQUFJLElBQUosS0FBYSxJQUFJLElBQUosQ0FBUyxHQUFHLE9BQVosQ0FBZCxJQUFzQyxNQUFqRTs7QUFFQSxPQUFHLFNBQUgsR0FBZSxpQkFBRSxHQUFGLENBQU0sR0FBRyxTQUFULEVBQW9CLFVBQUMsUUFBRDtBQUFBLGFBQWMsU0FBUyxLQUF2QjtBQUFBLEtBQXBCLENBQWY7QUFDQSxPQUFHLEtBQUgsR0FBVyxTQUFTLEVBQVQsQ0FBWDs7QUFFQSxTQUFLLE1BQU0sRUFBTixDQUFMOztBQUVBLFdBQU8sRUFBUDtBQUNELEdBZk0sQ0FBUDtBQWdCRDs7QUFFRCxTQUFTLG1CQUFULENBQTZCLElBQTdCLEVBQW1DO0FBQ2pDLE1BQU0sUUFBUSxJQUFJLElBQUosQ0FBUyxJQUFULENBQWQ7QUFDQSxNQUFNLE1BQU0sSUFBSSxJQUFKLEVBQVo7O0FBRUEsTUFBSSxPQUFPLENBQVg7QUFDQSxNQUFJLGFBQWEsS0FBakI7O0FBRUEsU0FBTSxhQUFhLEdBQW5CLEVBQXdCO0FBQ3RCLGlCQUFhLElBQUksSUFBSixDQUFTLFVBQVQsQ0FBYjtBQUNBLFFBQUcsV0FBVyxNQUFYLE1BQXVCLENBQXZCLElBQTRCLFdBQVcsTUFBWCxNQUF1QixDQUF0RCxFQUF5RDtBQUN2RDtBQUNEO0FBQ0QsaUJBQWEsSUFBSSxJQUFKLENBQVMsV0FBVyxPQUFYLEtBQXVCLE1BQWhDLENBQWI7QUFDRDs7QUFFRCxTQUFPLElBQVA7QUFDRDs7QUFFRCxTQUFTLFFBQVQsQ0FBa0IsRUFBbEIsRUFBc0I7QUFDcEIsS0FBRyxRQUFILEdBQWMsaUJBQUUsTUFBRixDQUFTLEdBQUcsUUFBWixFQUFzQixVQUFDLE9BQUQsRUFBYTtBQUMvQyxRQUFHLFFBQVEsSUFBUixDQUFhLEtBQWIsS0FBdUIsR0FBRyxLQUE3QixFQUFvQztBQUNsQyxhQUFPLElBQVA7QUFDRDtBQUNGLEdBSmEsQ0FBZDtBQUtBLE1BQUksWUFBWSxHQUFHLE1BQUgsQ0FBVSxNQUFWLEdBQW1CLENBQW5DO0FBQ0EsTUFBSSxhQUFhLEdBQUcsUUFBSCxDQUFZLE1BQVosS0FBdUIsQ0FBeEM7QUFDQSxNQUFHLENBQUMsR0FBRyxTQUFILENBQWEsTUFBYixLQUF3QixDQUF4QixJQUE2QixHQUFHLFdBQUgsSUFBa0IsQ0FBaEQsS0FBc0QsQ0FBQyxTQUExRCxFQUFxRTtBQUNuRSxXQUFPLEVBQVAsQztBQUNEO0FBQ0QsTUFBRyxDQUFDLEdBQUcsV0FBSCxJQUFrQixDQUFsQixJQUF3QixHQUFHLFdBQUgsR0FBaUIsQ0FBakIsSUFBc0IsVUFBL0MsS0FBK0QsQ0FBQyxTQUFuRSxFQUE4RTtBQUM1RSxXQUFPLENBQVAsQztBQUNEO0FBQ0QsU0FBTyxDQUFQLEM7QUFDRDs7QUFFRCxTQUFTLEtBQVQsQ0FBZSxFQUFmLEVBQW1CO0FBQ2pCLE1BQUksaUJBQWlCLENBQ25CLElBRG1CLEVBRW5CLFFBRm1CLEVBR25CLEtBSG1CLEVBSW5CLFVBSm1CLEVBS25CLFNBTG1CLEVBTW5CLFNBTm1CLEVBT25CLFVBUG1CLEVBUW5CLHVCQVJtQixDQUFyQjs7QUFXQSxTQUFPLGlCQUFFLElBQUYsQ0FBTyxFQUFQLEVBQVcsY0FBWCxDQUFQO0FBQ0QiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBnZXRSZXBvc2l0b3JpZXMgZnJvbSAnLi4vcmV0cmlldmUnO1xuXG5sZXQgb25lRGF5ID0gMjQgKiA2MCAqIDYwICogMTAwMDtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcHJvY2Vzc1BScyhyZXBvID0geyByZXBvOiAnY2JheC0nIH0pIHtcbiAgcmV0dXJuIGdldFJlcG9zaXRvcmllcyhyZXBvKVxuICAgIC50aGVuKChyZXBvcykgPT4gXy5maWx0ZXIocmVwb3MsIChyKSA9PiByLnB1bGxSZXF1ZXN0cy5sZW5ndGggPiAwICkpXG4gICAgLnRoZW4oKHJlcG9zKSA9PiBfLm1hcChyZXBvcywgbWFwUFJzKSlcbiAgICAudGhlbigoUFJzKSA9PiBfLmZsYXR0ZW4oUFJzKSlcbiAgICAvLy50YXAoY29uc29sZS5sb2cpO1xufVxuXG5mdW5jdGlvbiBtYXBQUnMocmVwbykge1xuICByZXR1cm4gXy5tYXAocmVwby5wdWxsUmVxdWVzdHMsIChQUikgPT4ge1xuXG4gICAgUFIucmVwbyA9IHJlcG8ubmFtZTtcbiAgICBQUi5vd25lciA9IFBSLm93bmVyLmxvZ2luO1xuICAgIFBSLmxpbmsgPSBQUi51cmw7XG4gICAgUFIudGltZU9wZW4gPSAobmV3IERhdGUoKSAtIG5ldyBEYXRlKFBSLmNyZWF0ZWQpKSAvIG9uZURheTtcbiAgICBQUi53b3JraW5nRGF5cyA9IGdldFdvcmtpbmdEYXlzU2luY2UoUFIuY3JlYXRlZCk7XG4gICAgUFIudGltZVNpbmNlTGFzdE1vZGlmaWVkID0gKG5ldyBEYXRlKCkgLSBuZXcgRGF0ZShQUi51cGRhdGVkKSkgLyBvbmVEYXk7XG5cbiAgICBQUi5hc3NpZ25lZXMgPSBfLm1hcChQUi5hc3NpZ25lZXMsIChhc3NpZ25lZSkgPT4gYXNzaWduZWUubG9naW4pO1xuICAgIFBSLmxldmVsID0gZ2V0TGV2ZWwoUFIpO1xuXG4gICAgUFIgPSBwcnVuZShQUik7XG5cbiAgICByZXR1cm4gUFI7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBnZXRXb3JraW5nRGF5c1NpbmNlKGRhdGUpIHtcbiAgY29uc3Qgc3RhcnQgPSBuZXcgRGF0ZShkYXRlKTtcbiAgY29uc3QgZW5kID0gbmV3IERhdGUoKTtcblxuICBsZXQgZGF5cyA9IDA7XG4gIGxldCBjdXJyZW50RGF5ID0gc3RhcnQ7XG5cbiAgd2hpbGUoY3VycmVudERheSA8IGVuZCkge1xuICAgIGN1cnJlbnREYXkgPSBuZXcgRGF0ZShjdXJyZW50RGF5KTtcbiAgICBpZihjdXJyZW50RGF5LmdldERheSgpICE9IDAgJiYgY3VycmVudERheS5nZXREYXkoKSAhPSA2KSB7XG4gICAgICBkYXlzKys7XG4gICAgfVxuICAgIGN1cnJlbnREYXkgPSBuZXcgRGF0ZShjdXJyZW50RGF5LmdldFRpbWUoKSArIG9uZURheSk7XG4gIH1cblxuICByZXR1cm4gZGF5cztcbn1cblxuZnVuY3Rpb24gZ2V0TGV2ZWwoUFIpIHtcbiAgUFIuY29tbWVudHMgPSBfLmZpbHRlcihQUi5jb21tZW50cywgKGNvbW1lbnQpID0+IHtcbiAgICBpZihjb21tZW50LnVzZXIubG9naW4gIT09IFBSLm93bmVyKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuICBsZXQgaGFzTGFiZWxzID0gUFIubGFiZWxzLmxlbmd0aCA+IDA7XG4gIGxldCBub0NvbW1lbnRzID0gUFIuY29tbWVudHMubGVuZ3RoID09PSAwO1xuICBpZigoUFIuYXNzaWduZWVzLmxlbmd0aCA9PT0gMCB8fCBQUi53b3JraW5nRGF5cyA+PSA0KSAmJiAhaGFzTGFiZWxzKSB7XG4gICAgcmV0dXJuIDEwOyAvL3JlZDogbm8gYXNzaWduZWVzIG9yIHN0YWxlXG4gIH1cbiAgaWYoKFBSLndvcmtpbmdEYXlzID49IDIgfHwgKFBSLndvcmtpbmdEYXlzID4gMSAmJiBub0NvbW1lbnRzKSkgJiYgIWhhc0xhYmVscykge1xuICAgIHJldHVybiA1OyAvL3llbGxvdyBnb2luZyBzdGFsZSAob3V0c3RhbmRpbmcgPiAyIGRheXMgb3Igbm8gY29tbWVudHMgZnJvbSBhc3NpZ25lZXMgeWV0ICYmIG9sZGVyIHRoYW4gMTYgaG91cnMpXG4gIH1cbiAgcmV0dXJuIDA7IC8vZ3JlZW5cbn1cblxuZnVuY3Rpb24gcHJ1bmUoUFIpIHtcbiAgbGV0IGZpZWxkc1RvUmVtb3ZlID0gW1xuICAgICdpZCcsXG4gICAgJ251bWJlcicsXG4gICAgJ3VybCcsXG4gICAgJ2NvbW1lbnRzJyxcbiAgICAnY3JlYXRlZCcsXG4gICAgJ3VwZGF0ZWQnLFxuICAgICd0aW1lT3BlbicsXG4gICAgJ3RpbWVTaW5jZUxhc3RNb2RpZmllZCdcbiAgXTtcblxuICByZXR1cm4gXy5vbWl0KFBSLCBmaWVsZHNUb1JlbW92ZSk7XG59Il19