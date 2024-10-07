import { ImageFormat } from '@shopify/react-native-skia';
import { SharedValue, makeMutable } from 'react-native-reanimated';

export const getSharedValue = <T>(val: T | SharedValue<T>) => {
  'worklet';

  return (
    val && typeof val === 'object' && 'value' in val ? val.value : val
  ) as T;
};

const PENDING_TIMEOUTS = makeMutable<Record<string, boolean>>({});
const TIMEOUT_ID = makeMutable(0);

export type AnimatedTimeoutID = number;

const removeFromPendingTimeouts = (id: AnimatedTimeoutID) => {
  'worklet';
  PENDING_TIMEOUTS.modify(pendingTimeouts => {
    'worklet';
    delete pendingTimeouts[id];
    return pendingTimeouts;
  });
};

export const setAnimatedTimeout = <F extends () => void>(
  callback: F,
  delay: number,
): AnimatedTimeoutID => {
  'worklet';
  let startTimestamp: number;

  const currentId = TIMEOUT_ID.value;
  PENDING_TIMEOUTS.value[currentId] = true;
  TIMEOUT_ID.value += 1;

  const step = (newTimestamp: number) => {
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

export const clearAnimatedTimeout = (handle: AnimatedTimeoutID) => {
  'worklet';
  removeFromPendingTimeouts(handle);
};

const ImageFormatMap = {
  [ImageFormat.JPEG]: 'jpg',
  [ImageFormat.PNG]: 'png',
  [ImageFormat.WEBP]: 'webp',
};

export const fillBase64 = (type: ImageFormat, base64Rest: string): string => {
  const prefix = `data:image/${ImageFormatMap[type]};base64,`;
  return `${prefix}${base64Rest}`;
};

export const genUniqueKey = () => {
  'worklet';
  // random number - timestamps - random number
  return `${(Math.random() * 1000000).toFixed()}-${Date.now()}-${(Math.random() * 1000000).toFixed()}`;
};
