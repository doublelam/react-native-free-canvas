"use strict";

import React, { forwardRef, memo, useCallback, useImperativeHandle, useMemo, useState } from 'react';
import { ImageFormat, useCanvasRef } from '@shopify/react-native-skia';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import styles from "./styles.js";
import DrawnCanvas from "./drawn-canvas.js";
import DrawingCanvas from "./drawing-canvas.js";
import CanvasContext from "./canvas-context.js";
import { fillBase64 } from "./utils.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const FreeCanvas = /*#__PURE__*/forwardRef(({
  style,
  background,
  backgroundColor,
  strokeColor = 'black',
  strokeWidth = 10
}, ref) => {
  const [drawnPaths, setDrawnPaths] = useState([]);
  const [, setDrawingPath] = useState(null);
  const drawRef = useCanvasRef();
  const drawnRef = useCanvasRef();
  const providerVal = useMemo(() => ({
    addDrawnPath: path => {
      setDrawnPaths(paths => paths.concat([path]));
    },
    setDrawingPath: path => {
      setDrawingPath(path);
    },
    drawnPaths
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
  const toBase64 = useCallback(async (fmt = ImageFormat.PNG, quality = 80) => {
    const snapshot = await getSnapshot();
    if (!snapshot) {
      return;
    }
    return fillBase64(fmt, snapshot.encodeToBase64(fmt, quality));
  }, [getSnapshot]);
  useImperativeHandle(ref, () => ({
    undo,
    reset,
    getSnapshot,
    toBase64
  }), [undo, reset, getSnapshot, toBase64]);
  return /*#__PURE__*/_jsx(CanvasContext.Provider, {
    value: providerVal,
    children: /*#__PURE__*/_jsx(View, {
      style: [style],
      children: /*#__PURE__*/_jsx(Animated.View, {
        style: [styles.flex1],
        children: /*#__PURE__*/_jsxs(GestureHandlerRootView, {
          style: styles.flex1,
          children: [/*#__PURE__*/_jsx(DrawnCanvas, {
            ref: drawnRef,
            background: background,
            backgroundColor: backgroundColor
          }), /*#__PURE__*/_jsx(DrawingCanvas, {
            ref: drawRef,
            strokeColor: strokeColor,
            strokeWidth: strokeWidth
          })]
        })
      })
    })
  });
});
export default /*#__PURE__*/memo(FreeCanvas);
export { FreeCanvas };
//# sourceMappingURL=index.js.map