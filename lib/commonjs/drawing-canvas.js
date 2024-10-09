"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _reactNativeSkia = require("@shopify/react-native-skia");
var _styles = _interopRequireDefault(require("./styles.js"));
var _react = _interopRequireDefault(require("react"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const DrawingCanvas = ({
  foreground,
  drawingPath
}) => {
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNativeSkia.Canvas, {
    style: _styles.default.canvas,
    children: [drawingPath ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeSkia.Path, {
      path: drawingPath.path,
      color: drawingPath.strokeColor,
      stroke: {
        width: drawingPath.strokeWidth
      }
    }) : null, foreground ? foreground : null]
  });
};
var _default = exports.default = DrawingCanvas;
//# sourceMappingURL=drawing-canvas.js.map