'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _retrieve = require('../build/retrieve');

var _retrieve2 = _interopRequireDefault(_retrieve);

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

app.post('/hipchat/notify', function (req, res) {
  (0, _notify2.default)(req.body).catch(function (err) {
    return res.status(500).json({ error: err.toString() });
  });
});

app.listen(12121, function () {
  return console.log('listening', 12121);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNLE1BQU0sd0JBQVo7O0FBRUEsSUFBSSxHQUFKLENBQVEsZUFBUixFQUF5QixVQUFDLEdBQUQsRUFBTSxHQUFOLEVBQWM7QUFDckMsMEJBQWdCLElBQUksS0FBcEIsRUFDRyxHQURILENBQ087QUFBQSxXQUFTLGFBQUcsYUFBSCxDQUFpQixnQkFBSyxTQUFMLEVBQWdCLG9CQUFoQixDQUFqQixFQUF3RCxLQUFLLFNBQUwsQ0FBZSxLQUFmLEVBQXNCLElBQXRCLEVBQTRCLENBQTVCLENBQXhELENBQVQ7QUFBQSxHQURQLEVBRUcsSUFGSCxDQUVRO0FBQUEsV0FBUyxJQUFJLElBQUosQ0FBUyxFQUFFLFlBQUYsRUFBVCxDQUFUO0FBQUEsR0FGUixFQUdHLEtBSEgsQ0FHUztBQUFBLFdBQU8sSUFBSSxNQUFKLENBQVcsR0FBWCxFQUFnQixJQUFoQixDQUFxQixFQUFFLE9BQU8sSUFBSSxRQUFKLEVBQVQsRUFBckIsQ0FBUDtBQUFBLEdBSFQ7QUFJRCxDQUxEOztBQU9BLElBQUksSUFBSixDQUFTLGlCQUFULEVBQTRCLFVBQUMsR0FBRCxFQUFNLEdBQU4sRUFBYztBQUN4Qyx3QkFBYyxJQUFJLElBQWxCLEVBQ0csS0FESCxDQUNTO0FBQUEsV0FBTyxJQUFJLE1BQUosQ0FBVyxHQUFYLEVBQWdCLElBQWhCLENBQXFCLEVBQUUsT0FBTyxJQUFJLFFBQUosRUFBVCxFQUFyQixDQUFQO0FBQUEsR0FEVDtBQUVELENBSEQ7O0FBS0EsSUFBSSxNQUFKLENBQVcsS0FBWCxFQUFrQjtBQUFBLFNBQU0sUUFBUSxHQUFSLENBQVksV0FBWixFQUF5QixLQUF6QixDQUFOO0FBQUEsQ0FBbEIiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcbmltcG9ydCB7IGpvaW4gfSBmcm9tICdwYXRoJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgZ2V0UmVwb3NpdG9yaWVzIGZyb20gJy4uL2J1aWxkL3JldHJpZXZlJztcbmltcG9ydCBub3RpZnlIaXBjaGF0IGZyb20gJy4uL2J1aWxkL25vdGlmeSc7XG5cbmNvbnN0IGFwcCA9IGV4cHJlc3MoKTtcblxuYXBwLmdldCgnL2dpdGh1Yi9yZXBvcycsIChyZXEsIHJlcykgPT4ge1xuICBnZXRSZXBvc2l0b3JpZXMocmVxLnF1ZXJ5KVxuICAgIC50YXAocmVwb3MgPT4gZnMud3JpdGVGaWxlU3luYyhqb2luKF9fZGlybmFtZSwgJ2Z1bGxfcmVzcG9uc2UuanNvbicpLCBKU09OLnN0cmluZ2lmeShyZXBvcywgbnVsbCwgMikpKVxuICAgIC50aGVuKHJlcG9zID0+IHJlcy5qc29uKHsgcmVwb3MgfSkpXG4gICAgLmNhdGNoKGVyciA9PiByZXMuc3RhdHVzKDUwMCkuanNvbih7IGVycm9yOiBlcnIudG9TdHJpbmcoKSB9KSlcbn0pXG5cbmFwcC5wb3N0KCcvaGlwY2hhdC9ub3RpZnknLCAocmVxLCByZXMpID0+IHtcbiAgbm90aWZ5SGlwY2hhdChyZXEuYm9keSlcbiAgICAuY2F0Y2goZXJyID0+IHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgZXJyb3I6IGVyci50b1N0cmluZygpIH0pKVxufSlcblxuYXBwLmxpc3RlbigxMjEyMSwgKCkgPT4gY29uc29sZS5sb2coJ2xpc3RlbmluZycsIDEyMTIxKSk7Il19