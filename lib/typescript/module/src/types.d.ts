import type { ImageFormat, SkImage } from '@shopify/react-native-skia';
import type { StyleProp, ViewStyle } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
export type FreeCanvasProps = {
    style?: StyleProp<ViewStyle>;
    strokeColor?: string | SharedValue<string>;
    strokeWidth?: number | SharedValue<number>;
    backgroundColor?: string | SharedValue<string>;
    zoomable?: boolean;
    background?: React.ReactNode;
    foreground?: React.ReactNode;
    onDrawEnd?: () => void;
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
} | null;
export type FreeCanvasRef = {
    reset: () => void;
    undo: () => void;
    toBase64: (fmt?: ImageFormat, quality?: number) => Promise<string | undefined>;
    getSnapshot: () => Promise<SkImage | undefined> | undefined;
    toPaths: () => DrawnPath[];
    drawPaths: (paths: DrawnPath[]) => void;
};
//# sourceMappingURL=types.d.ts.map