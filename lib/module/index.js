"use strict";

import React, { forwardRef, memo, useCallback, useImperativeHandle, useMemo, useState } from 'react';
import { ImageFormat, useCanvasRef } from '@shopify/react-native-skia';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import styles from "./styles.js";
import DrawnCanvas from "./drawn-canvas.js";
import DrawingCanvas from "./drawing-canvas.js";
import CanvasContext from "./canvas-context.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const FreeCanvas = /*#__PURE__*/forwardRef(({
  style,
  background,
  foreground,
  pathEffect,
  backgroundColor,
  strokeColor = 'black',
  strokeWidth = 10,
  zoomable,
  onDrawEnd
}, ref) => {
  const [drawnPaths, setDrawnPaths] = useState([]);
  const [, setDrawingPath] = useState(null);
  const drawRef = useCanvasRef();
  const drawnRef = useCanvasRef();
  const originSharedVal = useSharedValue([0, 0]);
  const scaleSharedVal = useSharedValue(1);
  const translateSharedVal = useSharedValue({
    x: 0,
    y: 0
  });
  const scaledStyle = useAnimatedStyle(() => ({
    transform: [{
      scale: scaleSharedVal.value
    }, {
      translateX: translateSharedVal.value.x
    }, {
      translateY: translateSharedVal.value.y
    }],
    transformOrigin: originSharedVal.value.concat([0])
  }));
  const providerVal = useMemo(() => ({
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
      originSharedVal.value = withTiming([x < 0 ? -x : x, y < 0 ? -y : y], {
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
  const undo = useCallback((step = 1) => {
    if (step > drawnPaths.length) {
      return false;
    }
    setDrawnPaths(paths => paths.slice(0, -1 * step));
    return step;
  }, [drawnPaths]);
  const reset = useCallback(() => {
    setDrawnPaths([]);
  }, []);
  const getSnapshot = useCallback(() => {
    return drawnRef.current?.makeImageSnapshotAsync();
  }, []);
  const drawPaths = useCallback(paths => {
    setDrawnPaths(paths);
  }, []);
  const toPaths = useCallback(() => {
    return drawnPaths;
  }, [drawnPaths]);
  const toBase64 = useCallback(async (fmt = ImageFormat.PNG, quality = 80) => {
    const snapshot = await getSnapshot();
    if (!snapshot) {
      return;
    }
    return snapshot.encodeToBase64(fmt, quality);
  }, [getSnapshot]);
  useImperativeHandle(ref, () => ({
    undo,
    reset,
    getSnapshot,
    toBase64,
    drawPaths,
    toPaths
  }), [undo, reset, getSnapshot, toBase64, toPaths]);
  return /*#__PURE__*/_jsx(CanvasContext.Provider, {
    value: providerVal,
    children: /*#__PURE__*/_jsx(View, {
      style: [style],
      children: /*#__PURE__*/_jsx(Animated.View, {
        style: [styles.flex1, scaledStyle],
        children: /*#__PURE__*/_jsxs(GestureHandlerRootView, {
          style: styles.flex1,
          children: [/*#__PURE__*/_jsx(DrawnCanvas, {
            ref: drawnRef,
            background: background,
            foreground: foreground,
            backgroundColor: backgroundColor,
            pathEffect: pathEffect
          }), /*#__PURE__*/_jsx(DrawingCanvas, {
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
export default /*#__PURE__*/memo(FreeCanvas);
//# sourceMappingURL=index.js.map