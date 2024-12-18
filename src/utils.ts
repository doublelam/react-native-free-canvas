import { ImageFormat } from '@shopify/react-native-skia';
import { SharedValue } from 'react-native-reanimated';

export const getSharedValue = <T>(val: T | SharedValue<T>) => {
  'worklet';

  return (
    val && typeof val === 'object' && 'value' in val ? val.value : val
  ) as T;
};

export type AnimatedTimeoutID = number;

const ImageFormatMap = {
  [ImageFormat.JPEG]: 'jpg',
  [ImageFormat.PNG]: 'png',
  [ImageFormat.WEBP]: 'webp',
};

export const fillBase64 = (type: ImageFormat, base64Rest: string): string => {
  const prefix = `data:image/${ImageFormatMap[type]};base64,`;
  return `${prefix}${base64Rest}`;
};

export const genUniqueKey = (prefix?: string) => {
  'worklet';
  // random number - timestamps - random number
  return `${prefix}-${(Math.random() * 1000000).toFixed()}-${Date.now()}-${(Math.random() * 1000000).toFixed()}`;
};
