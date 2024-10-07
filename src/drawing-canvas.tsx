import { Canvas, Path, Skia, SkiaDomView } from '@shopify/react-native-skia';
import styles from './styles';
import {
  runOnJS,
  SharedValue,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import React, {
  forwardRef,
  memo,
  RefObject,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { DrawnPath } from './types';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { View } from 'react-native';
import CanvasContext from './canvas-context';
import {
  clearAnimatedTimeout,
  genUniqueKey,
  getSharedValue,
  setAnimatedTimeout,
} from './utils';

type DrawingCanvasProps = {
  foreground?: React.ReactNode;
  strokeColor: string | SharedValue<string>;
  strokeWidth: number | SharedValue<number>;
  zoomable?: boolean;
  onDrawEnd?: () => void;
};

const DrawingCanvas = forwardRef<SkiaDomView, DrawingCanvasProps>(
  (
    { foreground, strokeColor, strokeWidth, zoomable = false, onDrawEnd },
    ref,
  ) => {
    const pathSharedVal = useSharedValue(Skia.Path.Make());
    const sizeSharedVal = useSharedValue({ width: 0, height: 0 });
    const animatedTimeout = useSharedValue(0);
    const derivedPathSharedVal = useDerivedValue(
      () => pathSharedVal.value.toSVGString(),
      [],
    );
    const context = useContext(CanvasContext);
    const changeDrawing = useCallback(
      (clear: boolean) => {
        context?.setDrawingPath(
          clear
            ? null
            : {
                strokeWidth: getSharedValue(strokeWidth),
                strokeColor: getSharedValue(strokeColor),
                path: derivedPathSharedVal,
              },
        );
      },
      [strokeWidth, strokeColor],
    );

    const addDrawn = useCallback((path: DrawnPath) => {
      context?.addDrawnPath(path);
    }, []);

    const pinchGesture = useMemo(
      () =>
        Gesture.Pinch()
          .enabled(zoomable)
          .onStart(() => {
            // runOnJS(setZooming)(true);
          })
          .onUpdate(e => {
            if (
              e.focalX < 0 ||
              e.focalY < 0 ||
              e.focalX > sizeSharedVal.value.width ||
              e.focalY > sizeSharedVal.value.height
            ) {
              return;
            }
            context?.setScale(e.focalX, e.focalY, e.scale);
          })
          .onFinalize(() => {
            // runOnJS(setZooming)(false)
          }),
      [zoomable],
    );

    const panGesture = useMemo(
      () =>
        Gesture.Pan()
          .maxPointers(1)
          .onStart(e => {
            'worklet';

            if (e.numberOfPointers > 1) {
              return;
            }
            const touch = e;
            clearAnimatedTimeout(animatedTimeout.value);
            pathSharedVal.modify(v => {
              v.reset();
              v.moveTo(touch.x || 0, touch.y || 0);
              v.lineTo(touch.x || 0, touch.y || 0);
              return v;
            });
            runOnJS(changeDrawing)(false);
          })
          .onUpdate(e => {
            'worklet';

            pathSharedVal.modify(v => {
              v.lineTo(e.x || 0, e.y || 0);
              return v;
            });
          })
          .onFinalize(() => {
            'worklet';

            runOnJS(changeDrawing)(true);
            runOnJS(addDrawn)({
              key: genUniqueKey(),
              strokeWidth: getSharedValue(strokeWidth),
              strokeColor: getSharedValue(strokeColor),
              path: getSharedValue(derivedPathSharedVal),
            });

            animatedTimeout.value = setAnimatedTimeout(() => {
              'worklet';

              pathSharedVal.modify(v => {
                v.reset();
                return v;
              });
              if (onDrawEnd) {
                runOnJS(onDrawEnd)();
              }
            }, 300);
          }),
      [strokeWidth, strokeColor],
    );

    const composedGesture = Gesture.Simultaneous(panGesture, pinchGesture);

    return (
      <GestureDetector gesture={composedGesture}>
        <View style={styles.canvas}>
          <Canvas
            onSize={sizeSharedVal}
            ref={ref as RefObject<SkiaDomView>}
            style={{ flex: 1 }}
          >
            {/* Drawing path */}
            <Path
              path={derivedPathSharedVal}
              style="stroke"
              color={strokeColor}
              strokeWidth={strokeWidth}
              strokeJoin="round"
              strokeCap="round"
            />
            {/* For render foreground */}
            {foreground ? foreground : null}
          </Canvas>
        </View>
      </GestureDetector>
    );
  },
);

export default memo(DrawingCanvas);
