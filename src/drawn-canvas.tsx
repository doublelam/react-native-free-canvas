import {
  Canvas,
  Path,
  Rect,
  SkiaDomView,
  SkSize,
} from '@shopify/react-native-skia';
import styles from './styles';
import {
  SharedValue,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import React, { forwardRef, RefObject, useContext, useEffect } from 'react';
import CanvasContext from './canvas-context';

type DrawnCanvasProps = {
  backgroundColor?: string | SharedValue<string>;
  background?: React.ReactNode;
  pathEffect?: React.ReactNode;
  foreground?: React.ReactNode;
};

const DrawnCanvas = forwardRef<SkiaDomView, DrawnCanvasProps>(
  ({ background, pathEffect, foreground, backgroundColor }, ref) => {
    const sizeSharedValue: SharedValue<SkSize> = useSharedValue({
      width: 0,
      height: 0,
    });

    const derivedWidth = useDerivedValue(() => sizeSharedValue.value.width, []);
    const derivedHeight = useDerivedValue(
      () => sizeSharedValue.value.height,
      [],
    );

    const context = useContext(CanvasContext);

    useEffect(() => {
      const last = context?.drawnPaths.at(-1);
      if (last && context?.pathCompleteDelivery) {
        try {
          context.pathCompleteDelivery.resolve(last.key, true);
        } catch {
          // Nothing to do here;
        }
      }
    }, [context?.drawnPaths]);

    return (
      <Canvas
        ref={ref as RefObject<SkiaDomView>}
        style={styles.canvas}
        onSize={sizeSharedValue}
      >
        {/* For render backgroundColor */}
        {backgroundColor ? (
          <Rect
            x={0}
            y={0}
            width={derivedWidth}
            height={derivedHeight}
            color={backgroundColor}
          />
        ) : null}
        {/* For render background */}
        {background}

        {/* Drawn paths */}
        {context?.drawnPaths.map((path, index) => (
          <Path
            key={index}
            style="stroke"
            path={path.path}
            strokeWidth={path.strokeWidth}
            strokeJoin="round"
            strokeCap="round"
            color={path.strokeColor}
          >
            {pathEffect}
          </Path>
        ))}

        {/* Foreground component */}
        {foreground}
      </Canvas>
    );
  },
);

export default DrawnCanvas;
