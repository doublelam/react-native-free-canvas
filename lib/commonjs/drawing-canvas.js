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
const DrawingCanvas = /*#__PURE__*/(0, _react.forwardRef)(({
  foreground,
  strokeColor,
  strokeWidth,
  zoomable = false,
  onDrawEnd
}, ref) => {
  const pathSharedVal = (0, _reactNativeReanimated.useSharedValue)(_reactNativeSkia.Skia.Path.Make());
  const sizeSharedVal = (0, _reactNativeReanimated.useSharedValue)({
    width: 0,
    height: 0
  });
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
  const pinchGesture = (0, _react.useMemo)(() => _reactNativeGestureHandler.Gesture.Pinch().enabled(zoomable).onStart(() => {
    // runOnJS(setZooming)(true);
  }).onUpdate(e => {
    if (e.focalX < 0 || e.focalY < 0 || e.focalX > sizeSharedVal.value.width || e.focalY > sizeSharedVal.value.height) {
      return;
    }
    context?.setScale(e.focalX, e.focalY, e.scale);
  }).onFinalize(() => {
    // runOnJS(setZooming)(false)
  }), [zoomable]);
  const panGesture = (0, _react.useMemo)(() => _reactNativeGestureHandler.Gesture.Pan().maxPointers(1).onStart(e => {
    'worklet';

    if (e.numberOfPointers > 1) {
      return;
    }
    const touch = e;
    (0, _utils.clearAnimatedTimeout)(animatedTimeout.value);
    pathSharedVal.modify(v => {
      v.reset();
      v.moveTo(touch.x || 0, touch.y || 0);
      v.lineTo(touch.x || 0, touch.y || 0);
      return v;
    });
    (0, _reactNativeReanimated.runOnJS)(changeDrawing)(false);
  }).onUpdate(e => {
    'worklet';

    pathSharedVal.modify(v => {
      v.lineTo(e.x || 0, e.y || 0);
      return v;
    });
  }).onFinalize(() => {
    'worklet';

    (0, _reactNativeReanimated.runOnJS)(changeDrawing)(true);
    (0, _reactNativeReanimated.runOnJS)(setDrawn)({
      strokeWidth: (0, _utils.getSharedValue)(strokeWidth),
      strokeColor: (0, _utils.getSharedValue)(strokeColor),
      path: (0, _utils.getSharedValue)(derivedPathSharedVal)
    });
    animatedTimeout.value = (0, _utils.setAnimatedTimeout)(() => {
      'worklet';

      pathSharedVal.modify(v => {
        v.reset();
        return v;
      });
      if (onDrawEnd) {
        (0, _reactNativeReanimated.runOnJS)(onDrawEnd)();
      }
    }, 300);
  }), []);
  const composedGesture = _reactNativeGestureHandler.Gesture.Simultaneous(panGesture, pinchGesture);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeGestureHandler.GestureDetector, {
    gesture: composedGesture,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
      style: _styles.default.canvas,
      children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNativeSkia.Canvas, {
        onSize: sizeSharedVal,
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