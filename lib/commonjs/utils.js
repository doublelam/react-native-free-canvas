"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearAnimatedTimeout = clearAnimatedTimeout;
exports.getSharedValue = void 0;
exports.setAnimatedTimeout = setAnimatedTimeout;
var _reactNativeReanimated = require("react-native-reanimated");
const getSharedValue = val => {
  'worklet';

  return val && typeof val === 'object' && 'value' in val ? val.value : val;
};
exports.getSharedValue = getSharedValue;
const PENDING_TIMEOUTS = (0, _reactNativeReanimated.makeMutable)({});
const TIMEOUT_ID = (0, _reactNativeReanimated.makeMutable)(0);
function removeFromPendingTimeouts(id) {
  'worklet';

  PENDING_TIMEOUTS.modify(pendingTimeouts => {
    'worklet';

    delete pendingTimeouts[id];
    return pendingTimeouts;
  });
}
function setAnimatedTimeout(callback, delay) {
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
}
function clearAnimatedTimeout(handle) {
  'worklet';

  removeFromPendingTimeouts(handle);
}
//# sourceMappingURL=utils.js.map