import { Canvas, Path, Rect, SkSize } from '@shopify/react-native-skia';
import styles from './styles';
import { SharedValue, useSharedValue } from 'react-native-reanimated';
import React, { useContext } from 'react';
import CanvasContext from './canvas-context';

type DrawnCanvasProps = {
  backgroundColor?: string;
  background?: React.ReactNode;
};

const DrawnCanvas: React.FC<DrawnCanvasProps> = ({
  background,
  backgroundColor,
}) => {
  const sizeSharedValue: SharedValue<SkSize> = useSharedValue({
    width: 0,
    height: 0,
  });

  const context = useContext(CanvasContext);

  return (
    <Canvas style={styles.canvas} onSize={sizeSharedValue}>
      {/* For render backgroundColor */}
      {backgroundColor ? (
        <Rect
          x={0}
          y={0}
          width={sizeSharedValue.value.width}
          height={sizeSharedValue.value.height}
          color={backgroundColor}
        />
      ) : null}
      {/* For render background */}
      {background}

      {/* Drawn paths */}
      {
        context?.drawnPaths.map((path, index) => (
          <Path
            key={index}
            style="stroke"
            path={path.path} 
            strokeWidth={path.strokeWidth} 
            color={path.strokeColor} 
          />
        ))
      }
    </Canvas>
  );
};

export default DrawnCanvas;
