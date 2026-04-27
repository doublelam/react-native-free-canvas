/** @type {import('@babel/core').ConfigFunction} */
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // Reanimated 4's entry re-exports `react-native-worklets/plugin`; must be last.
    plugins: ['react-native-reanimated/plugin'],
  };
};
