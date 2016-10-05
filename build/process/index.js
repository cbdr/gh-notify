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

    debugger;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wcm9jZXNzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O2tCQU93QixVOztBQVB4Qjs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBSSxTQUFTLEtBQUssRUFBTCxHQUFVLEVBQVYsR0FBZSxJQUE1Qjs7QUFFZSxTQUFTLFVBQVQsR0FBOEM7QUFBQSxNQUExQixJQUEwQix5REFBbkIsRUFBRSxNQUFNLE9BQVIsRUFBbUI7O0FBQzNELFNBQU8sd0JBQWdCLElBQWhCLEVBQ0osSUFESSxDQUNDLFVBQUMsS0FBRDtBQUFBLFdBQVcsaUJBQUUsTUFBRixDQUFTLEtBQVQsRUFBZ0IsVUFBQyxDQUFEO0FBQUEsYUFBTyxFQUFFLFlBQUYsQ0FBZSxNQUFmLEdBQXdCLENBQS9CO0FBQUEsS0FBaEIsQ0FBWDtBQUFBLEdBREQsRUFFSixJQUZJLENBRUMsVUFBQyxLQUFEO0FBQUEsV0FBVyxpQkFBRSxHQUFGLENBQU0sS0FBTixFQUFhLE1BQWIsQ0FBWDtBQUFBLEdBRkQsRUFHSixJQUhJLENBR0MsVUFBQyxHQUFEO0FBQUEsV0FBUyxpQkFBRSxPQUFGLENBQVUsR0FBVixDQUFUO0FBQUEsR0FIRCxDQUFQOztBQUtEOztBQUVELFNBQVMsTUFBVCxDQUFnQixJQUFoQixFQUFzQjtBQUNwQixTQUFPLGlCQUFFLEdBQUYsQ0FBTSxLQUFLLFlBQVgsRUFBeUIsVUFBQyxFQUFELEVBQVE7O0FBRXRDO0FBQ0EsT0FBRyxJQUFILEdBQVUsS0FBSyxJQUFmO0FBQ0EsT0FBRyxLQUFILEdBQVcsR0FBRyxLQUFILENBQVMsS0FBcEI7QUFDQSxPQUFHLElBQUgsR0FBVSxHQUFHLEdBQWI7QUFDQSxPQUFHLFFBQUgsR0FBYyxDQUFDLElBQUksSUFBSixLQUFhLElBQUksSUFBSixDQUFTLEdBQUcsT0FBWixDQUFkLElBQXNDLE1BQXBEO0FBQ0EsT0FBRyxxQkFBSCxHQUEyQixDQUFDLElBQUksSUFBSixLQUFhLElBQUksSUFBSixDQUFTLEdBQUcsT0FBWixDQUFkLElBQXNDLE1BQWpFOztBQUVBLE9BQUcsU0FBSCxHQUFlLGlCQUFFLEdBQUYsQ0FBTSxHQUFHLFNBQVQsRUFBb0IsVUFBQyxRQUFEO0FBQUEsYUFBYyxTQUFTLEtBQXZCO0FBQUEsS0FBcEIsQ0FBZjtBQUNBLE9BQUcsS0FBSCxHQUFXLFNBQVMsRUFBVCxDQUFYOztBQUVBLFNBQUssTUFBTSxFQUFOLENBQUw7O0FBRUEsV0FBTyxFQUFQO0FBQ0QsR0FmTSxDQUFQO0FBZ0JEOztBQUVELFNBQVMsUUFBVCxDQUFrQixFQUFsQixFQUFzQjtBQUNwQixLQUFHLFFBQUgsR0FBYyxpQkFBRSxNQUFGLENBQVMsR0FBRyxRQUFaLEVBQXNCLFVBQUMsT0FBRCxFQUFhO0FBQy9DLFFBQUcsUUFBUSxJQUFSLENBQWEsS0FBYixLQUF1QixHQUFHLEtBQTdCLEVBQW9DO0FBQ2xDLGFBQU8sSUFBUDtBQUNEO0FBQ0YsR0FKYSxDQUFkO0FBS0EsTUFBSSxZQUFZLEdBQUcsTUFBSCxDQUFVLE1BQVYsR0FBbUIsQ0FBbkM7QUFDQSxNQUFJLGFBQWEsR0FBRyxRQUFILENBQVksTUFBWixLQUF1QixDQUF4QztBQUNBLE1BQUcsQ0FBQyxHQUFHLFNBQUgsQ0FBYSxNQUFiLEtBQXdCLENBQXhCLElBQTZCLEdBQUcsUUFBSCxJQUFlLENBQTdDLEtBQW1ELENBQUMsU0FBdkQsRUFBa0U7QUFDaEUsV0FBTyxFQUFQLEM7QUFDRDtBQUNELE1BQUcsQ0FBQyxHQUFHLFFBQUgsR0FBYyxDQUFkLElBQW9CLEdBQUcsUUFBSCxHQUFjLENBQWQsSUFBbUIsVUFBeEMsS0FBd0QsQ0FBQyxTQUE1RCxFQUF1RTtBQUNyRSxXQUFPLENBQVAsQztBQUNEO0FBQ0QsU0FBTyxDQUFQLEM7QUFDRDs7QUFFRCxTQUFTLEtBQVQsQ0FBZSxFQUFmLEVBQW1CO0FBQ2pCLE1BQUksaUJBQWlCLENBQ25CLElBRG1CLEVBRW5CLFFBRm1CLEVBR25CLEtBSG1CLEVBSW5CLFVBSm1CLEVBS25CLFNBTG1CLEVBTW5CLFNBTm1CLEVBT25CLFVBUG1CLEVBUW5CLHVCQVJtQixDQUFyQjs7QUFXQSxTQUFPLGlCQUFFLElBQUYsQ0FBTyxFQUFQLEVBQVcsY0FBWCxDQUFQO0FBQ0QiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBnZXRSZXBvc2l0b3JpZXMgZnJvbSAnLi4vcmV0cmlldmUnO1xuXG5sZXQgb25lRGF5ID0gMjQgKiA2MCAqIDYwICogMTAwMDtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcHJvY2Vzc1BScyhyZXBvID0geyByZXBvOiAnY2JheC0nIH0pIHtcbiAgcmV0dXJuIGdldFJlcG9zaXRvcmllcyhyZXBvKVxuICAgIC50aGVuKChyZXBvcykgPT4gXy5maWx0ZXIocmVwb3MsIChyKSA9PiByLnB1bGxSZXF1ZXN0cy5sZW5ndGggPiAwICkpXG4gICAgLnRoZW4oKHJlcG9zKSA9PiBfLm1hcChyZXBvcywgbWFwUFJzKSlcbiAgICAudGhlbigoUFJzKSA9PiBfLmZsYXR0ZW4oUFJzKSlcbiAgICAvLy50YXAoY29uc29sZS5sb2cpO1xufVxuXG5mdW5jdGlvbiBtYXBQUnMocmVwbykge1xuICByZXR1cm4gXy5tYXAocmVwby5wdWxsUmVxdWVzdHMsIChQUikgPT4ge1xuXG4gICAgZGVidWdnZXI7XG4gICAgUFIucmVwbyA9IHJlcG8ubmFtZTtcbiAgICBQUi5vd25lciA9IFBSLm93bmVyLmxvZ2luO1xuICAgIFBSLmxpbmsgPSBQUi51cmw7XG4gICAgUFIudGltZU9wZW4gPSAobmV3IERhdGUoKSAtIG5ldyBEYXRlKFBSLmNyZWF0ZWQpKSAvIG9uZURheTtcbiAgICBQUi50aW1lU2luY2VMYXN0TW9kaWZpZWQgPSAobmV3IERhdGUoKSAtIG5ldyBEYXRlKFBSLnVwZGF0ZWQpKSAvIG9uZURheTtcblxuICAgIFBSLmFzc2lnbmVlcyA9IF8ubWFwKFBSLmFzc2lnbmVlcywgKGFzc2lnbmVlKSA9PiBhc3NpZ25lZS5sb2dpbik7XG4gICAgUFIubGV2ZWwgPSBnZXRMZXZlbChQUik7XG5cbiAgICBQUiA9IHBydW5lKFBSKTtcblxuICAgIHJldHVybiBQUjtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldExldmVsKFBSKSB7XG4gIFBSLmNvbW1lbnRzID0gXy5maWx0ZXIoUFIuY29tbWVudHMsIChjb21tZW50KSA9PiB7XG4gICAgaWYoY29tbWVudC51c2VyLmxvZ2luICE9PSBQUi5vd25lcikge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9KTtcbiAgbGV0IGhhc0xhYmVscyA9IFBSLmxhYmVscy5sZW5ndGggPiAwO1xuICBsZXQgbm9Db21tZW50cyA9IFBSLmNvbW1lbnRzLmxlbmd0aCA9PT0gMDtcbiAgaWYoKFBSLmFzc2lnbmVlcy5sZW5ndGggPT09IDAgfHwgUFIudGltZU9wZW4gPj0gNCkgJiYgIWhhc0xhYmVscykge1xuICAgIHJldHVybiAxMDsgLy9yZWQ6IG5vIGFzc2lnbmVlcyBvciBzdGFsZVxuICB9XG4gIGlmKChQUi50aW1lT3BlbiA+IDIgfHwgKFBSLnRpbWVPcGVuID4gMSAmJiBub0NvbW1lbnRzKSkgJiYgIWhhc0xhYmVscykge1xuICAgIHJldHVybiA1OyAvL3llbGxvdyBnb2luZyBzdGFsZSAob3V0c3RhbmRpbmcgPiAyIGRheXMgb3Igbm8gY29tbWVudHMgZnJvbSBhc3NpZ25lZXMgeWV0ICYmIG9sZGVyIHRoYW4gMTYgaG91cnMpXG4gIH1cbiAgcmV0dXJuIDA7IC8vZ3JlZW5cbn1cblxuZnVuY3Rpb24gcHJ1bmUoUFIpIHtcbiAgbGV0IGZpZWxkc1RvUmVtb3ZlID0gW1xuICAgICdpZCcsXG4gICAgJ251bWJlcicsXG4gICAgJ3VybCcsXG4gICAgJ2NvbW1lbnRzJyxcbiAgICAnY3JlYXRlZCcsXG4gICAgJ3VwZGF0ZWQnLFxuICAgICd0aW1lT3BlbicsXG4gICAgJ3RpbWVTaW5jZUxhc3RNb2RpZmllZCdcbiAgXTtcblxuICByZXR1cm4gXy5vbWl0KFBSLCBmaWVsZHNUb1JlbW92ZSk7XG59Il19