'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _retrieve = require('../build/retrieve');

var _retrieve2 = _interopRequireDefault(_retrieve);

var _process = require('../build/process');

var _process2 = _interopRequireDefault(_process);

var _notify = require('../build/notify');

var _notify2 = _interopRequireDefault(_notify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

app.get('/github/repos', function (req, res) {
  (0, _retrieve2.default)(req.query).tap(function (repos) {
    return _fs2.default.writeFileSync((0, _path.join)(__dirname, 'full_response.json'), JSON.stringify(repos, null, 2));
  }).then(function (repos) {
    return res.json({ repos: repos });
  }).catch(function (err) {
    return res.status(500).json({ error: err.toString() });
  });
});

app.get('/github/prs', function (req, res) {
  (0, _process2.default)({ repo: req.query.repo }).then(function (pr) {
    return res.json({ pr: pr });
  }).catch(function (err) {
    return res.status(500).json({ error: err.toString() });
  });
});

app.post('/hipchat/notify', function (req, res) {
  (0, _notify2.default)(req.body).catch(function (err) {
    return res.status(500).json({ error: err.toString() });
  });
});

app.listen(12121, function () {
  return console.log('listening', 12121);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU0sTUFBTSx3QkFBWjs7QUFFQSxJQUFJLEdBQUosQ0FBUSxlQUFSLEVBQXlCLFVBQUMsR0FBRCxFQUFNLEdBQU4sRUFBYztBQUNyQywwQkFBZ0IsSUFBSSxLQUFwQixFQUNHLEdBREgsQ0FDTztBQUFBLFdBQVMsYUFBRyxhQUFILENBQWlCLGdCQUFLLFNBQUwsRUFBZ0Isb0JBQWhCLENBQWpCLEVBQXdELEtBQUssU0FBTCxDQUFlLEtBQWYsRUFBc0IsSUFBdEIsRUFBNEIsQ0FBNUIsQ0FBeEQsQ0FBVDtBQUFBLEdBRFAsRUFFRyxJQUZILENBRVE7QUFBQSxXQUFTLElBQUksSUFBSixDQUFTLEVBQUUsWUFBRixFQUFULENBQVQ7QUFBQSxHQUZSLEVBR0csS0FISCxDQUdTO0FBQUEsV0FBTyxJQUFJLE1BQUosQ0FBVyxHQUFYLEVBQWdCLElBQWhCLENBQXFCLEVBQUUsT0FBTyxJQUFJLFFBQUosRUFBVCxFQUFyQixDQUFQO0FBQUEsR0FIVDtBQUlELENBTEQ7O0FBT0EsSUFBSSxHQUFKLENBQVEsYUFBUixFQUF1QixVQUFDLEdBQUQsRUFBTSxHQUFOLEVBQWM7QUFDbkMseUJBQVcsRUFBRSxNQUFNLElBQUksS0FBSixDQUFVLElBQWxCLEVBQVgsRUFDRyxJQURILENBQ1E7QUFBQSxXQUFNLElBQUksSUFBSixDQUFTLEVBQUUsTUFBRixFQUFULENBQU47QUFBQSxHQURSLEVBRUcsS0FGSCxDQUVTO0FBQUEsV0FBTyxJQUFJLE1BQUosQ0FBVyxHQUFYLEVBQWdCLElBQWhCLENBQXFCLEVBQUUsT0FBTyxJQUFJLFFBQUosRUFBVCxFQUFyQixDQUFQO0FBQUEsR0FGVDtBQUdELENBSkQ7O0FBTUEsSUFBSSxJQUFKLENBQVMsaUJBQVQsRUFBNEIsVUFBQyxHQUFELEVBQU0sR0FBTixFQUFjO0FBQ3hDLHdCQUFjLElBQUksSUFBbEIsRUFDRyxLQURILENBQ1M7QUFBQSxXQUFPLElBQUksTUFBSixDQUFXLEdBQVgsRUFBZ0IsSUFBaEIsQ0FBcUIsRUFBRSxPQUFPLElBQUksUUFBSixFQUFULEVBQXJCLENBQVA7QUFBQSxHQURUO0FBRUQsQ0FIRDs7QUFLQSxJQUFJLE1BQUosQ0FBVyxLQUFYLEVBQWtCO0FBQUEsU0FBTSxRQUFRLEdBQVIsQ0FBWSxXQUFaLEVBQXlCLEtBQXpCLENBQU47QUFBQSxDQUFsQiIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IHsgam9pbiB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBnZXRSZXBvc2l0b3JpZXMgZnJvbSAnLi4vYnVpbGQvcmV0cmlldmUnO1xuaW1wb3J0IHByb2Nlc3NQUnMgZnJvbSAnLi4vYnVpbGQvcHJvY2Vzcyc7XG5pbXBvcnQgbm90aWZ5SGlwY2hhdCBmcm9tICcuLi9idWlsZC9ub3RpZnknO1xuXG5jb25zdCBhcHAgPSBleHByZXNzKCk7XG5cbmFwcC5nZXQoJy9naXRodWIvcmVwb3MnLCAocmVxLCByZXMpID0+IHtcbiAgZ2V0UmVwb3NpdG9yaWVzKHJlcS5xdWVyeSlcbiAgICAudGFwKHJlcG9zID0+IGZzLndyaXRlRmlsZVN5bmMoam9pbihfX2Rpcm5hbWUsICdmdWxsX3Jlc3BvbnNlLmpzb24nKSwgSlNPTi5zdHJpbmdpZnkocmVwb3MsIG51bGwsIDIpKSlcbiAgICAudGhlbihyZXBvcyA9PiByZXMuanNvbih7IHJlcG9zIH0pKVxuICAgIC5jYXRjaChlcnIgPT4gcmVzLnN0YXR1cyg1MDApLmpzb24oeyBlcnJvcjogZXJyLnRvU3RyaW5nKCkgfSkpXG59KVxuXG5hcHAuZ2V0KCcvZ2l0aHViL3BycycsIChyZXEsIHJlcykgPT4ge1xuICBwcm9jZXNzUFJzKHsgcmVwbzogcmVxLnF1ZXJ5LnJlcG8gfSlcbiAgICAudGhlbihwciA9PiByZXMuanNvbih7IHByIH0pKVxuICAgIC5jYXRjaChlcnIgPT4gcmVzLnN0YXR1cyg1MDApLmpzb24oeyBlcnJvcjogZXJyLnRvU3RyaW5nKCkgfSkpXG59KVxuXG5hcHAucG9zdCgnL2hpcGNoYXQvbm90aWZ5JywgKHJlcSwgcmVzKSA9PiB7XG4gIG5vdGlmeUhpcGNoYXQocmVxLmJvZHkpXG4gICAgLmNhdGNoKGVyciA9PiByZXMuc3RhdHVzKDUwMCkuanNvbih7IGVycm9yOiBlcnIudG9TdHJpbmcoKSB9KSlcbn0pXG5cbmFwcC5saXN0ZW4oMTIxMjEsICgpID0+IGNvbnNvbGUubG9nKCdsaXN0ZW5pbmcnLCAxMjEyMSkpOyJdfQ==