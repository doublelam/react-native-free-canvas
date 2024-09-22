import type { ImageFormat, SkImage } from '@shopify/react-native-skia';
import type { StyleProp, ViewStyle } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

export type FreeCanvasProps = {
  style?: StyleProp<ViewStyle>;
  strokeColor?: string | SharedValue<string>;
  strokeWidth?: number | SharedValue<number>;
  backgroundColor?: string;
  background?: React.ReactNode;
  foreground?: React.ReactNode;
};

export type DrawnPath = {
  path: string;
  strokeColor: string;
  strokeWidth: number;
};

export type DrawingPath = {
  path: SharedValue<string>;
  strokeColor: string;
  strokeWidth: number;
};

export type CanvasContextType = {
  addDrawnPath: (path: DrawnPath) => void;
  setDrawingPath: (path: DrawingPath | null) => void;
  drawnPaths: DrawnPath[];
} | null;

export type FreeCanvasRef = {
  reset: () => void;
  undo: () => void;
  toBase64: (
    fmt?: ImageFormat,
    quality?: number,
  ) => Promise<string | undefined>;
  getSnapshot: () => Promise<SkImage | undefined> | undefined;
};
