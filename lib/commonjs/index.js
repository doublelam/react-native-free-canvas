"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNativeSkia = require("@shopify/react-native-skia");
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _reactNativeGestureHandler = require("react-native-gesture-handler");
var _styles = _interopRequireDefault(require("./styles.js"));
var _drawnCanvas = _interopRequireDefault(require("./drawn-canvas.js"));
var _drawingCanvas = _interopRequireDefault(require("./drawing-canvas.js"));
var _canvasContext = _interopRequireDefault(require("./canvas-context.js"));
var _promisesDelivery = _interopRequireDefault(require("promises-delivery"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const delivery = new _promisesDelivery.default();
const defaultZoomMin = 0.5;
const defaultZoomMax = 2;
const FreeCanvas = /*#__PURE__*/(0, _react.forwardRef)(({
  style,
  background,
  foreground,
  pathEffect,
  backgroundColor,
  strokeColor = 'black',
  strokeWidth = 10,
  zoomable,
  zoomRange = [defaultZoomMin, defaultZoomMax],
  onDrawEnd,
  onTranslate,
  onScale,
  onTransformOriginChange
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
  // save translate & scale value for touchend
  const translateEndSharedVal = (0, _reactNativeReanimated.useSharedValue)({
    x: 0,
    y: 0
  });
  const scaleEndSharedVal = (0, _reactNativeReanimated.useSharedValue)(1);
  (0, _reactNativeReanimated.useAnimatedReaction)(() => translateSharedVal.value, current => {
    onTranslate?.(current.x, current.y);
  });
  (0, _reactNativeReanimated.useAnimatedReaction)(() => scaleSharedVal.value, (current, prev) => {
    if (current !== prev) {
      onScale?.(current);
    }
  });
  (0, _reactNativeReanimated.useAnimatedReaction)(() => originSharedVal.value, current => {
    onTransformOriginChange?.(current[0], current[1]);
  });
  const scaledStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => ({
    transform: [{
      translateX: translateSharedVal.value.x
    }, {
      translateY: translateSharedVal.value.y
    }, {
      scale: scaleSharedVal.value
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

      const resScale = scale * scaleEndSharedVal.value;
      if (resScale < (zoomRange.at(0) ?? defaultZoomMin) || resScale > (zoomRange.at(1) ?? defaultZoomMax)) {
        return;
      }
      scaleSharedVal.value = resScale;
      originSharedVal.value = (0, _reactNativeReanimated.withTiming)([x < 0 ? -x : x, y < 0 ? -y : y], {
        duration: 200
      });
    },
    finalize: () => {
      'worklet';

      translateEndSharedVal.modify(val => {
        val.x = translateSharedVal.value.x;
        val.y = translateSharedVal.value.y;
        return val;
      });
      scaleEndSharedVal.value = scaleSharedVal.value;
    },
    setTranslate: (x, y) => {
      'worklet';

      translateSharedVal.modify(val => {
        val.x = x + translateEndSharedVal.value.x;
        val.y = y + translateEndSharedVal.value.y;
        return val;
      });
    },
    pathCompleteDelivery: delivery
  }), [drawnPaths, delivery, zoomRange]);
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
  const toPaths = (0, _react.useCallback)(() => {
    return drawnPaths;
  }, [drawnPaths]);
  const toBase64 = (0, _react.useCallback)(async (fmt = _reactNativeSkia.ImageFormat.PNG, quality = 80) => {
    const snapshot = await getSnapshot();
    if (!snapshot) {
      return;
    }
    return snapshot.encodeToBase64(fmt, quality);
  }, [getSnapshot]);
  const resetZoom = (0, _react.useCallback)((duration = 200) => {
    translateEndSharedVal.value = {
      x: 0,
      y: 0
    };
    scaleEndSharedVal.value = 1;
    translateSharedVal.value = (0, _reactNativeReanimated.withTiming)({
      x: 0,
      y: 0
    }, {
      duration
    });
    scaleSharedVal.value = (0, _reactNativeReanimated.withTiming)(1, {
      duration
    });
  }, []);
  (0, _react.useImperativeHandle)(ref, () => ({
    undo,
    reset,
    resetZoom,
    getSnapshot,
    toBase64,
    drawPaths,
    toPaths,
    translateSharedValue: translateSharedVal,
    scaleSharedValue: scaleSharedVal,
    transformOriginSharedValue: originSharedVal
  }), [undo, reset, resetZoom, getSnapshot, toBase64, toPaths, scaleSharedVal, translateSharedVal, originSharedVal]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_canvasContext.default.Provider, {
    value: providerVal,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
      style: style,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeGestureHandler.GestureHandlerRootView, {
        style: _styles.default.flex1,
        children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNativeReanimated.default.View, {
          style: [_styles.default.flex1, scaledStyle],
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_drawnCanvas.default, {
            ref: drawnRef,
            background: background,
            foreground: foreground,
            backgroundColor: backgroundColor,
            pathEffect: pathEffect
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_drawingCanvas.default, {
            ref: drawRef,
            foreground: foreground,
            onDrawEnd: onDrawEnd,
            zoomable: zoomable,
            strokeColor: strokeColor,
            strokeWidth: strokeWidth,
            pathEffect: pathEffect
          })]
        })
      })
    })
  });
});
var _default = exports.default = /*#__PURE__*/(0, _react.memo)(FreeCanvas);
//# sourceMappingURL=index.js.map