"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setAnimatedTimeout = exports.getSharedValue = exports.fillBase64 = exports.clearAnimatedTimeout = void 0;
var _reactNativeSkia = require("@shopify/react-native-skia");
var _reactNativeReanimated = require("react-native-reanimated");
const getSharedValue = val => {
  'worklet';

  return val && typeof val === 'object' && 'value' in val ? val.value : val;
};
exports.getSharedValue = getSharedValue;
const PENDING_TIMEOUTS = (0, _reactNativeReanimated.makeMutable)({});
const TIMEOUT_ID = (0, _reactNativeReanimated.makeMutable)(0);
const removeFromPendingTimeouts = id => {
  'worklet';

  PENDING_TIMEOUTS.modify(pendingTimeouts => {
    'worklet';

    delete pendingTimeouts[id];
    return pendingTimeouts;
  });
};
const setAnimatedTimeout = (callback, delay) => {
  'worklet';

  let startTimestamp;
  const currentId = TIMEOUT_ID.value;
  PENDING_TIMEOUTS.value[currentId] = true;
  TIMEOUT_ID.value += 1;
  const step = newTimestamp => {
    if (!PENDING_TIMEOUTS.value[currentId]) {
      return;
    }
    if (startTimestamp === undefined) {
      startTimestamp = newTimestamp;
    }
    if (newTimestamp >= startTimestamp + delay) {
      removeFromPendingTimeouts(currentId);
      callback();
      return;
    }
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
  return currentId;
};
exports.setAnimatedTimeout = setAnimatedTimeout;
const clearAnimatedTimeout = handle => {
  'worklet';

  removeFromPendingTimeouts(handle);
};
exports.clearAnimatedTimeout = clearAnimatedTimeout;
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
//# sourceMappingURL=utils.js.map