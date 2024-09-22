"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _reactNativeSkia = require("@shopify/react-native-skia");
var _styles = _interopRequireDefault(require("./styles.js"));
var _reactNativeReanimated = require("react-native-reanimated");
var _react = _interopRequireWildcard(require("react"));
var _reactNativeGestureHandler = require("react-native-gesture-handler");
var _reactNative = require("react-native");
var _canvasContext = _interopRequireDefault(require("./canvas-context.js"));
var _utils = require("./utils.js");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/* eslint-disable @typescript-eslint/no-explicit-any */

const DrawingCanvas = /*#__PURE__*/(0, _react.forwardRef)(({
  foreground,
  strokeColor,
  strokeWidth
}, ref) => {
  const pathSharedVal = (0, _reactNativeReanimated.useSharedValue)(_reactNativeSkia.Skia.Path.Make());
  const viewRef = (0, _reactNativeReanimated.useAnimatedRef)();
  const animatedTimeout = (0, _reactNativeReanimated.useSharedValue)(0);
  const derivedPathSharedVal = (0, _reactNativeReanimated.useDerivedValue)(() => pathSharedVal.value.toSVGString(), []);
  const context = (0, _react.useContext)(_canvasContext.default);
  const changeDrawing = (0, _react.useCallback)(clear => {
    context?.setDrawingPath(clear ? null : {
      strokeWidth: (0, _utils.getSharedValue)(strokeWidth),
      strokeColor: (0, _utils.getSharedValue)(strokeColor),
      path: derivedPathSharedVal
    });
  }, [strokeWidth, strokeColor]);
  const setDrawn = (0, _react.useCallback)(path => {
    context?.addDrawnPath(path);
  }, []);
  const panGesture = (0, _react.useMemo)(() => _reactNativeGestureHandler.Gesture.Pan().onBegin(e => {
    'worklet';

    const coords = (0, _reactNativeReanimated.getRelativeCoords)(viewRef, e.absoluteX, e.absoluteY);
    (0, _utils.clearAnimatedTimeout)(animatedTimeout.value);
    pathSharedVal.modify(v => {
      v.reset();
      v.moveTo(coords?.x || 0, coords?.y || 0);
      return v;
    });
    (0, _reactNativeReanimated.runOnJS)(changeDrawing)(false);
    console.log(e.absoluteX);
  }).onUpdate(e => {
    'worklet';

    const coords = (0, _reactNativeReanimated.getRelativeCoords)(viewRef, e.absoluteX, e.absoluteY);
    pathSharedVal.modify(v => {
      v.lineTo(coords?.x || 0, coords?.y || 0);
      return v;
    });
  }).onFinalize(e => {
    'worklet';

    (0, _reactNativeReanimated.runOnJS)(changeDrawing)(true);
    (0, _reactNativeReanimated.runOnJS)(setDrawn)({
      strokeWidth: (0, _utils.getSharedValue)(strokeWidth),
      strokeColor: (0, _utils.getSharedValue)(strokeColor),
      path: (0, _utils.getSharedValue)(derivedPathSharedVal)
    });
    animatedTimeout.value = (0, _utils.setAnimatedTimeout)(() => {
      pathSharedVal.modify(v => {
        v.reset();
        return v;
      });
    }, 1000);
    console.log(e.absoluteX);
  }), []);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeGestureHandler.GestureDetector, {
    gesture: panGesture,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
      ref: viewRef,
      style: _styles.default.canvas,
      children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNativeSkia.Canvas, {
        ref: ref,
        style: {
          flex: 1
        },
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeSkia.Path, {
          path: derivedPathSharedVal,
          style: "stroke",
          color: strokeColor,
          strokeWidth: strokeWidth,
          strokeJoin: "round",
          strokeCap: "round"
        }), foreground ? foreground : null]
      })
    })
  });
});
var _default = exports.default = /*#__PURE__*/(0, _react.memo)(DrawingCanvas);
//# sourceMappingURL=drawing-canvas.js.map