import { Canvas, DiscretePathEffect, Path, Rect, Skia, SkiaDomView, SkPath, SkSize, StrokeOpts, useCanvasRef } from '@shopify/react-native-skia';
import styles from './styles';
import { getRelativeCoords, runOnJS, SharedValue, useAnimatedRef, useDerivedValue, useSharedValue } from 'react-native-reanimated';
import React, { forwardRef, memo, RefObject, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { DrawingPath, DrawnPath } from './types';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { View } from 'react-native';
import CanvasContext from './canvas-context';
import { clearAnimatedTimeout, getSharedValue, setAnimatedTimeout } from 'react-native-free-canvas/src/utils';

type DrawingCanvasProps = {
  foreground?: React.ReactNode;
  strokeColor: string | SharedValue<string>;
  strokeWidth: number | SharedValue<number>;
};

const DrawingCanvas = forwardRef<SkiaDomView, DrawingCanvasProps>(({
  foreground,
  strokeColor,
  strokeWidth,
}, ref) => {
  const pathSharedVal = useSharedValue(Skia.Path.Make());
  const viewRef = useAnimatedRef<View>();
  let animatedTimeout = useSharedValue(0);
  const derivedPathSharedVal = useDerivedValue(() => pathSharedVal.value.toSVGString(), []);
  const context = useContext(CanvasContext);
  const changeDrawing = useCallback((clear: boolean) => {
    context?.setDrawingPath(clear ? null : {
      strokeWidth: getSharedValue(strokeWidth),
      strokeColor: getSharedValue(strokeColor),
      path: derivedPathSharedVal,
    });
  }, [strokeWidth, strokeColor]);

  const setDrawn = useCallback((path: DrawnPath) => {
    context?.addDrawnPath(path)
  }, []);

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .onBegin(e => {
          'worklet';
          const coords = getRelativeCoords(viewRef as any, e.absoluteX, e.absoluteY);          
          clearAnimatedTimeout(animatedTimeout.value);
          pathSharedVal.modify((v) => {
            v.reset();
            v.moveTo(coords?.x||0, coords?.y||0);
            return v;
          });
          runOnJS(changeDrawing)(false);
          console.log(e.absoluteX);
        })
        .onUpdate(e => {
          'worklet';
          const coords = getRelativeCoords(viewRef as any, e.absoluteX, e.absoluteY);
          pathSharedVal.modify((v) => {
            v.lineTo(coords?.x||0, coords?.y||0);
            return v;
          });
        })
        .onFinalize(e => {
          'worklet';

          runOnJS(changeDrawing)(true);
          runOnJS(setDrawn)({
            strokeWidth: getSharedValue(strokeWidth), 
            strokeColor: getSharedValue(strokeColor),
            path: getSharedValue(derivedPathSharedVal),
          });

          animatedTimeout.value = setAnimatedTimeout(() => {
            pathSharedVal.modify((v) => {
              v.reset();
              return v;
            });
          }, 1000);

          console.log(e.absoluteX);
        }),
    [],
  );

  return (
    <GestureDetector gesture={panGesture}>
      <View ref={viewRef} style={styles.canvas}>
        <Canvas ref={ref as RefObject<SkiaDomView>} style={{flex: 1}}>
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
});

export default memo(DrawingCanvas);
