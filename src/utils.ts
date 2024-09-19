import { SharedValue } from "react-native-reanimated";

export const getSharedValue = <T extends unknown>(val: T | SharedValue<T>) => {
  'worklet';

  return (val && typeof val === 'object' && 'value' in val) ? val.value : val;
};
