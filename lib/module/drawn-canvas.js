"use strict";

import { Canvas, Rect } from '@shopify/react-native-skia';
import styles from "./styles.js";
import { useSharedValue } from 'react-native-reanimated';
import React from 'react';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const DrawnCanvas = ({
  background,
  backgroundColor
}) => {
  const sizeSharedValue = useSharedValue({
    width: 0,
    height: 0
  });
  return /*#__PURE__*/_jsxs(Canvas, {
    style: styles.canvas,
    onSize: sizeSharedValue,
    children: [backgroundColor ? /*#__PURE__*/_jsx(Rect, {
      x: 0,
      y: 0,
      width: sizeSharedValue.value.width,
      height: sizeSharedValue.value.height,
      color: backgroundColor
    }) : null, background]
  });
};
export default DrawnCanvas;
//# sourceMappingURL=drawn-canvas.js.map