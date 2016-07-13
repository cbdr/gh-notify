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
  return (0, _retrieve2.default)({ repo: 'cbax-' }).then(function (repos) {
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
    PR.timeSinceLastModified = (new Date() - new Date(PR.updated)) / oneDay;

    PR.assignees = _lodash2.default.map(PR.assignees, function (assignee) {
      return assignee.login;
    });
    PR.level = getLevel(PR);

    PR = prune(PR);

    return PR;
  });
}

function getLevel(PR) {
  var noComments = PR.comments.length === 0;
  if (PR.assignees.length === 0 || PR.timeOpen > 3) {
    return 10; //red: no assignees or stale
  }
  if (PR.timeOpen > 2 || PR.timeOpen > 1 && noComments) {
    return 5; //yellow going stale (outstanding > 2 days or no comments from assignees yet && older than 16 hours)
  }
  return 0; //green
}

function prune(PR) {
  var fieldsToRemove = ['id', 'number', 'url', 'comments', 'created', 'updated', 'timeOpen', 'timeSinceLastModified'];

  return _lodash2.default.omit(PR, fieldsToRemove);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wcm9jZXNzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O2tCQU93QixVOztBQVB4Qjs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBSSxTQUFTLEtBQUssRUFBTCxHQUFVLEVBQVYsR0FBZSxJQUE1Qjs7QUFFZSxTQUFTLFVBQVQsR0FBc0I7QUFDbkMsU0FBTyx3QkFBZ0IsRUFBRSxNQUFNLE9BQVIsRUFBaEIsRUFDSixJQURJLENBQ0MsVUFBQyxLQUFEO0FBQUEsV0FBVyxpQkFBRSxNQUFGLENBQVMsS0FBVCxFQUFnQixVQUFDLENBQUQ7QUFBQSxhQUFPLEVBQUUsWUFBRixDQUFlLE1BQWYsR0FBd0IsQ0FBL0I7QUFBQSxLQUFoQixDQUFYO0FBQUEsR0FERCxFQUVKLElBRkksQ0FFQyxVQUFDLEtBQUQ7QUFBQSxXQUFXLGlCQUFFLEdBQUYsQ0FBTSxLQUFOLEVBQWEsTUFBYixDQUFYO0FBQUEsR0FGRCxFQUdKLElBSEksQ0FHQyxVQUFDLEdBQUQ7QUFBQSxXQUFTLGlCQUFFLE9BQUYsQ0FBVSxHQUFWLENBQVQ7QUFBQSxHQUhELENBQVA7QUFJRTtBQUNIOztBQUVELFNBQVMsTUFBVCxDQUFnQixJQUFoQixFQUFzQjtBQUNwQixTQUFPLGlCQUFFLEdBQUYsQ0FBTSxLQUFLLFlBQVgsRUFBeUIsVUFBQyxFQUFELEVBQVE7O0FBRXRDLE9BQUcsSUFBSCxHQUFVLEtBQUssSUFBZjtBQUNBLE9BQUcsS0FBSCxHQUFXLEdBQUcsS0FBSCxDQUFTLEtBQXBCO0FBQ0EsT0FBRyxJQUFILEdBQVUsR0FBRyxHQUFiO0FBQ0EsT0FBRyxRQUFILEdBQWMsQ0FBQyxJQUFJLElBQUosS0FBYSxJQUFJLElBQUosQ0FBUyxHQUFHLE9BQVosQ0FBZCxJQUFzQyxNQUFwRDtBQUNBLE9BQUcscUJBQUgsR0FBMkIsQ0FBQyxJQUFJLElBQUosS0FBYSxJQUFJLElBQUosQ0FBUyxHQUFHLE9BQVosQ0FBZCxJQUFzQyxNQUFqRTs7QUFFQSxPQUFHLFNBQUgsR0FBZSxpQkFBRSxHQUFGLENBQU0sR0FBRyxTQUFULEVBQW9CLFVBQUMsUUFBRDtBQUFBLGFBQWMsU0FBUyxLQUF2QjtBQUFBLEtBQXBCLENBQWY7QUFDQSxPQUFHLEtBQUgsR0FBVyxTQUFTLEVBQVQsQ0FBWDs7QUFFQSxTQUFLLE1BQU0sRUFBTixDQUFMOztBQUVBLFdBQU8sRUFBUDtBQUNELEdBZE0sQ0FBUDtBQWVEOztBQUVELFNBQVMsUUFBVCxDQUFrQixFQUFsQixFQUFzQjtBQUNwQixNQUFJLGFBQWEsR0FBRyxRQUFILENBQVksTUFBWixLQUF1QixDQUF4QztBQUNBLE1BQUcsR0FBRyxTQUFILENBQWEsTUFBYixLQUF3QixDQUF4QixJQUE2QixHQUFHLFFBQUgsR0FBYyxDQUE5QyxFQUFpRDtBQUMvQyxXQUFPLEVBQVAsQ0FBVztBQUNaO0FBQ0QsTUFBRyxHQUFHLFFBQUgsR0FBYyxDQUFkLElBQW9CLEdBQUcsUUFBSCxHQUFjLENBQWQsSUFBbUIsVUFBMUMsRUFBdUQ7QUFDckQsV0FBTyxDQUFQLENBQVU7QUFDWDtBQUNELFNBQU8sQ0FBUCxDQUFVO0FBQ1g7O0FBRUQsU0FBUyxLQUFULENBQWUsRUFBZixFQUFtQjtBQUNqQixNQUFJLGlCQUFpQixDQUNuQixJQURtQixFQUVuQixRQUZtQixFQUduQixLQUhtQixFQUluQixVQUptQixFQUtuQixTQUxtQixFQU1uQixTQU5tQixFQU9uQixVQVBtQixFQVFuQix1QkFSbUIsQ0FBckI7O0FBV0EsU0FBTyxpQkFBRSxJQUFGLENBQU8sRUFBUCxFQUFXLGNBQVgsQ0FBUDtBQUNEIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgZ2V0UmVwb3NpdG9yaWVzIGZyb20gJy4uL3JldHJpZXZlJztcblxubGV0IG9uZURheSA9IDI0ICogNjAgKiA2MCAqIDEwMDA7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHByb2Nlc3NQUnMoKSB7XG4gIHJldHVybiBnZXRSZXBvc2l0b3JpZXMoeyByZXBvOiAnY2JheC0nIH0pXG4gICAgLnRoZW4oKHJlcG9zKSA9PiBfLmZpbHRlcihyZXBvcywgKHIpID0+IHIucHVsbFJlcXVlc3RzLmxlbmd0aCA+IDAgKSlcbiAgICAudGhlbigocmVwb3MpID0+IF8ubWFwKHJlcG9zLCBtYXBQUnMpKVxuICAgIC50aGVuKChQUnMpID0+IF8uZmxhdHRlbihQUnMpKVxuICAgIC8vLnRhcChjb25zb2xlLmxvZyk7XG59XG5cbmZ1bmN0aW9uIG1hcFBScyhyZXBvKSB7XG4gIHJldHVybiBfLm1hcChyZXBvLnB1bGxSZXF1ZXN0cywgKFBSKSA9PiB7XG5cbiAgICBQUi5yZXBvID0gcmVwby5uYW1lO1xuICAgIFBSLm93bmVyID0gUFIub3duZXIubG9naW47XG4gICAgUFIubGluayA9IFBSLnVybDtcbiAgICBQUi50aW1lT3BlbiA9IChuZXcgRGF0ZSgpIC0gbmV3IERhdGUoUFIuY3JlYXRlZCkpIC8gb25lRGF5O1xuICAgIFBSLnRpbWVTaW5jZUxhc3RNb2RpZmllZCA9IChuZXcgRGF0ZSgpIC0gbmV3IERhdGUoUFIudXBkYXRlZCkpIC8gb25lRGF5O1xuXG4gICAgUFIuYXNzaWduZWVzID0gXy5tYXAoUFIuYXNzaWduZWVzLCAoYXNzaWduZWUpID0+IGFzc2lnbmVlLmxvZ2luKTtcbiAgICBQUi5sZXZlbCA9IGdldExldmVsKFBSKTtcblxuICAgIFBSID0gcHJ1bmUoUFIpO1xuXG4gICAgcmV0dXJuIFBSO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0TGV2ZWwoUFIpIHtcbiAgbGV0IG5vQ29tbWVudHMgPSBQUi5jb21tZW50cy5sZW5ndGggPT09IDA7XG4gIGlmKFBSLmFzc2lnbmVlcy5sZW5ndGggPT09IDAgfHwgUFIudGltZU9wZW4gPiAzKSB7XG4gICAgcmV0dXJuIDEwOyAvL3JlZDogbm8gYXNzaWduZWVzIG9yIHN0YWxlXG4gIH1cbiAgaWYoUFIudGltZU9wZW4gPiAyIHx8IChQUi50aW1lT3BlbiA+IDEgJiYgbm9Db21tZW50cykpIHtcbiAgICByZXR1cm4gNTsgLy95ZWxsb3cgZ29pbmcgc3RhbGUgKG91dHN0YW5kaW5nID4gMiBkYXlzIG9yIG5vIGNvbW1lbnRzIGZyb20gYXNzaWduZWVzIHlldCAmJiBvbGRlciB0aGFuIDE2IGhvdXJzKVxuICB9XG4gIHJldHVybiAwOyAvL2dyZWVuXG59XG5cbmZ1bmN0aW9uIHBydW5lKFBSKSB7XG4gIGxldCBmaWVsZHNUb1JlbW92ZSA9IFtcbiAgICAnaWQnLFxuICAgICdudW1iZXInLFxuICAgICd1cmwnLFxuICAgICdjb21tZW50cycsXG4gICAgJ2NyZWF0ZWQnLFxuICAgICd1cGRhdGVkJyxcbiAgICAndGltZU9wZW4nLFxuICAgICd0aW1lU2luY2VMYXN0TW9kaWZpZWQnXG4gIF07XG5cbiAgcmV0dXJuIF8ub21pdChQUiwgZmllbGRzVG9SZW1vdmUpO1xufSJdfQ==