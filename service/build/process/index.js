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
    PR.link = PR.url.replace('api.', '');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wcm9jZXNzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O2tCQU93QixVOztBQVB4Qjs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBSSxTQUFTLEtBQUssRUFBTCxHQUFVLEVBQVYsR0FBZSxJQUE1Qjs7QUFFZSxTQUFTLFVBQVQsR0FBc0I7QUFDbkMsU0FBTyx3QkFBZ0IsRUFBRSxNQUFNLE9BQVIsRUFBaEIsRUFDSixJQURJLENBQ0MsVUFBQyxLQUFEO0FBQUEsV0FBVyxpQkFBRSxNQUFGLENBQVMsS0FBVCxFQUFnQixVQUFDLENBQUQ7QUFBQSxhQUFPLEVBQUUsWUFBRixDQUFlLE1BQWYsR0FBd0IsQ0FBL0I7QUFBQSxLQUFoQixDQUFYO0FBQUEsR0FERCxFQUVKLElBRkksQ0FFQyxVQUFDLEtBQUQ7QUFBQSxXQUFXLGlCQUFFLEdBQUYsQ0FBTSxLQUFOLEVBQWEsTUFBYixDQUFYO0FBQUEsR0FGRCxFQUdKLElBSEksQ0FHQyxVQUFDLEdBQUQ7QUFBQSxXQUFTLGlCQUFFLE9BQUYsQ0FBVSxHQUFWLENBQVQ7QUFBQSxHQUhELENBQVA7O0FBS0Q7O0FBRUQsU0FBUyxNQUFULENBQWdCLElBQWhCLEVBQXNCO0FBQ3BCLFNBQU8saUJBQUUsR0FBRixDQUFNLEtBQUssWUFBWCxFQUF5QixVQUFDLEVBQUQsRUFBUTs7QUFFdEMsT0FBRyxJQUFILEdBQVUsS0FBSyxJQUFmO0FBQ0EsT0FBRyxLQUFILEdBQVcsR0FBRyxLQUFILENBQVMsS0FBcEI7QUFDQSxPQUFHLElBQUgsR0FBVSxHQUFHLEdBQUgsQ0FBTyxPQUFQLENBQWUsTUFBZixFQUF1QixFQUF2QixDQUFWO0FBQ0EsT0FBRyxRQUFILEdBQWMsQ0FBQyxJQUFJLElBQUosS0FBYSxJQUFJLElBQUosQ0FBUyxHQUFHLE9BQVosQ0FBZCxJQUFzQyxNQUFwRDtBQUNBLE9BQUcscUJBQUgsR0FBMkIsQ0FBQyxJQUFJLElBQUosS0FBYSxJQUFJLElBQUosQ0FBUyxHQUFHLE9BQVosQ0FBZCxJQUFzQyxNQUFqRTs7QUFFQSxPQUFHLFNBQUgsR0FBZSxpQkFBRSxHQUFGLENBQU0sR0FBRyxTQUFULEVBQW9CLFVBQUMsUUFBRDtBQUFBLGFBQWMsU0FBUyxLQUF2QjtBQUFBLEtBQXBCLENBQWY7QUFDQSxPQUFHLEtBQUgsR0FBVyxTQUFTLEVBQVQsQ0FBWDs7QUFFQSxTQUFLLE1BQU0sRUFBTixDQUFMOztBQUVBLFdBQU8sRUFBUDtBQUNELEdBZE0sQ0FBUDtBQWVEOztBQUVELFNBQVMsUUFBVCxDQUFrQixFQUFsQixFQUFzQjtBQUNwQixNQUFJLGFBQWEsR0FBRyxRQUFILENBQVksTUFBWixLQUF1QixDQUF4QztBQUNBLE1BQUcsR0FBRyxTQUFILENBQWEsTUFBYixLQUF3QixDQUF4QixJQUE2QixHQUFHLFFBQUgsR0FBYyxDQUE5QyxFQUFpRDtBQUMvQyxXQUFPLEVBQVAsQztBQUNEO0FBQ0QsTUFBRyxHQUFHLFFBQUgsR0FBYyxDQUFkLElBQW9CLEdBQUcsUUFBSCxHQUFjLENBQWQsSUFBbUIsVUFBMUMsRUFBdUQ7QUFDckQsV0FBTyxDQUFQLEM7QUFDRDtBQUNELFNBQU8sQ0FBUCxDO0FBQ0Q7O0FBRUQsU0FBUyxLQUFULENBQWUsRUFBZixFQUFtQjtBQUNqQixNQUFJLGlCQUFpQixDQUNuQixJQURtQixFQUVuQixRQUZtQixFQUduQixLQUhtQixFQUluQixVQUptQixFQUtuQixTQUxtQixFQU1uQixTQU5tQixFQU9uQixVQVBtQixFQVFuQix1QkFSbUIsQ0FBckI7O0FBV0EsU0FBTyxpQkFBRSxJQUFGLENBQU8sRUFBUCxFQUFXLGNBQVgsQ0FBUDtBQUNEIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgZ2V0UmVwb3NpdG9yaWVzIGZyb20gJy4uL3JldHJpZXZlJztcblxubGV0IG9uZURheSA9IDI0ICogNjAgKiA2MCAqIDEwMDA7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHByb2Nlc3NQUnMoKSB7XG4gIHJldHVybiBnZXRSZXBvc2l0b3JpZXMoeyByZXBvOiAnY2JheC0nIH0pXG4gICAgLnRoZW4oKHJlcG9zKSA9PiBfLmZpbHRlcihyZXBvcywgKHIpID0+IHIucHVsbFJlcXVlc3RzLmxlbmd0aCA+IDAgKSlcbiAgICAudGhlbigocmVwb3MpID0+IF8ubWFwKHJlcG9zLCBtYXBQUnMpKVxuICAgIC50aGVuKChQUnMpID0+IF8uZmxhdHRlbihQUnMpKVxuICAgIC8vLnRhcChjb25zb2xlLmxvZyk7XG59XG5cbmZ1bmN0aW9uIG1hcFBScyhyZXBvKSB7XG4gIHJldHVybiBfLm1hcChyZXBvLnB1bGxSZXF1ZXN0cywgKFBSKSA9PiB7XG5cbiAgICBQUi5yZXBvID0gcmVwby5uYW1lO1xuICAgIFBSLm93bmVyID0gUFIub3duZXIubG9naW47XG4gICAgUFIubGluayA9IFBSLnVybC5yZXBsYWNlKCdhcGkuJywgJycpO1xuICAgIFBSLnRpbWVPcGVuID0gKG5ldyBEYXRlKCkgLSBuZXcgRGF0ZShQUi5jcmVhdGVkKSkgLyBvbmVEYXk7XG4gICAgUFIudGltZVNpbmNlTGFzdE1vZGlmaWVkID0gKG5ldyBEYXRlKCkgLSBuZXcgRGF0ZShQUi51cGRhdGVkKSkgLyBvbmVEYXk7XG5cbiAgICBQUi5hc3NpZ25lZXMgPSBfLm1hcChQUi5hc3NpZ25lZXMsIChhc3NpZ25lZSkgPT4gYXNzaWduZWUubG9naW4pO1xuICAgIFBSLmxldmVsID0gZ2V0TGV2ZWwoUFIpO1xuXG4gICAgUFIgPSBwcnVuZShQUik7XG5cbiAgICByZXR1cm4gUFI7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBnZXRMZXZlbChQUikge1xuICBsZXQgbm9Db21tZW50cyA9IFBSLmNvbW1lbnRzLmxlbmd0aCA9PT0gMDtcbiAgaWYoUFIuYXNzaWduZWVzLmxlbmd0aCA9PT0gMCB8fCBQUi50aW1lT3BlbiA+IDMpIHtcbiAgICByZXR1cm4gMTA7IC8vcmVkOiBubyBhc3NpZ25lZXMgb3Igc3RhbGVcbiAgfVxuICBpZihQUi50aW1lT3BlbiA+IDIgfHwgKFBSLnRpbWVPcGVuID4gMSAmJiBub0NvbW1lbnRzKSkge1xuICAgIHJldHVybiA1OyAvL3llbGxvdyBnb2luZyBzdGFsZSAob3V0c3RhbmRpbmcgPiAyIGRheXMgb3Igbm8gY29tbWVudHMgZnJvbSBhc3NpZ25lZXMgeWV0ICYmIG9sZGVyIHRoYW4gMTYgaG91cnMpXG4gIH1cbiAgcmV0dXJuIDA7IC8vZ3JlZW5cbn1cblxuZnVuY3Rpb24gcHJ1bmUoUFIpIHtcbiAgbGV0IGZpZWxkc1RvUmVtb3ZlID0gW1xuICAgICdpZCcsXG4gICAgJ251bWJlcicsXG4gICAgJ3VybCcsXG4gICAgJ2NvbW1lbnRzJyxcbiAgICAnY3JlYXRlZCcsXG4gICAgJ3VwZGF0ZWQnLFxuICAgICd0aW1lT3BlbicsXG4gICAgJ3RpbWVTaW5jZUxhc3RNb2RpZmllZCdcbiAgXTtcblxuICByZXR1cm4gXy5vbWl0KFBSLCBmaWVsZHNUb1JlbW92ZSk7XG59Il19