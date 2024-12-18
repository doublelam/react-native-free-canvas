"use strict";

import { ImageFormat } from '@shopify/react-native-skia';
export const getSharedValue = val => {
  'worklet';

  return val && typeof val === 'object' && 'value' in val ? val.value : val;
};
const ImageFormatMap = {
  [ImageFormat.JPEG]: 'jpg',
  [ImageFormat.PNG]: 'png',
  [ImageFormat.WEBP]: 'webp'
};
export const fillBase64 = (type, base64Rest) => {
  const prefix = `data:image/${ImageFormatMap[type]};base64,`;
  return `${prefix}${base64Rest}`;
};
export const genUniqueKey = prefix => {
  'worklet';

  // random number - timestamps - random number
  return `${prefix}-${(Math.random() * 1000000).toFixed()}-${Date.now()}-${(Math.random() * 1000000).toFixed()}`;
};
//# sourceMappingURL=utils.js.map