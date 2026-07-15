/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const libraryRoot = path.resolve(projectRoot, '..');
const librarySrc = path.join(libraryRoot, 'src');
const libraryEntry = path.join(librarySrc, 'index.tsx');
const appNodeModules = path.resolve(projectRoot, 'node_modules');

const config = getDefaultConfig(projectRoot);

// Watch source only — not the library root (avoids its node_modules + nested expo-example).
config.watchFolders = [
  ...new Set([...(config.watchFolders ?? []), librarySrc]),
];

config.resolver.disableHierarchicalLookup = true;
config.resolver.nodeModulesPaths = [appNodeModules];

// Single copies of peers (library src imports these; must match Expo Go / example).
const peerPackages = [
  'react',
  'react-native',
  '@shopify/react-native-skia',
  'react-native-reanimated',
  'react-native-gesture-handler',
  'react-native-worklets',
  'promises-delivery',
];

config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules ?? {}),
  'react-native-free-canvas': librarySrc,
  ...Object.fromEntries(
    peerPackages.map(name => [name, path.join(appNodeModules, name)]),
  ),
};

// Prefer live src even if Yarn ever points at package root / lib again.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react-native-free-canvas') {
    return {
      type: 'sourceFile',
      filePath: libraryEntry,
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
