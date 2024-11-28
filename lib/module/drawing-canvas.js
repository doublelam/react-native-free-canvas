"use strict";

import { Canvas, Path, Skia } from '@shopify/react-native-skia';
import styles from "./styles.js";
import { runOnJS, useDerivedValue, useSharedValue } from 'react-native-reanimated';
import React, { forwardRef, memo, useCallback, useContext, useMemo } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { View } from 'react-native';
import CanvasContext from "./canvas-context.js";
import { clearAnimatedTimeout, genUniqueKey, getSharedValue, setAnimatedTimeout } from "./utils.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const DrawingCanvas = /*#__PURE__*/forwardRef(({
  pathEffect,
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
  const zoomingSharedVal = useSharedValue(false);
  const derivedPathSharedVal = useDerivedValue(() => pathSharedVal.value.toSVGString(), []);
  const context = useContext(CanvasContext);
  const changeDrawing = useCallback(clear => {
    context?.setDrawingPath(clear ? null : {
      strokeWidth: getSharedValue(strokeWidth),
      strokeColor: getSharedValue(strokeColor),
      path: derivedPathSharedVal
    });
  }, [strokeWidth, strokeColor]);
  const addDrawn = useCallback(path => {
    context?.addDrawnPath(path);
  }, []);
  const pinchGesture = useMemo(() => Gesture.Pinch().enabled(zoomable).onStart(() => {
    'worklet';

    zoomingSharedVal.value = true;
    // runOnJS(setZooming)(true);
  }).onUpdate(e => {
    'worklet';

    if (e.focalX < 0 || e.focalY < 0 || e.focalX > sizeSharedVal.value.width || e.focalY > sizeSharedVal.value.height) {
      return;
    }
    zoomingSharedVal.value = true;
    context?.setScale(e.focalX, e.focalY, e.scale);
  }).onFinalize(() => {
    'worklet';

    zoomingSharedVal.value = false;
    // runOnJS(setZooming)(false)
  }), [zoomable]);
  const panGesture = useMemo(() => Gesture.Pan()
  // will allow move canvas by 2-finger panning
  // .maxPointers(1)
  .averageTouches(true).onStart(e => {
    'worklet';

    const touch = e;
    if (zoomingSharedVal.value || e.numberOfPointers > 1) {
      return;
    }
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

    if (e.numberOfPointers > 1 && zoomable) {
      context?.setTranslate(e.translationX, e.translationY);
      return;
    }
    if (pathSharedVal.value.isEmpty()) {
      return;
    }
    pathSharedVal.modify(v => {
      v.lineTo(e.x || 0, e.y || 0);
      return v;
    });
  }).onFinalize(e => {
    'worklet';

    context?.finalize();
    if (zoomingSharedVal.value || e.numberOfPointers > 1 || pathSharedVal.value.isEmpty()) {
      return;
    }
    runOnJS(changeDrawing)(true);
    runOnJS(addDrawn)({
      key: genUniqueKey(),
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
  }), [strokeWidth, strokeColor]);
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
          strokeCap: "round",
          children: pathEffect
        }), foreground]
      })
    })
  });
});
export default /*#__PURE__*/memo(DrawingCanvas);
//# sourceMappingURL=drawing-canvas.js.map