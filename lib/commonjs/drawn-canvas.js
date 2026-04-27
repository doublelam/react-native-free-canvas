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
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
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
  (0, _react.useEffect)(() => {
    const last = context?.drawnPaths.at(-1);
    if (last && context?.pathCompleteDelivery) {
      try {
        context.pathCompleteDelivery.resolve(last.key, true);
      } catch {
        // Nothing to do here;
      }
    }
  }, [context?.drawnPaths]);
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