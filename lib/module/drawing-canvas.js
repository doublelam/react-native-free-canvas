"use strict";

import { Canvas, Path, Skia } from '@shopify/react-native-skia';
import styles from "./styles.js";
import { runOnJS, useDerivedValue, useSharedValue } from 'react-native-reanimated';
import React, { forwardRef, memo, useCallback, useContext, useMemo } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { View } from 'react-native';
import CanvasContext from "./canvas-context.js";
import { clearAnimatedTimeout, getSharedValue, setAnimatedTimeout } from "./utils.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const DrawingCanvas = /*#__PURE__*/forwardRef(({
  foreground,
  strokeColor,
  strokeWidth,
  zoomable = false,
  onDrawEnd
}, ref) => {
  const pathSharedVal = useSharedValue(Skia.Path.Make());
  const sizeSharedVal = useSharedValue({
    width: 0,
    height: 0
  });
  const animatedTimeout = useSharedValue(0);
  const derivedPathSharedVal = useDerivedValue(() => pathSharedVal.value.toSVGString(), []);
  const context = useContext(CanvasContext);
  const changeDrawing = useCallback(clear => {
    context?.setDrawingPath(clear ? null : {
      strokeWidth: getSharedValue(strokeWidth),
      strokeColor: getSharedValue(strokeColor),
      path: derivedPathSharedVal
    });
  }, [strokeWidth, strokeColor]);
  const setDrawn = useCallback(path => {
    context?.addDrawnPath(path);
  }, []);
  const pinchGesture = useMemo(() => Gesture.Pinch().enabled(zoomable).onStart(() => {
    // runOnJS(setZooming)(true);
  }).onUpdate(e => {
    if (e.focalX < 0 || e.focalY < 0 || e.focalX > sizeSharedVal.value.width || e.focalY > sizeSharedVal.value.height) {
      return;
    }
    context?.setScale(e.focalX, e.focalY, e.scale);
  }).onFinalize(() => {
    // runOnJS(setZooming)(false)
  }), [zoomable]);
  const panGesture = useMemo(() => Gesture.Pan().maxPointers(1).onStart(e => {
    'worklet';

    if (e.numberOfPointers > 1) {
      return;
    }
    const touch = e;
    clearAnimatedTimeout(animatedTimeout.value);
    pathSharedVal.modify(v => {
      v.reset();
      v.moveTo(touch.x || 0, touch.y || 0);
      v.lineTo(touch.x || 0, touch.y || 0);
      return v;
    });
    runOnJS(changeDrawing)(false);
  }).onUpdate(e => {
    'worklet';

    pathSharedVal.modify(v => {
      v.lineTo(e.x || 0, e.y || 0);
      return v;
    });
  }).onFinalize(() => {
    'worklet';

    runOnJS(changeDrawing)(true);
    runOnJS(setDrawn)({
      strokeWidth: getSharedValue(strokeWidth),
      strokeColor: getSharedValue(strokeColor),
      path: getSharedValue(derivedPathSharedVal)
    });
    animatedTimeout.value = setAnimatedTimeout(() => {
      'worklet';

      pathSharedVal.modify(v => {
        v.reset();
        return v;
      });
      if (onDrawEnd) {
        runOnJS(onDrawEnd)();
      }
    }, 300);
  }), []);
  const composedGesture = Gesture.Simultaneous(panGesture, pinchGesture);
  return /*#__PURE__*/_jsx(GestureDetector, {
    gesture: composedGesture,
    children: /*#__PURE__*/_jsx(View, {
      style: styles.canvas,
      children: /*#__PURE__*/_jsxs(Canvas, {
        onSize: sizeSharedVal,
        ref: ref,
        style: {
          flex: 1
        },
        children: [/*#__PURE__*/_jsx(Path, {
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
export default /*#__PURE__*/memo(DrawingCanvas);
//# sourceMappingURL=drawing-canvas.js.map