"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSharedValue = exports.genUniqueKey = exports.fillBase64 = void 0;
var _reactNativeSkia = require("@shopify/react-native-skia");
const getSharedValue = val => {
  'worklet';

  return val && typeof val === 'object' && 'value' in val ? val.value : val;
};
exports.getSharedValue = getSharedValue;
const ImageFormatMap = {
  [_reactNativeSkia.ImageFormat.JPEG]: 'jpg',
  [_reactNativeSkia.ImageFormat.PNG]: 'png',
  [_reactNativeSkia.ImageFormat.WEBP]: 'webp'
};
const fillBase64 = (type, base64Rest) => {
  const prefix = `data:image/${ImageFormatMap[type]};base64,`;
  return `${prefix}${base64Rest}`;
};
exports.fillBase64 = fillBase64;
const genUniqueKey = prefix => {
  'worklet';

  // random number - timestamps - random number
  return `${prefix}-${(Math.random() * 1000000).toFixed()}-${Date.now()}-${(Math.random() * 1000000).toFixed()}`;
};
exports.genUniqueKey = genUniqueKey;
//# sourceMappingURL=utils.js.map