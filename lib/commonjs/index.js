"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _reactNativeGestureHandler = require("react-native-gesture-handler");
var _styles = _interopRequireDefault(require("./styles.js"));
var _drawnCanvas = _interopRequireDefault(require("./drawn-canvas.js"));
var _drawingCanvas = _interopRequireDefault(require("./drawing-canvas.js"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const FreeCanvas = ({
  style,
  foreground
}) => {
  const sizeSharedVal = (0, _reactNativeReanimated.useSharedValue)({
    width: 0,
    height: 0
  });
  const [drawnPaths, setDrawnPaths] = (0, _react.useState)([]);
  const [drawingPath, setDrawingPath] = (0, _react.useState)(null);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: style,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeReanimated.default.View, {
      style: _styles.default.flex1,
      children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNativeGestureHandler.GestureHandlerRootView, {
        style: _styles.default.flex1,
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_drawnCanvas.default, {}), /*#__PURE__*/(0, _jsxRuntime.jsx)(_drawingCanvas.default, {})]
      })
    })
  });
};
var _default = exports.default = /*#__PURE__*/_react.default.memo(FreeCanvas);
//# sourceMappingURL=index.js.map