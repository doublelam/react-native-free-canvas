"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _reactNativeSkia = require("@shopify/react-native-skia");
var _styles = _interopRequireDefault(require("./styles.js"));
var _reactNativeReanimated = require("react-native-reanimated");
var _react = _interopRequireDefault(require("react"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const DrawnCanvas = ({
  background,
  backgroundColor
}) => {
  const sizeSharedValue = (0, _reactNativeReanimated.useSharedValue)({
    width: 0,
    height: 0
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNativeSkia.Canvas, {
    style: _styles.default.canvas,
    onSize: sizeSharedValue,
    children: [backgroundColor ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeSkia.Rect, {
      x: 0,
      y: 0,
      width: sizeSharedValue.value.width,
      height: sizeSharedValue.value.height,
      color: backgroundColor
    }) : null, background]
  });
};
var _default = exports.default = DrawnCanvas;
//# sourceMappingURL=drawn-canvas.js.map