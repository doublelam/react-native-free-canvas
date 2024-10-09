"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.FreeCanvas = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNativeSkia = require("@shopify/react-native-skia");
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _reactNativeGestureHandler = require("react-native-gesture-handler");
var _styles = _interopRequireDefault(require("./styles.js"));
var _drawnCanvas = _interopRequireDefault(require("./drawn-canvas.js"));
var _drawingCanvas = _interopRequireDefault(require("./drawing-canvas.js"));
var _canvasContext = _interopRequireDefault(require("./canvas-context.js"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const FreeCanvas = exports.FreeCanvas = /*#__PURE__*/(0, _react.forwardRef)(({
  style,
  background,
  backgroundColor,
  strokeColor = 'black',
  strokeWidth = 10,
  zoomable,
  onDrawEnd
}, ref) => {
  const [drawnPaths, setDrawnPaths] = (0, _react.useState)([]);
  const [, setDrawingPath] = (0, _react.useState)(null);
  const drawRef = (0, _reactNativeSkia.useCanvasRef)();
  const drawnRef = (0, _reactNativeSkia.useCanvasRef)();
  const originSharedVal = (0, _reactNativeReanimated.useSharedValue)([0, 0]);
  const scaleSharedVal = (0, _reactNativeReanimated.useSharedValue)(1);
  const translateSharedVal = (0, _reactNativeReanimated.useSharedValue)({
    x: 0,
    y: 0
  });
  const scaledStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => ({
    transform: [{
      scale: scaleSharedVal.value
    }, {
      translateX: translateSharedVal.value.x
    }, {
      translateY: translateSharedVal.value.y
    }],
    transformOrigin: originSharedVal.value.concat([0])
  }));
  const providerVal = (0, _react.useMemo)(() => ({
    addDrawnPath: path => {
      setDrawnPaths(paths => paths.concat([path]));
    },
    setDrawingPath: path => {
      setDrawingPath(path);
    },
    drawnPaths,
    setScale: (x, y, scale) => {
      'worklet';

      const resScale = scale * scaleSharedVal.value;
      if (resScale < 0.5 || resScale > 2) {
        return;
      }
      scaleSharedVal.value = resScale;
      originSharedVal.value = (0, _reactNativeReanimated.withTiming)([x < 0 ? -x : x, y < 0 ? -y : y], {
        duration: 200
      });
    },
    setTranslate: (x, y) => {
      'worklet';

      console.log('setTranslate', x, y, translateSharedVal.value);
      translateSharedVal.value = {
        x: translateSharedVal.value.x + x,
        y: translateSharedVal.value.y + y
      };
    }
  }), [drawnPaths]);
  const undo = (0, _react.useCallback)((step = 1) => {
    if (step > drawnPaths.length) {
      return false;
    }
    setDrawnPaths(paths => paths.slice(0, -1 * step));
    return step;
  }, [drawnPaths]);
  const reset = (0, _react.useCallback)(() => {
    setDrawnPaths([]);
  }, []);
  const getSnapshot = (0, _react.useCallback)(() => {
    return drawnRef.current?.makeImageSnapshotAsync();
  }, []);
  const drawPaths = (0, _react.useCallback)(paths => {
    setDrawnPaths(paths);
  }, []);
  const getPaths = (0, _react.useCallback)(() => {
    return drawnPaths;
  }, [drawnPaths]);
  const toBase64 = (0, _react.useCallback)(async (fmt = _reactNativeSkia.ImageFormat.PNG, quality = 80) => {
    const snapshot = await getSnapshot();
    if (!snapshot) {
      return;
    }
    return snapshot.encodeToBase64(fmt, quality);
  }, [getSnapshot]);
  (0, _react.useImperativeHandle)(ref, () => ({
    undo,
    reset,
    getSnapshot,
    toBase64,
    drawPaths,
    getPaths
  }), [undo, reset, getSnapshot, toBase64]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_canvasContext.default.Provider, {
    value: providerVal,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
      style: [style],
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeReanimated.default.View, {
        style: [_styles.default.flex1, scaledStyle],
        children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNativeGestureHandler.GestureHandlerRootView, {
          style: _styles.default.flex1,
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_drawnCanvas.default, {
            ref: drawnRef,
            background: background,
            backgroundColor: backgroundColor
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_drawingCanvas.default, {
            ref: drawRef,
            onDrawEnd: onDrawEnd,
            zoomable: zoomable,
            strokeColor: strokeColor,
            strokeWidth: strokeWidth
          })]
        })
      })
    })
  });
});
var _default = exports.default = /*#__PURE__*/(0, _react.memo)(FreeCanvas);
//# sourceMappingURL=index.js.map