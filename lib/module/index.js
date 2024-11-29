"use strict";

import React, { forwardRef, memo, useCallback, useImperativeHandle, useMemo, useState } from 'react';
import { ImageFormat, useCanvasRef } from '@shopify/react-native-skia';
import { View } from 'react-native';
import Animated, { useAnimatedReaction, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
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
  onDrawEnd,
  onTranslate,
  onScale
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
  // save translate & scale value for touchend
  const translateEndSharedVal = useSharedValue({
    x: 0,
    y: 0
  });
  const scaleEndSharedVal = useSharedValue(1);
  useAnimatedReaction(() => translateSharedVal.value, (current, prev) => {
    if (current !== prev) {
      onTranslate?.(current.x, current.y);
    }
  });
  useAnimatedReaction(() => scaleSharedVal.value, (current, prev) => {
    if (current !== prev) {
      onScale?.(current);
    }
  });
  const scaledStyle = useAnimatedStyle(() => ({
    transform: [{
      translateX: translateSharedVal.value.x
    }, {
      translateY: translateSharedVal.value.y
    }, {
      scale: scaleSharedVal.value
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

      const resScale = scale * scaleEndSharedVal.value;
      if (resScale < 0.5 || resScale > 2) {
        return;
      }
      scaleSharedVal.value = resScale;
      originSharedVal.value = withTiming([x < 0 ? -x : x, y < 0 ? -y : y], {
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
  const resetZoom = useCallback((duration = 200) => {
    translateEndSharedVal.value = {
      x: 0,
      y: 0
    };
    scaleEndSharedVal.value = 1;
    translateSharedVal.value = withTiming({
      x: 0,
      y: 0
    }, {
      duration
    });
    scaleSharedVal.value = withTiming(1, {
      duration
    });
  }, []);
  useImperativeHandle(ref, () => ({
    undo,
    reset,
    resetZoom,
    getSnapshot,
    toBase64,
    drawPaths,
    toPaths,
    translateSharedValue: translateSharedVal,
    scaleSharedValue: scaleSharedVal
  }), [undo, reset, resetZoom, getSnapshot, toBase64, toPaths, scaleSharedVal, translateSharedVal]);
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