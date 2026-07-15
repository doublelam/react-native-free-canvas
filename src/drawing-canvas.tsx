import { Canvas, Path, Skia, CanvasRef } from '@shopify/react-native-skia';
import styles from './styles';
import {
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
import { genUniqueKey, getSharedValue } from './utils';
import { scheduleOnRN } from 'react-native-worklets';

type DrawingCanvasProps = {
  pathEffect?: React.ReactNode;
  foreground?: React.ReactNode;
  strokeColor: string | SharedValue<string>;
  strokeWidth: number | SharedValue<number>;
  zoomable?: boolean;
  onDrawEnd?: () => void;
};

const DrawingCanvas = forwardRef<CanvasRef, DrawingCanvasProps>(
  (
    {
      pathEffect,
      foreground,
      strokeColor,
      strokeWidth,
      zoomable = false,
      onDrawEnd,
    },
    ref,
  ) => {
    const pathBuilderSharedVal = useSharedValue(Skia.PathBuilder.Make());
    const sizeSharedVal = useSharedValue({ width: 0, height: 0 });
    const zoomingSharedVal = useSharedValue(false);
    const derivedPathSharedVal = useDerivedValue(
      () => pathBuilderSharedVal.value.build().toSVGString(),
      [],
    );
    const context = useContext(CanvasContext);
    const { setScale, setTranslate, finalize } = context ?? {};
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
      context?.pathCompleteDelivery.register(path.key).then(() => {
        // Delay reset so the drawn path can finish rendering first
        // and avoid a brief flash when the live stroke is cleared.
        setTimeout(() => {
          pathBuilderSharedVal.modify(v => {
            'worklet';

            v.reset();
            return v;
          });
          onDrawEnd?.();
        }, 16);
      });
      context?.addDrawnPath(path);
    }, []);

    const pinchGesture = useMemo(
      () =>
        Gesture.Pinch()
          .enabled(zoomable)
          .onStart(() => {
            'worklet';

            zoomingSharedVal.value = true;
          })
          .onUpdate(e => {
            'worklet';

            if (
              e.focalX < 0 ||
              e.focalY < 0 ||
              e.focalX > sizeSharedVal.value.width ||
              e.focalY > sizeSharedVal.value.height
            ) {
              return;
            }
            zoomingSharedVal.value = true;
            setScale?.(e.focalX, e.focalY, e.scale);
          })
          .onFinalize(() => {
            'worklet';

            zoomingSharedVal.value = false;
          }),
      [zoomable, setScale],
    );

    const panGesture = useMemo(
      () =>
        Gesture.Pan()
          // will allow move canvas by 2-finger panning
          // .maxPointers(1)
          .averageTouches(true)
          .onStart(e => {
            'worklet';

            const touch = e;
            if (zoomingSharedVal.value || e.numberOfPointers > 1) {
              return;
            }
            pathBuilderSharedVal.modify(v => {
              v.reset();
              v.moveTo(touch.x || 0, touch.y || 0);
              v.lineTo(touch.x || 0, touch.y || 0);
              return v;
            });
            scheduleOnRN(changeDrawing, false);
          })
          .onUpdate(e => {
            'worklet';

            if (e.numberOfPointers > 1 && zoomable) {
              setTranslate?.(e.translationX, e.translationY);
              return;
            }
            if (pathBuilderSharedVal.value.isEmpty()) {
              return;
            }
            pathBuilderSharedVal.modify(v => {
              v.lineTo(e.x || 0, e.y || 0);
              return v;
            });
          })
          .onFinalize(e => {
            'worklet';

            finalize?.();
            if (
              zoomingSharedVal.value ||
              e.numberOfPointers > 1 ||
              pathBuilderSharedVal.value.isEmpty()
            ) {
              return;
            }
            scheduleOnRN(changeDrawing, true);
            scheduleOnRN(addDrawn, {
              key: genUniqueKey('path'),
              strokeWidth: getSharedValue(strokeWidth),
              strokeColor: getSharedValue(strokeColor),
              path: getSharedValue(derivedPathSharedVal),
            });
          }),
      [strokeWidth, strokeColor, setTranslate, finalize, zoomable],
    );

    const composedGesture = Gesture.Simultaneous(panGesture, pinchGesture);

    return (
      <GestureDetector gesture={composedGesture}>
        <View style={styles.canvas}>
          <Canvas
            onSize={sizeSharedVal}
            ref={ref as RefObject<CanvasRef>}
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
            >
              {pathEffect}
            </Path>
            {/* For render foreground */}
            {foreground}
          </Canvas>
        </View>
      </GestureDetector>
    );
  },
);

export default memo(DrawingCanvas);
