"use strict";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Canvas, Path, Skia } from '@shopify/react-native-skia';
import styles from "./styles.js";
import { getRelativeCoords, runOnJS, useAnimatedRef, useDerivedValue, useSharedValue } from 'react-native-reanimated';
import React, { forwardRef, memo, useCallback, useContext, useMemo } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { View } from 'react-native';
import CanvasContext from "./canvas-context.js";
import { clearAnimatedTimeout, getSharedValue, setAnimatedTimeout } from "./utils.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const DrawingCanvas = /*#__PURE__*/forwardRef(({
  foreground,
  strokeColor,
  strokeWidth
}, ref) => {
  const pathSharedVal = useSharedValue(Skia.Path.Make());
  const viewRef = useAnimatedRef();
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
  const panGesture = useMemo(() => Gesture.Pan().onBegin(e => {
    'worklet';

    const coords = getRelativeCoords(viewRef, e.absoluteX, e.absoluteY);
    clearAnimatedTimeout(animatedTimeout.value);
    pathSharedVal.modify(v => {
      v.reset();
      v.moveTo(coords?.x || 0, coords?.y || 0);
      return v;
    });
    runOnJS(changeDrawing)(false);
    console.log(e.absoluteX);
  }).onUpdate(e => {
    'worklet';

    const coords = getRelativeCoords(viewRef, e.absoluteX, e.absoluteY);
    pathSharedVal.modify(v => {
      v.lineTo(coords?.x || 0, coords?.y || 0);
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
      pathSharedVal.modify(v => {
        v.reset();
        return v;
      });
    }, 300);
  }), []);
  return /*#__PURE__*/_jsx(GestureDetector, {
    gesture: panGesture,
    children: /*#__PURE__*/_jsx(View, {
      ref: viewRef,
      style: styles.canvas,
      children: /*#__PURE__*/_jsxs(Canvas, {
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