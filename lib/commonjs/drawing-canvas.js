"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _reactNativeSkia = require("@shopify/react-native-skia");
var _styles = _interopRequireDefault(require("./styles.js"));
var _react = _interopRequireWildcard(require("react"));
var _reactNativeGestureHandler = require("react-native-gesture-handler");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const DrawingCanvas = ({
  foreground,
  drawingPath
}) => {
  const panGesture = (0, _react.useMemo)(() => _reactNativeGestureHandler.Gesture.Pan().onBegin(e => {
    console.log(e.absoluteX);
  }).onUpdate(e => {
    console.log(e.absoluteX);
  }).onFinalize(e => {
    console.log(e.absoluteX);
  }), []);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeGestureHandler.GestureDetector, {
    gesture: panGesture,
    children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNativeSkia.Canvas, {
      style: _styles.default.canvas,
      children: [drawingPath ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeSkia.Path, {
        path: drawingPath.path,
        color: drawingPath.strokeColor,
        stroke: {
          width: drawingPath.strokeWidth
        }
      }) : null, foreground ? foreground : null]
    })
  });
};
var _default = exports.default = DrawingCanvas;
//# sourceMappingURL=drawing-canvas.js.map