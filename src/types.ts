import type { ImageFormat, SkImage } from '@shopify/react-native-skia';
import type { StyleProp, ViewStyle } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import type Delivery from 'promises-delivery';

export type FreeCanvasProps = {
  style?: StyleProp<ViewStyle>;
  strokeColor?: string | SharedValue<string>;
  strokeWidth?: number | SharedValue<number>;
  backgroundColor?: string | SharedValue<string>;
  zoomable?: boolean;
  zoomRange?: [number, number];
  background?: React.ReactNode;
  foreground?: React.ReactNode;
  pathEffect?: React.ReactNode;
  onDrawEnd?: () => void;
  onTranslate?: (x: number, y: number) => void;
  onScale?: (scale: number) => void;
  onTransformOriginChange?: (x: number, y: number) => void;
};

export type DrawnPath = {
  key: string;
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
  setScale: (x: number, y: number, scale: number) => void;
  setTranslate: (x: number, y: number) => void;
  finalize: () => void;
  pathCompleteDelivery: Delivery<true>;
} | null;

export type FreeCanvasRef = {
  reset: () => void;
  resetZoom: (duration?: number) => void;
  undo: (step?: number /* step = 1 */) => void;
  toBase64: (
    fmt?: ImageFormat,
    quality?: number,
  ) => Promise<string | undefined>;
  getSnapshot: () => Promise<SkImage | undefined> | undefined;
  toPaths: () => DrawnPath[];
  drawPaths: (paths: DrawnPath[]) => void;
  translateSharedValue: SharedValue<{ x: number; y: number }>;
  scaleSharedValue: SharedValue<number>;
  transformOriginSharedValue: SharedValue<[number, number]>;
};
