import React, { createContext, forwardRef, memo, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Canvas, ImageFormat, Path, Rect, SkCanvas, SkPath, SkSize, useCanvasRef } from '@shopify/react-native-skia';
import { StyleProp, View, ViewStyle } from 'react-native';
import Animated, { SharedValue, useSharedValue } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import styles from './styles';
import DrawnCanvas from './drawn-canvas';
import { DrawingPath, DrawnPath, FreeCanvasProps, FreeCanvasRef } from './types';
import DrawingCanvas from './drawing-canvas';
import CanvasContext from './canvas-context';

const FreeCanvas = forwardRef<FreeCanvasRef, FreeCanvasProps>(({ style, foreground, background, backgroundColor, strokeColor = 'black', strokeWidth = 10 }, ref) => {
  const sizeSharedVal = useSharedValue<SkSize>({ width: 0, height: 0 });
  const [drawnPaths, setDrawnPaths] = useState<DrawnPath[]>([]);
  const [drawingPath, setDrawingPath] = useState<DrawingPath | null>(null);
  const drawRef = useCanvasRef();
  const drawnRef = useCanvasRef();
  const providerVal = useMemo(() => ({
    addDrawnPath: (path: DrawnPath) => { setDrawnPaths((paths => paths.concat([path]))); },
    setDrawingPath: (path: DrawingPath | null) => { setDrawingPath(path); },
    drawnPaths,
  }), [drawnPaths]);

  const undo = useCallback((step: number = 1) => {
    if (step > drawnPaths.length) {
      return false;
    }
    setDrawnPaths((paths) => paths.slice(0, -1 * step));
    return step;
  }, [drawnPaths]);

  const reset = useCallback(() => {
    setDrawnPaths([]);
  }, []);

  const getSnapshot = useCallback(() => {
    return drawnRef.current?.makeImageSnapshotAsync();
  }, []);

  useImperativeHandle(ref, () => ({
    undo,
    reset,
    getSnapshot,
    toBase64: async (fmt?: ImageFormat, quality?: number) => (await getSnapshot())?.encodeToBase64(fmt, quality),
  }));

  return (
    <CanvasContext.Provider value={providerVal}>
      <View style={[style]}>
        <Animated.View style={[styles.flex1]}>
          <GestureHandlerRootView style={styles.flex1}>
            {/* Drawn canvas */}
            <DrawnCanvas ref={drawnRef} background={background} backgroundColor={backgroundColor} />

            {/* Drawing canvas */}
            <DrawingCanvas ref={drawRef} strokeColor={strokeColor} strokeWidth={strokeWidth} />
          </GestureHandlerRootView>
        </Animated.View>
      </View>
    </CanvasContext.Provider>
  );
});

export default memo(FreeCanvas);
