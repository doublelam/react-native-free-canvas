import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { Slot } from 'expo-router';
import React from 'react';

/**
 * Single-route demo: use Slot so we do not mount a native Stack parallel to
 * expo-router's own navigation tree. Declaring @react-navigation/native ^7 at
 * the app root can resolve ahead of expo-router's bundled version and triggers
 * "Couldn't find the prevent remove context / NavigationContent" errors.
 */
export default function RootLayout() {
  return <Slot />;
}
