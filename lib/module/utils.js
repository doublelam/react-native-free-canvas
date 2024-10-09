"use strict";

import { ImageFormat } from '@shopify/react-native-skia';
import { makeMutable } from 'react-native-reanimated';
export const getSharedValue = val => {
  'worklet';

  return val && typeof val === 'object' && 'value' in val ? val.value : val;
};
const PENDING_TIMEOUTS = makeMutable({});
const TIMEOUT_ID = makeMutable(0);
const removeFromPendingTimeouts = id => {
  'worklet';

  PENDING_TIMEOUTS.modify(pendingTimeouts => {
    'worklet';

    delete pendingTimeouts[id];
    return pendingTimeouts;
  });
};
export const setAnimatedTimeout = (callback, delay) => {
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
export const clearAnimatedTimeout = handle => {
  'worklet';

  removeFromPendingTimeouts(handle);
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
export const genUniqueKey = () => {
  'worklet';

  // random number - timestamps - random number
  return `${(Math.random() * 1000000).toFixed()}-${Date.now()}-${(Math.random() * 1000000).toFixed()}`;
};
//# sourceMappingURL=utils.js.map