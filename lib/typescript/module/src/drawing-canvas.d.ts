import { CanvasRef } from '@shopify/react-native-skia';
import { SharedValue } from 'react-native-reanimated';
import React from 'react';
type DrawingCanvasProps = {
    pathEffect?: React.ReactNode;
    foreground?: React.ReactNode;
    strokeColor: string | SharedValue<string>;
    strokeWidth: number | SharedValue<number>;
    zoomable?: boolean;
    onDrawEnd?: () => void;
};
declare const _default: React.NamedExoticComponent<DrawingCanvasProps & React.RefAttributes<CanvasRef>>;
export default _default;
//# sourceMappingURL=drawing-canvas.d.ts.map