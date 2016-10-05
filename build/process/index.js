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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wcm9jZXNzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O2tCQU93QixVOztBQVB4Qjs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBSSxTQUFTLEtBQUssRUFBTCxHQUFVLEVBQVYsR0FBZSxJQUE1Qjs7QUFFZSxTQUFTLFVBQVQsR0FBOEM7QUFBQSxNQUExQixJQUEwQix5REFBbkIsRUFBRSxNQUFNLE9BQVIsRUFBbUI7O0FBQzNELFNBQU8sd0JBQWdCLElBQWhCLEVBQ0osSUFESSxDQUNDLFVBQUMsS0FBRDtBQUFBLFdBQVcsaUJBQUUsTUFBRixDQUFTLEtBQVQsRUFBZ0IsVUFBQyxDQUFEO0FBQUEsYUFBTyxFQUFFLFlBQUYsQ0FBZSxNQUFmLEdBQXdCLENBQS9CO0FBQUEsS0FBaEIsQ0FBWDtBQUFBLEdBREQsRUFFSixJQUZJLENBRUMsVUFBQyxLQUFEO0FBQUEsV0FBVyxpQkFBRSxHQUFGLENBQU0sS0FBTixFQUFhLE1BQWIsQ0FBWDtBQUFBLEdBRkQsRUFHSixJQUhJLENBR0MsVUFBQyxHQUFEO0FBQUEsV0FBUyxpQkFBRSxPQUFGLENBQVUsR0FBVixDQUFUO0FBQUEsR0FIRCxDQUFQOztBQUtEOztBQUVELFNBQVMsTUFBVCxDQUFnQixJQUFoQixFQUFzQjtBQUNwQixTQUFPLGlCQUFFLEdBQUYsQ0FBTSxLQUFLLFlBQVgsRUFBeUIsVUFBQyxFQUFELEVBQVE7O0FBRXRDLE9BQUcsSUFBSCxHQUFVLEtBQUssSUFBZjtBQUNBLE9BQUcsS0FBSCxHQUFXLEdBQUcsS0FBSCxDQUFTLEtBQXBCO0FBQ0EsT0FBRyxJQUFILEdBQVUsR0FBRyxHQUFiO0FBQ0EsT0FBRyxRQUFILEdBQWMsQ0FBQyxJQUFJLElBQUosS0FBYSxJQUFJLElBQUosQ0FBUyxHQUFHLE9BQVosQ0FBZCxJQUFzQyxNQUFwRDtBQUNBLE9BQUcsV0FBSCxHQUFpQixvQkFBb0IsR0FBRyxPQUF2QixDQUFqQjtBQUNBLE9BQUcscUJBQUgsR0FBMkIsQ0FBQyxJQUFJLElBQUosS0FBYSxJQUFJLElBQUosQ0FBUyxHQUFHLE9BQVosQ0FBZCxJQUFzQyxNQUFqRTs7QUFFQSxPQUFHLFNBQUgsR0FBZSxpQkFBRSxHQUFGLENBQU0sR0FBRyxTQUFULEVBQW9CLFVBQUMsUUFBRDtBQUFBLGFBQWMsU0FBUyxLQUF2QjtBQUFBLEtBQXBCLENBQWY7QUFDQSxPQUFHLEtBQUgsR0FBVyxTQUFTLEVBQVQsQ0FBWDs7QUFFQSxTQUFLLE1BQU0sRUFBTixDQUFMOztBQUVBLFdBQU8sRUFBUDtBQUNELEdBZk0sQ0FBUDtBQWdCRDs7QUFFRCxTQUFTLG1CQUFULENBQTZCLElBQTdCLEVBQW1DO0FBQ2pDLE1BQU0sUUFBUSxJQUFJLElBQUosQ0FBUyxJQUFULENBQWQ7QUFDQSxNQUFNLE1BQU0sSUFBSSxJQUFKLEVBQVo7O0FBRUEsTUFBSSxPQUFPLENBQVg7QUFDQSxNQUFJLGFBQWEsS0FBakI7O0FBRUEsU0FBTSxhQUFhLEdBQW5CLEVBQXdCO0FBQ3RCLFlBQVEsR0FBUixDQUFZLFVBQVosRUFBd0IsV0FBVyxNQUFYLEVBQXhCO0FBQ0EsaUJBQWEsSUFBSSxJQUFKLENBQVMsVUFBVCxDQUFiO0FBQ0EsUUFBRyxXQUFXLE1BQVgsTUFBdUIsQ0FBdkIsSUFBNEIsV0FBVyxNQUFYLE1BQXVCLENBQXRELEVBQXlEO0FBQ3ZEO0FBQ0Q7QUFDRCxpQkFBYSxJQUFJLElBQUosQ0FBUyxXQUFXLE9BQVgsS0FBdUIsTUFBaEMsQ0FBYjtBQUNEOztBQUVELFNBQU8sSUFBUDtBQUNEOztBQUVELFNBQVMsUUFBVCxDQUFrQixFQUFsQixFQUFzQjtBQUNwQixLQUFHLFFBQUgsR0FBYyxpQkFBRSxNQUFGLENBQVMsR0FBRyxRQUFaLEVBQXNCLFVBQUMsT0FBRCxFQUFhO0FBQy9DLFFBQUcsUUFBUSxJQUFSLENBQWEsS0FBYixLQUF1QixHQUFHLEtBQTdCLEVBQW9DO0FBQ2xDLGFBQU8sSUFBUDtBQUNEO0FBQ0YsR0FKYSxDQUFkO0FBS0EsTUFBSSxZQUFZLEdBQUcsTUFBSCxDQUFVLE1BQVYsR0FBbUIsQ0FBbkM7QUFDQSxNQUFJLGFBQWEsR0FBRyxRQUFILENBQVksTUFBWixLQUF1QixDQUF4QztBQUNBLE1BQUcsQ0FBQyxHQUFHLFNBQUgsQ0FBYSxNQUFiLEtBQXdCLENBQXhCLElBQTZCLEdBQUcsV0FBSCxJQUFrQixDQUFoRCxLQUFzRCxDQUFDLFNBQTFELEVBQXFFO0FBQ25FLFdBQU8sRUFBUCxDO0FBQ0Q7QUFDRCxNQUFHLENBQUMsR0FBRyxXQUFILElBQWtCLENBQWxCLElBQXdCLEdBQUcsV0FBSCxHQUFpQixDQUFqQixJQUFzQixVQUEvQyxLQUErRCxDQUFDLFNBQW5FLEVBQThFO0FBQzVFLFdBQU8sQ0FBUCxDO0FBQ0Q7QUFDRCxTQUFPLENBQVAsQztBQUNEOztBQUVELFNBQVMsS0FBVCxDQUFlLEVBQWYsRUFBbUI7QUFDakIsTUFBSSxpQkFBaUIsQ0FDbkIsSUFEbUIsRUFFbkIsUUFGbUIsRUFHbkIsS0FIbUIsRUFJbkIsVUFKbUIsRUFLbkIsU0FMbUIsRUFNbkIsU0FObUIsRUFPbkIsVUFQbUIsRUFRbkIsdUJBUm1CLENBQXJCOztBQVdBLFNBQU8saUJBQUUsSUFBRixDQUFPLEVBQVAsRUFBVyxjQUFYLENBQVA7QUFDRCIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IGdldFJlcG9zaXRvcmllcyBmcm9tICcuLi9yZXRyaWV2ZSc7XG5cbmxldCBvbmVEYXkgPSAyNCAqIDYwICogNjAgKiAxMDAwO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwcm9jZXNzUFJzKHJlcG8gPSB7IHJlcG86ICdjYmF4LScgfSkge1xuICByZXR1cm4gZ2V0UmVwb3NpdG9yaWVzKHJlcG8pXG4gICAgLnRoZW4oKHJlcG9zKSA9PiBfLmZpbHRlcihyZXBvcywgKHIpID0+IHIucHVsbFJlcXVlc3RzLmxlbmd0aCA+IDAgKSlcbiAgICAudGhlbigocmVwb3MpID0+IF8ubWFwKHJlcG9zLCBtYXBQUnMpKVxuICAgIC50aGVuKChQUnMpID0+IF8uZmxhdHRlbihQUnMpKVxuICAgIC8vLnRhcChjb25zb2xlLmxvZyk7XG59XG5cbmZ1bmN0aW9uIG1hcFBScyhyZXBvKSB7XG4gIHJldHVybiBfLm1hcChyZXBvLnB1bGxSZXF1ZXN0cywgKFBSKSA9PiB7XG5cbiAgICBQUi5yZXBvID0gcmVwby5uYW1lO1xuICAgIFBSLm93bmVyID0gUFIub3duZXIubG9naW47XG4gICAgUFIubGluayA9IFBSLnVybDtcbiAgICBQUi50aW1lT3BlbiA9IChuZXcgRGF0ZSgpIC0gbmV3IERhdGUoUFIuY3JlYXRlZCkpIC8gb25lRGF5O1xuICAgIFBSLndvcmtpbmdEYXlzID0gZ2V0V29ya2luZ0RheXNTaW5jZShQUi5jcmVhdGVkKTtcbiAgICBQUi50aW1lU2luY2VMYXN0TW9kaWZpZWQgPSAobmV3IERhdGUoKSAtIG5ldyBEYXRlKFBSLnVwZGF0ZWQpKSAvIG9uZURheTtcblxuICAgIFBSLmFzc2lnbmVlcyA9IF8ubWFwKFBSLmFzc2lnbmVlcywgKGFzc2lnbmVlKSA9PiBhc3NpZ25lZS5sb2dpbik7XG4gICAgUFIubGV2ZWwgPSBnZXRMZXZlbChQUik7XG5cbiAgICBQUiA9IHBydW5lKFBSKTtcblxuICAgIHJldHVybiBQUjtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldFdvcmtpbmdEYXlzU2luY2UoZGF0ZSkge1xuICBjb25zdCBzdGFydCA9IG5ldyBEYXRlKGRhdGUpO1xuICBjb25zdCBlbmQgPSBuZXcgRGF0ZSgpO1xuXG4gIGxldCBkYXlzID0gMDtcbiAgbGV0IGN1cnJlbnREYXkgPSBzdGFydDtcblxuICB3aGlsZShjdXJyZW50RGF5IDwgZW5kKSB7XG4gICAgY29uc29sZS5sb2coY3VycmVudERheSwgY3VycmVudERheS5nZXREYXkoKSlcbiAgICBjdXJyZW50RGF5ID0gbmV3IERhdGUoY3VycmVudERheSk7XG4gICAgaWYoY3VycmVudERheS5nZXREYXkoKSAhPSAwICYmIGN1cnJlbnREYXkuZ2V0RGF5KCkgIT0gNikge1xuICAgICAgZGF5cysrO1xuICAgIH1cbiAgICBjdXJyZW50RGF5ID0gbmV3IERhdGUoY3VycmVudERheS5nZXRUaW1lKCkgKyBvbmVEYXkpO1xuICB9XG5cbiAgcmV0dXJuIGRheXM7XG59XG5cbmZ1bmN0aW9uIGdldExldmVsKFBSKSB7XG4gIFBSLmNvbW1lbnRzID0gXy5maWx0ZXIoUFIuY29tbWVudHMsIChjb21tZW50KSA9PiB7XG4gICAgaWYoY29tbWVudC51c2VyLmxvZ2luICE9PSBQUi5vd25lcikge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9KTtcbiAgbGV0IGhhc0xhYmVscyA9IFBSLmxhYmVscy5sZW5ndGggPiAwO1xuICBsZXQgbm9Db21tZW50cyA9IFBSLmNvbW1lbnRzLmxlbmd0aCA9PT0gMDtcbiAgaWYoKFBSLmFzc2lnbmVlcy5sZW5ndGggPT09IDAgfHwgUFIud29ya2luZ0RheXMgPj0gNCkgJiYgIWhhc0xhYmVscykge1xuICAgIHJldHVybiAxMDsgLy9yZWQ6IG5vIGFzc2lnbmVlcyBvciBzdGFsZVxuICB9XG4gIGlmKChQUi53b3JraW5nRGF5cyA+PSAyIHx8IChQUi53b3JraW5nRGF5cyA+IDEgJiYgbm9Db21tZW50cykpICYmICFoYXNMYWJlbHMpIHtcbiAgICByZXR1cm4gNTsgLy95ZWxsb3cgZ29pbmcgc3RhbGUgKG91dHN0YW5kaW5nID4gMiBkYXlzIG9yIG5vIGNvbW1lbnRzIGZyb20gYXNzaWduZWVzIHlldCAmJiBvbGRlciB0aGFuIDE2IGhvdXJzKVxuICB9XG4gIHJldHVybiAwOyAvL2dyZWVuXG59XG5cbmZ1bmN0aW9uIHBydW5lKFBSKSB7XG4gIGxldCBmaWVsZHNUb1JlbW92ZSA9IFtcbiAgICAnaWQnLFxuICAgICdudW1iZXInLFxuICAgICd1cmwnLFxuICAgICdjb21tZW50cycsXG4gICAgJ2NyZWF0ZWQnLFxuICAgICd1cGRhdGVkJyxcbiAgICAndGltZU9wZW4nLFxuICAgICd0aW1lU2luY2VMYXN0TW9kaWZpZWQnXG4gIF07XG5cbiAgcmV0dXJuIF8ub21pdChQUiwgZmllbGRzVG9SZW1vdmUpO1xufSJdfQ==