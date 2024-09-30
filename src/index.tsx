import React, {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { ImageFormat, useCanvasRef } from '@shopify/react-native-skia';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import styles from './styles';
import DrawnCanvas from './drawn-canvas';
import type {
  DrawingPath,
  DrawnPath,
  FreeCanvasProps,
  FreeCanvasRef,
} from './types';
import DrawingCanvas from './drawing-canvas';
import CanvasContext from './canvas-context';
import { fillBase64 } from './utils';

const FreeCanvas = forwardRef<FreeCanvasRef, FreeCanvasProps>(
  (
    {
      style,
      background,
      backgroundColor,
      strokeColor = 'black',
      strokeWidth = 10,
    },
    ref,
  ) => {
    const [drawnPaths, setDrawnPaths] = useState<DrawnPath[]>([]);
    const [, setDrawingPath] = useState<DrawingPath | null>(null);
    const drawRef = useCanvasRef();
    const drawnRef = useCanvasRef();
    const providerVal = useMemo(
      () => ({
        addDrawnPath: (path: DrawnPath) => {
          setDrawnPaths(paths => paths.concat([path]));
        },
        setDrawingPath: (path: DrawingPath | null) => {
          setDrawingPath(path);
        },
        drawnPaths,
      }),
      [drawnPaths],
    );

    const undo = useCallback(
      (step: number = 1) => {
        if (step > drawnPaths.length) {
          return false;
        }
        setDrawnPaths(paths => paths.slice(0, -1 * step));
        return step;
      },
      [drawnPaths],
    );

    const reset = useCallback(() => {
      setDrawnPaths([]);
    }, []);

    const getSnapshot = useCallback(() => {
      return drawnRef.current?.makeImageSnapshotAsync();
    }, []);

    const drawPaths = useCallback((paths: DrawnPath[]) => {
      setDrawnPaths(paths)
    }, []);

    const getPaths = useCallback(() => {
      return drawnPaths;
    }, [drawnPaths]);

    const toBase64 = useCallback(
      async (fmt: ImageFormat = ImageFormat.PNG, quality: number = 80) => {
        const snapshot = await getSnapshot();
        if (!snapshot) {
          return;
        }
        return fillBase64(fmt, snapshot.encodeToBase64(fmt, quality));
      },
      [getSnapshot],
    );

    useImperativeHandle(
      ref,
      () => ({
        undo,
        reset,
        getSnapshot,
        toBase64,
        drawPaths,
        getPaths,
      }),
      [undo, reset, getSnapshot, toBase64],
    );

    return (
      <CanvasContext.Provider value={providerVal}>
        <View style={[style]}>
          <Animated.View style={[styles.flex1]}>
            <GestureHandlerRootView style={styles.flex1}>
              {/* Drawn canvas */}
              <DrawnCanvas
                ref={drawnRef}
                background={background}
                backgroundColor={backgroundColor}
              />

              {/* Drawing canvas */}
              <DrawingCanvas
                ref={drawRef}
                strokeColor={strokeColor}
                strokeWidth={strokeWidth}
              />
            </GestureHandlerRootView>
          </Animated.View>
        </View>
      </CanvasContext.Provider>
    );
  },
);

export default memo(FreeCanvas);

export { FreeCanvas };

export type { FreeCanvasProps, DrawnPath, FreeCanvasRef };
