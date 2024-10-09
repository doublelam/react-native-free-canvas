import type { SkPath } from '@shopify/react-native-skia';
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
export type DrownPath = {
    path: string;
    strokeColor: string;
    strokeWidth: number;
};
export type DrawingPath = {
    path: SkPath;
    strokeColor: string;
    strokeWidth: number;
};
//# sourceMappingURL=types.d.ts.map