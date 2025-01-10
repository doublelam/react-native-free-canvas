/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

const extraNodeModules = {
  'react-native-free-canvas': path.resolve(__dirname + '../../'),
};
const watchFolder = path.resolve(__dirname + '../../');

config.resolver = { ...config.resolver, extraNodeModules };
config.watchFolders = [...config.watchFolders, watchFolder];

module.exports = config;
