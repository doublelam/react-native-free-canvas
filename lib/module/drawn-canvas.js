"use strict";

import { Canvas, Path, Rect } from '@shopify/react-native-skia';
import styles from "./styles.js";
import { useDerivedValue, useSharedValue } from 'react-native-reanimated';
import React, { forwardRef, useContext, useEffect } from 'react';
import CanvasContext from "./canvas-context.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const DrawnCanvas = /*#__PURE__*/forwardRef(({
  background,
  pathEffect,
  foreground,
  backgroundColor
}, ref) => {
  const sizeSharedValue = useSharedValue({
    width: 0,
    height: 0
  });
  const derivedWidth = useDerivedValue(() => sizeSharedValue.value.width, []);
  const derivedHeight = useDerivedValue(() => sizeSharedValue.value.height, []);
  const context = useContext(CanvasContext);
  useEffect(() => {
    const last = context?.drawnPaths.at(-1);
    if (last && context?.pathCompleteDelivery) {
      try {
        context.pathCompleteDelivery.resolve(last.key, true);
      } catch {
        // Nothing to do here;
      }
    }
  }, [context?.drawnPaths]);
  return /*#__PURE__*/_jsxs(Canvas, {
    ref: ref,
    style: styles.canvas,
    onSize: sizeSharedValue,
    children: [backgroundColor ? /*#__PURE__*/_jsx(Rect, {
      x: 0,
      y: 0,
      width: derivedWidth,
      height: derivedHeight,
      color: backgroundColor
    }) : null, background, context?.drawnPaths.map((path, index) => /*#__PURE__*/_jsx(Path, {
      style: "stroke",
      path: path.path,
      strokeWidth: path.strokeWidth,
      strokeJoin: "round",
      strokeCap: "round",
      color: path.strokeColor,
      children: pathEffect
    }, index)), foreground]
  });
});
export default DrawnCanvas;
//# sourceMappingURL=drawn-canvas.js.map