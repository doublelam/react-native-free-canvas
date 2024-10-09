import { SkiaDomView } from '@shopify/react-native-skia';
import { SharedValue } from 'react-native-reanimated';
import React from 'react';
type DrawnCanvasProps = {
    backgroundColor?: string | SharedValue<string>;
    background?: React.ReactNode;
};
declare const DrawnCanvas: React.ForwardRefExoticComponent<DrawnCanvasProps & React.RefAttributes<SkiaDomView>>;
export default DrawnCanvas;
//# sourceMappingURL=drawn-canvas.d.ts.map