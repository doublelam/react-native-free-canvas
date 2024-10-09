import { Canvas, Path, Rect, SkSize } from '@shopify/react-native-skia';
import styles from './styles';
import { SharedValue, useSharedValue } from 'react-native-reanimated';
import React from 'react';
import { DrawingPath } from './types';

type DrawingCanvasProps = {
  foreground?: React.ReactNode;
  drawingPath?: DrawingPath;
};

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  foreground,
  drawingPath,
}) => {
  return (
    <Canvas style={styles.canvas}>
      {/* Drawing path */}
      {drawingPath ? (
        <Path
          path={drawingPath.path}
          color={drawingPath.strokeColor}
          stroke={{ width: drawingPath.strokeWidth }}
        />
      ) : null}
      {/* For render foreground */}
      {foreground ? foreground : null}
    </Canvas>
  );
};

export default DrawingCanvas;
