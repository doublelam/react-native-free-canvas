import { ImageFormat } from '@shopify/react-native-skia';
import { SharedValue } from 'react-native-reanimated';
export declare const getSharedValue: <T>(val: T | SharedValue<T>) => T;
export type AnimatedTimeoutID = number;
export declare const setAnimatedTimeout: <F extends () => void>(callback: F, delay: number) => AnimatedTimeoutID;
export declare const clearAnimatedTimeout: (handle: AnimatedTimeoutID) => void;
export declare const fillBase64: (type: ImageFormat, base64Rest: string) => string;
//# sourceMappingURL=utils.d.ts.map