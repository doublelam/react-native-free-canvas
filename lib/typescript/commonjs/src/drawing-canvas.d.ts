import { SkiaDomView } from '@shopify/react-native-skia';
import { SharedValue } from 'react-native-reanimated';
import React from 'react';
type DrawingCanvasProps = {
    foreground?: React.ReactNode;
    strokeColor: string | SharedValue<string>;
    strokeWidth: number | SharedValue<number>;
    zoomable?: boolean;
    onDrawEnd?: () => void;
};
declare const _default: React.MemoExoticComponent<React.ForwardRefExoticComponent<DrawingCanvasProps & React.RefAttributes<SkiaDomView>>>;
export default _default;
//# sourceMappingURL=drawing-canvas.d.ts.map