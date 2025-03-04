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
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
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
import Delivery from 'promises-delivery';

const delivery = new Delivery<true>();

const defaultZoomMin = 0.5;
const defaultZoomMax = 2;

const FreeCanvas = forwardRef<FreeCanvasRef, FreeCanvasProps>(
  (
    {
      style,
      background,
      foreground,
      pathEffect,
      backgroundColor,
      strokeColor = 'black',
      strokeWidth = 10,
      zoomable,
      zoomRange = [defaultZoomMin, defaultZoomMax],
      onDrawEnd,
      onTranslate,
      onScale,
      onTransformOriginChange,
    },
    ref,
  ) => {
    const [drawnPaths, setDrawnPaths] = useState<DrawnPath[]>([]);
    const [, setDrawingPath] = useState<DrawingPath | null>(null);
    const drawRef = useCanvasRef();
    const drawnRef = useCanvasRef();
    const originSharedVal = useSharedValue([0, 0] as [number, number]);
    const scaleSharedVal = useSharedValue(1);
    const translateSharedVal = useSharedValue({ x: 0, y: 0 });
    // save translate & scale value for touchend
    const translateEndSharedVal = useSharedValue({ x: 0, y: 0 });
    const scaleEndSharedVal = useSharedValue(1);

    useAnimatedReaction(
      () => translateSharedVal.value,
      current => {
        onTranslate?.(current.x, current.y);
      },
    );

    useAnimatedReaction(
      () => scaleSharedVal.value,
      (current, prev) => {
        if (current !== prev) {
          onScale?.(current);
        }
      },
    );

    useAnimatedReaction(
      () => originSharedVal.value,
      current => {
        onTransformOriginChange?.(current[0], current[1]);
      },
    );

    const scaledStyle = useAnimatedStyle(() => ({
      transform: [
        { translateX: translateSharedVal.value.x },
        { translateY: translateSharedVal.value.y },
        { scale: scaleSharedVal.value },
      ],
      transformOrigin: originSharedVal.value.concat([0]),
    }));
    const providerVal = useMemo(
      () => ({
        addDrawnPath: (path: DrawnPath) => {
          setDrawnPaths(paths => paths.concat([path]));
        },
        setDrawingPath: (path: DrawingPath | null) => {
          setDrawingPath(path);
        },
        drawnPaths,
        setScale: (x: number, y: number, scale: number) => {
          'worklet';

          const resScale = scale * scaleEndSharedVal.value;
          if (
            resScale < (zoomRange.at(0) ?? defaultZoomMin) ||
            resScale > (zoomRange.at(1) ?? defaultZoomMax)
          ) {
            return;
          }
          scaleSharedVal.value = resScale;
          originSharedVal.value = withTiming([x < 0 ? -x : x, y < 0 ? -y : y], {
            duration: 200,
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
        setTranslate: (x: number, y: number) => {
          'worklet';

          translateSharedVal.modify(val => {
            val.x = x + translateEndSharedVal.value.x;
            val.y = y + translateEndSharedVal.value.y;
            return val;
          });
        },
        pathCompleteDelivery: delivery,
      }),
      [drawnPaths, delivery, zoomRange],
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
      setDrawnPaths(paths);
    }, []);

    const toPaths = useCallback(() => {
      return drawnPaths;
    }, [drawnPaths]);

    const toBase64 = useCallback(
      async (fmt: ImageFormat = ImageFormat.PNG, quality: number = 80) => {
        const snapshot = await getSnapshot();
        if (!snapshot) {
          return;
        }
        return snapshot.encodeToBase64(fmt, quality);
      },
      [getSnapshot],
    );

    const resetZoom = useCallback((duration: number = 200) => {
      translateEndSharedVal.value = { x: 0, y: 0 };
      scaleEndSharedVal.value = 1;
      translateSharedVal.value = withTiming({ x: 0, y: 0 }, { duration });
      scaleSharedVal.value = withTiming(1, { duration });
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        undo,
        reset,
        resetZoom,
        getSnapshot,
        toBase64,
        drawPaths,
        toPaths,
        translateSharedValue: translateSharedVal,
        scaleSharedValue: scaleSharedVal,
        transformOriginSharedValue: originSharedVal,
      }),
      [
        undo,
        reset,
        resetZoom,
        getSnapshot,
        toBase64,
        toPaths,
        scaleSharedVal,
        translateSharedVal,
        originSharedVal,
      ],
    );

    return (
      <CanvasContext.Provider value={providerVal}>
        <View style={style}>
          <GestureHandlerRootView style={styles.flex1}>
            <Animated.View style={[styles.flex1, scaledStyle]}>
              {/* Drawn canvas */}
              <DrawnCanvas
                ref={drawnRef}
                background={background}
                foreground={foreground}
                backgroundColor={backgroundColor}
                pathEffect={pathEffect}
              />

              {/* Drawing canvas */}
              <DrawingCanvas
                ref={drawRef}
                foreground={foreground}
                onDrawEnd={onDrawEnd}
                zoomable={zoomable}
                strokeColor={strokeColor}
                strokeWidth={strokeWidth}
                pathEffect={pathEffect}
              />
            </Animated.View>
          </GestureHandlerRootView>
        </View>
      </CanvasContext.Provider>
    );
  },
);

export default memo(FreeCanvas);

export type { FreeCanvasProps, DrawnPath, FreeCanvasRef };
