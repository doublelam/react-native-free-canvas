import React, { createContext, useCallback, useMemo, useState } from 'react';
import { Canvas, Path, Rect, SkPath, SkSize } from '@shopify/react-native-skia';
import { StyleProp, View, ViewStyle } from 'react-native';
import Animated, { SharedValue, useSharedValue } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import styles from './styles';
import DrawnCanvas from './drawn-canvas';
import { DrawingPath, DrawnPath, FreeCanvasProps } from './types';
import DrawingCanvas from './drawing-canvas';
import CanvasContext from './canvas-context';

const FreeCanvas: React.FC<FreeCanvasProps> = ({ style, foreground, background, backgroundColor, strokeColor = 'black', strokeWidth = 10 }) => {
  const sizeSharedVal = useSharedValue<SkSize>({ width: 0, height: 0 });
  const [drawnPaths, setDrawnPaths] = useState<DrawnPath[]>([]);
  const [drawingPath, setDrawingPath] = useState<DrawingPath | null>(null);

  const providerVal = useMemo(() => ({
    addDrawnPath: (path: DrawnPath) => { setDrawnPaths((paths => paths.concat([path]))); },
    setDrawingPath: (path: DrawingPath | null) => { setDrawingPath(path); },
    drawnPaths,
  }), [drawnPaths]);

  return (
    <CanvasContext.Provider value={providerVal}>
      <View style={[style]}>
        <Animated.View style={styles.flex1}>
          <GestureHandlerRootView style={styles.flex1}>
            {/* Drawn canvas */}
            <DrawnCanvas background={background} backgroundColor={backgroundColor} />

            {/* Drawing canvas */}
            <DrawingCanvas strokeColor={strokeColor} strokeWidth={strokeWidth} />
          </GestureHandlerRootView>
        </Animated.View>
      </View>
    </CanvasContext.Provider>
  );
};

export default React.memo(FreeCanvas);
