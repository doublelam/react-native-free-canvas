import { SharedValue } from 'react-native-reanimated';
export declare const getSharedValue: <T>(val: T | SharedValue<T>) => T;
export type AnimatedTimeoutID = number;
export declare function setAnimatedTimeout<F extends () => void>(callback: F, delay: number): AnimatedTimeoutID;
export declare function clearAnimatedTimeout(handle: AnimatedTimeoutID): void;
//# sourceMappingURL=utils.d.ts.map