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

  var x = getWorkingDaysSince;
  debugger;
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
    console.log(currentDay, currentDay.getDay());
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
  if ((PR.assignees.length === 0 || PR.timeOpen >= 4) && !hasLabels) {
    return 10; //red: no assignees or stale
  }
  if ((PR.timeOpen > 2 || PR.timeOpen > 1 && noComments) && !hasLabels) {
    return 5; //yellow going stale (outstanding > 2 days or no comments from assignees yet && older than 16 hours)
  }
  return 0; //green
}

function prune(PR) {
  var fieldsToRemove = ['id', 'number', 'url', 'comments', 'created', 'updated', 'timeOpen', 'timeSinceLastModified'];

  return _lodash2.default.omit(PR, fieldsToRemove);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wcm9jZXNzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O2tCQU93QixVOztBQVB4Qjs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBSSxTQUFTLEtBQUssRUFBTCxHQUFVLEVBQVYsR0FBZSxJQUE1Qjs7QUFFZSxTQUFTLFVBQVQsR0FBOEM7QUFBQSxNQUExQixJQUEwQix5REFBbkIsRUFBRSxNQUFNLE9BQVIsRUFBbUI7O0FBQzNELE1BQUksSUFBSSxtQkFBUjtBQUNBO0FBQ0EsU0FBTyx3QkFBZ0IsSUFBaEIsRUFDSixJQURJLENBQ0MsVUFBQyxLQUFEO0FBQUEsV0FBVyxpQkFBRSxNQUFGLENBQVMsS0FBVCxFQUFnQixVQUFDLENBQUQ7QUFBQSxhQUFPLEVBQUUsWUFBRixDQUFlLE1BQWYsR0FBd0IsQ0FBL0I7QUFBQSxLQUFoQixDQUFYO0FBQUEsR0FERCxFQUVKLElBRkksQ0FFQyxVQUFDLEtBQUQ7QUFBQSxXQUFXLGlCQUFFLEdBQUYsQ0FBTSxLQUFOLEVBQWEsTUFBYixDQUFYO0FBQUEsR0FGRCxFQUdKLElBSEksQ0FHQyxVQUFDLEdBQUQ7QUFBQSxXQUFTLGlCQUFFLE9BQUYsQ0FBVSxHQUFWLENBQVQ7QUFBQSxHQUhELENBQVA7O0FBS0Q7O0FBRUQsU0FBUyxNQUFULENBQWdCLElBQWhCLEVBQXNCO0FBQ3BCLFNBQU8saUJBQUUsR0FBRixDQUFNLEtBQUssWUFBWCxFQUF5QixVQUFDLEVBQUQsRUFBUTs7QUFFdEMsT0FBRyxJQUFILEdBQVUsS0FBSyxJQUFmO0FBQ0EsT0FBRyxLQUFILEdBQVcsR0FBRyxLQUFILENBQVMsS0FBcEI7QUFDQSxPQUFHLElBQUgsR0FBVSxHQUFHLEdBQWI7QUFDQSxPQUFHLFFBQUgsR0FBYyxDQUFDLElBQUksSUFBSixLQUFhLElBQUksSUFBSixDQUFTLEdBQUcsT0FBWixDQUFkLElBQXNDLE1BQXBEO0FBQ0EsT0FBRyxXQUFILEdBQWlCLG9CQUFvQixHQUFHLE9BQXZCLENBQWpCO0FBQ0EsT0FBRyxxQkFBSCxHQUEyQixDQUFDLElBQUksSUFBSixLQUFhLElBQUksSUFBSixDQUFTLEdBQUcsT0FBWixDQUFkLElBQXNDLE1BQWpFOztBQUVBLE9BQUcsU0FBSCxHQUFlLGlCQUFFLEdBQUYsQ0FBTSxHQUFHLFNBQVQsRUFBb0IsVUFBQyxRQUFEO0FBQUEsYUFBYyxTQUFTLEtBQXZCO0FBQUEsS0FBcEIsQ0FBZjtBQUNBLE9BQUcsS0FBSCxHQUFXLFNBQVMsRUFBVCxDQUFYOztBQUVBLFNBQUssTUFBTSxFQUFOLENBQUw7O0FBRUEsV0FBTyxFQUFQO0FBQ0QsR0FmTSxDQUFQO0FBZ0JEOztBQUVELFNBQVMsbUJBQVQsQ0FBNkIsSUFBN0IsRUFBbUM7QUFDakMsTUFBTSxRQUFRLElBQUksSUFBSixDQUFTLElBQVQsQ0FBZDtBQUNBLE1BQU0sTUFBTSxJQUFJLElBQUosRUFBWjs7QUFFQSxNQUFJLE9BQU8sQ0FBWDtBQUNBLE1BQUksYUFBYSxLQUFqQjs7QUFFQSxTQUFNLGFBQWEsR0FBbkIsRUFBd0I7QUFDdEIsWUFBUSxHQUFSLENBQVksVUFBWixFQUF3QixXQUFXLE1BQVgsRUFBeEI7QUFDQSxpQkFBYSxJQUFJLElBQUosQ0FBUyxVQUFULENBQWI7QUFDQSxRQUFHLFdBQVcsTUFBWCxNQUF1QixDQUF2QixJQUE0QixXQUFXLE1BQVgsTUFBdUIsQ0FBdEQsRUFBeUQ7QUFDdkQ7QUFDRDtBQUNELGlCQUFhLElBQUksSUFBSixDQUFTLFdBQVcsT0FBWCxLQUF1QixNQUFoQyxDQUFiO0FBQ0Q7O0FBRUQsU0FBTyxJQUFQO0FBRUQ7O0FBRUQsU0FBUyxRQUFULENBQWtCLEVBQWxCLEVBQXNCO0FBQ3BCLEtBQUcsUUFBSCxHQUFjLGlCQUFFLE1BQUYsQ0FBUyxHQUFHLFFBQVosRUFBc0IsVUFBQyxPQUFELEVBQWE7QUFDL0MsUUFBRyxRQUFRLElBQVIsQ0FBYSxLQUFiLEtBQXVCLEdBQUcsS0FBN0IsRUFBb0M7QUFDbEMsYUFBTyxJQUFQO0FBQ0Q7QUFDRixHQUphLENBQWQ7QUFLQSxNQUFJLFlBQVksR0FBRyxNQUFILENBQVUsTUFBVixHQUFtQixDQUFuQztBQUNBLE1BQUksYUFBYSxHQUFHLFFBQUgsQ0FBWSxNQUFaLEtBQXVCLENBQXhDO0FBQ0EsTUFBRyxDQUFDLEdBQUcsU0FBSCxDQUFhLE1BQWIsS0FBd0IsQ0FBeEIsSUFBNkIsR0FBRyxRQUFILElBQWUsQ0FBN0MsS0FBbUQsQ0FBQyxTQUF2RCxFQUFrRTtBQUNoRSxXQUFPLEVBQVAsQztBQUNEO0FBQ0QsTUFBRyxDQUFDLEdBQUcsUUFBSCxHQUFjLENBQWQsSUFBb0IsR0FBRyxRQUFILEdBQWMsQ0FBZCxJQUFtQixVQUF4QyxLQUF3RCxDQUFDLFNBQTVELEVBQXVFO0FBQ3JFLFdBQU8sQ0FBUCxDO0FBQ0Q7QUFDRCxTQUFPLENBQVAsQztBQUNEOztBQUVELFNBQVMsS0FBVCxDQUFlLEVBQWYsRUFBbUI7QUFDakIsTUFBSSxpQkFBaUIsQ0FDbkIsSUFEbUIsRUFFbkIsUUFGbUIsRUFHbkIsS0FIbUIsRUFJbkIsVUFKbUIsRUFLbkIsU0FMbUIsRUFNbkIsU0FObUIsRUFPbkIsVUFQbUIsRUFRbkIsdUJBUm1CLENBQXJCOztBQVdBLFNBQU8saUJBQUUsSUFBRixDQUFPLEVBQVAsRUFBVyxjQUFYLENBQVA7QUFDRCIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IGdldFJlcG9zaXRvcmllcyBmcm9tICcuLi9yZXRyaWV2ZSc7XG5cbmxldCBvbmVEYXkgPSAyNCAqIDYwICogNjAgKiAxMDAwO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwcm9jZXNzUFJzKHJlcG8gPSB7IHJlcG86ICdjYmF4LScgfSkge1xuICB2YXIgeCA9IGdldFdvcmtpbmdEYXlzU2luY2U7XG4gIGRlYnVnZ2VyO1xuICByZXR1cm4gZ2V0UmVwb3NpdG9yaWVzKHJlcG8pXG4gICAgLnRoZW4oKHJlcG9zKSA9PiBfLmZpbHRlcihyZXBvcywgKHIpID0+IHIucHVsbFJlcXVlc3RzLmxlbmd0aCA+IDAgKSlcbiAgICAudGhlbigocmVwb3MpID0+IF8ubWFwKHJlcG9zLCBtYXBQUnMpKVxuICAgIC50aGVuKChQUnMpID0+IF8uZmxhdHRlbihQUnMpKVxuICAgIC8vLnRhcChjb25zb2xlLmxvZyk7XG59XG5cbmZ1bmN0aW9uIG1hcFBScyhyZXBvKSB7XG4gIHJldHVybiBfLm1hcChyZXBvLnB1bGxSZXF1ZXN0cywgKFBSKSA9PiB7XG5cbiAgICBQUi5yZXBvID0gcmVwby5uYW1lO1xuICAgIFBSLm93bmVyID0gUFIub3duZXIubG9naW47XG4gICAgUFIubGluayA9IFBSLnVybDtcbiAgICBQUi50aW1lT3BlbiA9IChuZXcgRGF0ZSgpIC0gbmV3IERhdGUoUFIuY3JlYXRlZCkpIC8gb25lRGF5O1xuICAgIFBSLndvcmtpbmdEYXlzID0gZ2V0V29ya2luZ0RheXNTaW5jZShQUi5jcmVhdGVkKTtcbiAgICBQUi50aW1lU2luY2VMYXN0TW9kaWZpZWQgPSAobmV3IERhdGUoKSAtIG5ldyBEYXRlKFBSLnVwZGF0ZWQpKSAvIG9uZURheTtcblxuICAgIFBSLmFzc2lnbmVlcyA9IF8ubWFwKFBSLmFzc2lnbmVlcywgKGFzc2lnbmVlKSA9PiBhc3NpZ25lZS5sb2dpbik7XG4gICAgUFIubGV2ZWwgPSBnZXRMZXZlbChQUik7XG5cbiAgICBQUiA9IHBydW5lKFBSKTtcblxuICAgIHJldHVybiBQUjtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldFdvcmtpbmdEYXlzU2luY2UoZGF0ZSkge1xuICBjb25zdCBzdGFydCA9IG5ldyBEYXRlKGRhdGUpO1xuICBjb25zdCBlbmQgPSBuZXcgRGF0ZSgpO1xuXG4gIGxldCBkYXlzID0gMDtcbiAgbGV0IGN1cnJlbnREYXkgPSBzdGFydDtcblxuICB3aGlsZShjdXJyZW50RGF5IDwgZW5kKSB7XG4gICAgY29uc29sZS5sb2coY3VycmVudERheSwgY3VycmVudERheS5nZXREYXkoKSlcbiAgICBjdXJyZW50RGF5ID0gbmV3IERhdGUoY3VycmVudERheSk7XG4gICAgaWYoY3VycmVudERheS5nZXREYXkoKSAhPSAwICYmIGN1cnJlbnREYXkuZ2V0RGF5KCkgIT0gNikge1xuICAgICAgZGF5cysrO1xuICAgIH1cbiAgICBjdXJyZW50RGF5ID0gbmV3IERhdGUoY3VycmVudERheS5nZXRUaW1lKCkgKyBvbmVEYXkpO1xuICB9XG5cbiAgcmV0dXJuIGRheXM7XG5cbn1cblxuZnVuY3Rpb24gZ2V0TGV2ZWwoUFIpIHtcbiAgUFIuY29tbWVudHMgPSBfLmZpbHRlcihQUi5jb21tZW50cywgKGNvbW1lbnQpID0+IHtcbiAgICBpZihjb21tZW50LnVzZXIubG9naW4gIT09IFBSLm93bmVyKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuICBsZXQgaGFzTGFiZWxzID0gUFIubGFiZWxzLmxlbmd0aCA+IDA7XG4gIGxldCBub0NvbW1lbnRzID0gUFIuY29tbWVudHMubGVuZ3RoID09PSAwO1xuICBpZigoUFIuYXNzaWduZWVzLmxlbmd0aCA9PT0gMCB8fCBQUi50aW1lT3BlbiA+PSA0KSAmJiAhaGFzTGFiZWxzKSB7XG4gICAgcmV0dXJuIDEwOyAvL3JlZDogbm8gYXNzaWduZWVzIG9yIHN0YWxlXG4gIH1cbiAgaWYoKFBSLnRpbWVPcGVuID4gMiB8fCAoUFIudGltZU9wZW4gPiAxICYmIG5vQ29tbWVudHMpKSAmJiAhaGFzTGFiZWxzKSB7XG4gICAgcmV0dXJuIDU7IC8veWVsbG93IGdvaW5nIHN0YWxlIChvdXRzdGFuZGluZyA+IDIgZGF5cyBvciBubyBjb21tZW50cyBmcm9tIGFzc2lnbmVlcyB5ZXQgJiYgb2xkZXIgdGhhbiAxNiBob3VycylcbiAgfVxuICByZXR1cm4gMDsgLy9ncmVlblxufVxuXG5mdW5jdGlvbiBwcnVuZShQUikge1xuICBsZXQgZmllbGRzVG9SZW1vdmUgPSBbXG4gICAgJ2lkJyxcbiAgICAnbnVtYmVyJyxcbiAgICAndXJsJyxcbiAgICAnY29tbWVudHMnLFxuICAgICdjcmVhdGVkJyxcbiAgICAndXBkYXRlZCcsXG4gICAgJ3RpbWVPcGVuJyxcbiAgICAndGltZVNpbmNlTGFzdE1vZGlmaWVkJ1xuICBdO1xuXG4gIHJldHVybiBfLm9taXQoUFIsIGZpZWxkc1RvUmVtb3ZlKTtcbn0iXX0=