"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _reactNativeSkia = require("@shopify/react-native-skia");
var _styles = _interopRequireDefault(require("./styles.js"));
var _reactNativeReanimated = require("react-native-reanimated");
var _react = _interopRequireWildcard(require("react"));
var _canvasContext = _interopRequireDefault(require("./canvas-context.js"));
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const DrawnCanvas = /*#__PURE__*/(0, _react.forwardRef)(({
  background,
  pathEffect,
  foreground,
  backgroundColor
}, ref) => {
  const sizeSharedValue = (0, _reactNativeReanimated.useSharedValue)({
    width: 0,
    height: 0
  });
  const derivedWidth = (0, _reactNativeReanimated.useDerivedValue)(() => sizeSharedValue.value.width, []);
  const derivedHeight = (0, _reactNativeReanimated.useDerivedValue)(() => sizeSharedValue.value.height, []);
  const context = (0, _react.useContext)(_canvasContext.default);
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNativeSkia.Canvas, {
    ref: ref,
    style: _styles.default.canvas,
    onSize: sizeSharedValue,
    children: [backgroundColor ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeSkia.Rect, {
      x: 0,
      y: 0,
      width: derivedWidth,
      height: derivedHeight,
      color: backgroundColor
    }) : null, background, context?.drawnPaths.map((path, index) => /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeSkia.Path, {
      style: "stroke",
      path: path.path,
      strokeWidth: path.strokeWidth,
      strokeJoin: "round",
      strokeCap: "round",
      color: path.strokeColor,
      children: pathEffect
    }, index)), foreground]
  });
});
var _default = exports.default = DrawnCanvas;
//# sourceMappingURL=drawn-canvas.js.map