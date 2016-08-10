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
  PR.comments = _lodash2.default.filter(PR.comments, function (comment) {
    if (comment.user.login !== PR.owner) {
      return true;
    }
  });
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
  var fieldsToRemove = ['number', 'url', 'comments', 'created', 'updated', 'timeOpen', 'timeSinceLastModified'];

  return _lodash2.default.omit(PR, fieldsToRemove);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wcm9jZXNzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O2tCQU93QixVOztBQVB4Qjs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBSSxTQUFTLEtBQUssRUFBTCxHQUFVLEVBQVYsR0FBZSxJQUE1Qjs7QUFFZSxTQUFTLFVBQVQsR0FBc0I7QUFDbkMsU0FBTyx3QkFBZ0IsRUFBRSxNQUFNLE9BQVIsRUFBaEIsRUFDSixJQURJLENBQ0MsVUFBQyxLQUFEO0FBQUEsV0FBVyxpQkFBRSxNQUFGLENBQVMsS0FBVCxFQUFnQixVQUFDLENBQUQ7QUFBQSxhQUFPLEVBQUUsWUFBRixDQUFlLE1BQWYsR0FBd0IsQ0FBL0I7QUFBQSxLQUFoQixDQUFYO0FBQUEsR0FERCxFQUVKLElBRkksQ0FFQyxVQUFDLEtBQUQ7QUFBQSxXQUFXLGlCQUFFLEdBQUYsQ0FBTSxLQUFOLEVBQWEsTUFBYixDQUFYO0FBQUEsR0FGRCxFQUdKLElBSEksQ0FHQyxVQUFDLEdBQUQ7QUFBQSxXQUFTLGlCQUFFLE9BQUYsQ0FBVSxHQUFWLENBQVQ7QUFBQSxHQUhELENBQVA7QUFJRTtBQUNIOztBQUVELFNBQVMsTUFBVCxDQUFnQixJQUFoQixFQUFzQjtBQUNwQixTQUFPLGlCQUFFLEdBQUYsQ0FBTSxLQUFLLFlBQVgsRUFBeUIsVUFBQyxFQUFELEVBQVE7O0FBRXRDLE9BQUcsSUFBSCxHQUFVLEtBQUssSUFBZjtBQUNBLE9BQUcsS0FBSCxHQUFXLEdBQUcsS0FBSCxDQUFTLEtBQXBCO0FBQ0EsT0FBRyxJQUFILEdBQVUsR0FBRyxHQUFiO0FBQ0EsT0FBRyxRQUFILEdBQWMsQ0FBQyxJQUFJLElBQUosS0FBYSxJQUFJLElBQUosQ0FBUyxHQUFHLE9BQVosQ0FBZCxJQUFzQyxNQUFwRDtBQUNBLE9BQUcscUJBQUgsR0FBMkIsQ0FBQyxJQUFJLElBQUosS0FBYSxJQUFJLElBQUosQ0FBUyxHQUFHLE9BQVosQ0FBZCxJQUFzQyxNQUFqRTs7QUFFQSxPQUFHLFNBQUgsR0FBZSxpQkFBRSxHQUFGLENBQU0sR0FBRyxTQUFULEVBQW9CLFVBQUMsUUFBRDtBQUFBLGFBQWMsU0FBUyxLQUF2QjtBQUFBLEtBQXBCLENBQWY7QUFDQSxPQUFHLEtBQUgsR0FBVyxTQUFTLEVBQVQsQ0FBWDs7QUFFQSxTQUFLLE1BQU0sRUFBTixDQUFMOztBQUVBLFdBQU8sRUFBUDtBQUNELEdBZE0sQ0FBUDtBQWVEOztBQUVELFNBQVMsUUFBVCxDQUFrQixFQUFsQixFQUFzQjtBQUNwQixLQUFHLFFBQUgsR0FBYyxpQkFBRSxNQUFGLENBQVMsR0FBRyxRQUFaLEVBQXNCLFVBQUMsT0FBRCxFQUFhO0FBQy9DLFFBQUcsUUFBUSxJQUFSLENBQWEsS0FBYixLQUF1QixHQUFHLEtBQTdCLEVBQW9DO0FBQ2xDLGFBQU8sSUFBUDtBQUNEO0FBQ0YsR0FKYSxDQUFkO0FBS0EsTUFBSSxhQUFhLEdBQUcsUUFBSCxDQUFZLE1BQVosS0FBdUIsQ0FBeEM7QUFDQSxNQUFHLEdBQUcsU0FBSCxDQUFhLE1BQWIsS0FBd0IsQ0FBeEIsSUFBNkIsR0FBRyxRQUFILEdBQWMsQ0FBOUMsRUFBaUQ7QUFDL0MsV0FBTyxFQUFQLENBQVc7QUFDWjtBQUNELE1BQUcsR0FBRyxRQUFILEdBQWMsQ0FBZCxJQUFvQixHQUFHLFFBQUgsR0FBYyxDQUFkLElBQW1CLFVBQTFDLEVBQXVEO0FBQ3JELFdBQU8sQ0FBUCxDQUFVO0FBQ1g7QUFDRCxTQUFPLENBQVAsQ0FBVTtBQUNYOztBQUVELFNBQVMsS0FBVCxDQUFlLEVBQWYsRUFBbUI7QUFDakIsTUFBSSxpQkFBaUIsQ0FDbkIsUUFEbUIsRUFFbkIsS0FGbUIsRUFHbkIsVUFIbUIsRUFJbkIsU0FKbUIsRUFLbkIsU0FMbUIsRUFNbkIsVUFObUIsRUFPbkIsdUJBUG1CLENBQXJCOztBQVVBLFNBQU8saUJBQUUsSUFBRixDQUFPLEVBQVAsRUFBVyxjQUFYLENBQVA7QUFDRCIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IGdldFJlcG9zaXRvcmllcyBmcm9tICcuLi9yZXRyaWV2ZSc7XG5cbmxldCBvbmVEYXkgPSAyNCAqIDYwICogNjAgKiAxMDAwO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwcm9jZXNzUFJzKCkge1xuICByZXR1cm4gZ2V0UmVwb3NpdG9yaWVzKHsgcmVwbzogJ2NiYXgtJyB9KVxuICAgIC50aGVuKChyZXBvcykgPT4gXy5maWx0ZXIocmVwb3MsIChyKSA9PiByLnB1bGxSZXF1ZXN0cy5sZW5ndGggPiAwICkpXG4gICAgLnRoZW4oKHJlcG9zKSA9PiBfLm1hcChyZXBvcywgbWFwUFJzKSlcbiAgICAudGhlbigoUFJzKSA9PiBfLmZsYXR0ZW4oUFJzKSlcbiAgICAvLy50YXAoY29uc29sZS5sb2cpO1xufVxuXG5mdW5jdGlvbiBtYXBQUnMocmVwbykge1xuICByZXR1cm4gXy5tYXAocmVwby5wdWxsUmVxdWVzdHMsIChQUikgPT4ge1xuXG4gICAgUFIucmVwbyA9IHJlcG8ubmFtZTtcbiAgICBQUi5vd25lciA9IFBSLm93bmVyLmxvZ2luO1xuICAgIFBSLmxpbmsgPSBQUi51cmw7XG4gICAgUFIudGltZU9wZW4gPSAobmV3IERhdGUoKSAtIG5ldyBEYXRlKFBSLmNyZWF0ZWQpKSAvIG9uZURheTtcbiAgICBQUi50aW1lU2luY2VMYXN0TW9kaWZpZWQgPSAobmV3IERhdGUoKSAtIG5ldyBEYXRlKFBSLnVwZGF0ZWQpKSAvIG9uZURheTtcblxuICAgIFBSLmFzc2lnbmVlcyA9IF8ubWFwKFBSLmFzc2lnbmVlcywgKGFzc2lnbmVlKSA9PiBhc3NpZ25lZS5sb2dpbik7XG4gICAgUFIubGV2ZWwgPSBnZXRMZXZlbChQUik7XG5cbiAgICBQUiA9IHBydW5lKFBSKTtcblxuICAgIHJldHVybiBQUjtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldExldmVsKFBSKSB7XG4gIFBSLmNvbW1lbnRzID0gXy5maWx0ZXIoUFIuY29tbWVudHMsIChjb21tZW50KSA9PiB7XG4gICAgaWYoY29tbWVudC51c2VyLmxvZ2luICE9PSBQUi5vd25lcikge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9KTtcbiAgbGV0IG5vQ29tbWVudHMgPSBQUi5jb21tZW50cy5sZW5ndGggPT09IDA7XG4gIGlmKFBSLmFzc2lnbmVlcy5sZW5ndGggPT09IDAgfHwgUFIudGltZU9wZW4gPiAzKSB7XG4gICAgcmV0dXJuIDEwOyAvL3JlZDogbm8gYXNzaWduZWVzIG9yIHN0YWxlXG4gIH1cbiAgaWYoUFIudGltZU9wZW4gPiAyIHx8IChQUi50aW1lT3BlbiA+IDEgJiYgbm9Db21tZW50cykpIHtcbiAgICByZXR1cm4gNTsgLy95ZWxsb3cgZ29pbmcgc3RhbGUgKG91dHN0YW5kaW5nID4gMiBkYXlzIG9yIG5vIGNvbW1lbnRzIGZyb20gYXNzaWduZWVzIHlldCAmJiBvbGRlciB0aGFuIDE2IGhvdXJzKVxuICB9XG4gIHJldHVybiAwOyAvL2dyZWVuXG59XG5cbmZ1bmN0aW9uIHBydW5lKFBSKSB7XG4gIGxldCBmaWVsZHNUb1JlbW92ZSA9IFtcbiAgICAnbnVtYmVyJyxcbiAgICAndXJsJyxcbiAgICAnY29tbWVudHMnLFxuICAgICdjcmVhdGVkJyxcbiAgICAndXBkYXRlZCcsXG4gICAgJ3RpbWVPcGVuJyxcbiAgICAndGltZVNpbmNlTGFzdE1vZGlmaWVkJ1xuICBdO1xuXG4gIHJldHVybiBfLm9taXQoUFIsIGZpZWxkc1RvUmVtb3ZlKTtcbn0iXX0=