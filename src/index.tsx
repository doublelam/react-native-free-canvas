import React, { useState } from 'react';
import { Canvas, Path, Rect, SkPath, SkSize } from '@shopify/react-native-skia';
import { StyleProp, View, ViewStyle } from 'react-native';
import Animated, { SharedValue, useSharedValue } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import styles from './styles';
import DrawnCanvas from './drawn-canvas';
import { DrawingPath, DrownPath, FreeCanvasProps } from './types';
import DrawingCanvas from './drawing-canvas';

const FreeCanvas: React.FC<FreeCanvasProps> = ({ style, foreground }) => {
  const sizeSharedVal = useSharedValue<SkSize>({ width: 0, height: 0 });
  const [drawnPaths, setDrawnPaths] = useState<DrownPath[]>([]);
  const [drawingPath, setDrawingPath] = useState<DrawingPath | null>(null);

  return (
    <View style={style}>
      <Animated.View style={styles.flex1}>
        <GestureHandlerRootView style={styles.flex1}>
          {/* Drawn canvas */}
          <DrawnCanvas />

          {/* Drawing canvas */}
          <DrawingCanvas />
        </GestureHandlerRootView>
      </Animated.View>
    </View>
  );
};

export default React.memo(FreeCanvas);
