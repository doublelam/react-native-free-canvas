"use strict";

import React, { useState } from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import styles from "./styles.js";
import DrawnCanvas from "./drawn-canvas.js";
import DrawingCanvas from "./drawing-canvas.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const FreeCanvas = ({
  style,
  foreground
}) => {
  const sizeSharedVal = useSharedValue({
    width: 0,
    height: 0
  });
  const [drawnPaths, setDrawnPaths] = useState([]);
  const [drawingPath, setDrawingPath] = useState(null);
  return /*#__PURE__*/_jsx(View, {
    style: style,
    children: /*#__PURE__*/_jsx(Animated.View, {
      style: styles.flex1,
      children: /*#__PURE__*/_jsxs(GestureHandlerRootView, {
        style: styles.flex1,
        children: [/*#__PURE__*/_jsx(DrawnCanvas, {}), /*#__PURE__*/_jsx(DrawingCanvas, {})]
      })
    })
  });
};
export default /*#__PURE__*/React.memo(FreeCanvas);
//# sourceMappingURL=index.js.map