"use strict";

import { Canvas, Path } from '@shopify/react-native-skia';
import styles from "./styles.js";
import React, { useMemo } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const DrawingCanvas = ({
  foreground,
  drawingPath
}) => {
  const panGesture = useMemo(() => Gesture.Pan().onBegin(e => {
    console.log(e.absoluteX);
  }).onUpdate(e => {
    console.log(e.absoluteX);
  }).onFinalize(e => {
    console.log(e.absoluteX);
  }), []);
  return /*#__PURE__*/_jsx(GestureDetector, {
    gesture: panGesture,
    children: /*#__PURE__*/_jsxs(Canvas, {
      style: styles.canvas,
      children: [drawingPath ? /*#__PURE__*/_jsx(Path, {
        path: drawingPath.path,
        color: drawingPath.strokeColor,
        stroke: {
          width: drawingPath.strokeWidth
        }
      }) : null, foreground ? foreground : null]
    })
  });
};
export default DrawingCanvas;
//# sourceMappingURL=drawing-canvas.js.map