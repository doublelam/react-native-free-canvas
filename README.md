# react-native-free-canvas
Free sketch on canvas base on  [@shopify/react-native-skia](https://github.com/shopify/react-native-skia)

<img src="https://github.com/user-attachments/assets/b8749961-5d4d-482c-aa6c-add5b0f5b654" width=200 />

## Install
You need to install following dependencies
```
"@shopify/react-native-skia": ">=1.0.0",
"react": ">=18.0.0",
"react-native": ">=0.72.0",
"react-native-gesture-handler": ">=2.0.0",
"react-native-reanimated": ">=3.0.0"
```

## Usage
```ts
import FreeCanvas from 'react-native-free-canvas';

const App = () => {
  return (
    <>
      <FreeCanvas
        // style={{flex: 1}} 
        style={styles.flex1} //avoid using a new Object to prevent unnecessary re-rendering
      />
    </>
  )
};

```

### Make Line Smoother
```ts
import {CornerPathEffect} from '@shopify/react-native-skia';

// Add CornerPathEffect component to pathEffect props
<FreeCanvas
  // style={{flex: 1}}
  style={styles.flex1}
  pathEffect={<CornerPathEffect r={32} />} 
/>
```




## Properties
```ts
{
  style?: StyleProp<ViewStyle>;
  strokeColor?: string | SharedValue<string>;
  strokeWidth?: number | SharedValue<number>;
  backgroundColor?: string | SharedValue<string>;
  background?: React.ReactNode; // Should be Skia component
  foreground?: React.ReactNode; // Should be Skia component
  pathEffect?: React.ReactNode; // Should be Skia Path Effects (https://shopify.github.io/react-native-skia/docs/path-effects)
  zoomable?: boolean;
  onDrawEnd?: () => void;
  onTranslate?: (x: number, y: number) => void; // should be a worklet function, it runs on UI thread
  onScale?: (scale: number) => void; // should be a worklet function, it runs on UI thread
  onTransformOriginChange?: (x: number, y: number) => void; // should be a worklet function, it runs on UI thread
}
```

## Methods
```ts
{
  reset: () => void;
  resetZoom: (duration?: number) => void;
  undo: (step?: number) => void;
  toBase64: (
    fmt?: ImageFormat,
    quality?: number,
  ) => Promise<string | undefined>;
  getSnapshot: () => Promise<SkImage | undefined> | undefined;
  toPaths: () => DrawnPath[];
  drawPaths: (paths: DrawnPath[]) => void;
  translateSharedValue: SharedValue<{ x: number; y: number }>;
  scaleSharedValue: SharedValue<number>;
}
```

## Inspired By
[wobsoriano/rn-perfect-sketch-canvas](https://github.com/wobsoriano/rn-perfect-sketch-canvas) A React Native component for drawing perfect pressure-sensitive freehand lines using perfect-freehand and Skia renderer.
