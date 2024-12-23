# react-native-free-canvas
Freehand sketch on canvas based on  [@shopify/react-native-skia](https://github.com/shopify/react-native-skia)

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

const effects = useMemo(() => <CornerPathEffect r={32} />, []);

// Add CornerPathEffect component to pathEffect props
<FreeCanvas
  // style={{flex: 1}}
  style={styles.flex1}
  pathEffect={effects} 
/>
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| style | `StyleProp<ViewStyle>` | Custom styles for the canvas |
| strokeColor | string \| `SharedValue<string>` | Color of the stroke |
| strokeWidth | number \| `SharedValue<number>` | Width of the stroke |
| backgroundColor | string \| `SharedValue<string>` | Background color of the canvas |
| background | React.ReactNode | Skia component for background |
| foreground | React.ReactNode | Skia component for foreground |
| pathEffect | React.ReactNode | Skia Path Effects (see [documentation](https://shopify.github.io/react-native-skia/docs/path-effects)) |
| zoomable | boolean | Enable/disable zooming |
| onDrawEnd | () => void | Callback function when drawing ends |
| onTranslate | (x: number, y: number) => void | Worklet function that runs on UI thread when canvas is translated |
| onScale | (scale: number) => void | Worklet function that runs on UI thread when canvas is scaled |
| onTransformOriginChange | (x: number, y: number) => void | Worklet function that runs on UI thread when transform origin changes |

### Transform & Scale

The order of the transform and scale in animated style for the Canvas while zooming should be:

```ts
{
  transform: [
    { translateX: translateSharedVal.value.x },
    { translateY: translateSharedVal.value.y },
    { scale: scaleSharedVal.value },
  ],
  transformOrigin: originSharedVal.value.concat([0]),
}
```

## Methods or Values
| Method | Parameters | Return Type | Description |
|--------|------------|-------------|-------------|
| reset | - | void | Resets the canvas |
| resetZoom | (duration?: number) | void | Resets the zoom level |
| undo | (step?: number) | void | Undoes the last drawing action(s) |
| toBase64 | (fmt?: ImageFormat, quality?: number) | Promise<string \| undefined> | Converts canvas to base64 string |
| getSnapshot | - | Promise<SkImage \| undefined> \| undefined | Gets a snapshot of the canvas |
| toPaths | - | DrawnPath[] | Returns the drawn paths |
| drawPaths | (paths: DrawnPath[]) | void | Draws the given paths on the canvas |
| translateSharedValue | - | `SharedValue<{ x: number; y: number }>` | Shared value for translation |
| scaleSharedValue | - | `SharedValue<number>` | Shared value for scale |
| transformOriginSharedValue | - | `SharedValue<[number, number]>` | Shared value for transform origin |

## Inspired By
[wobsoriano/rn-perfect-sketch-canvas](https://github.com/wobsoriano/rn-perfect-sketch-canvas) A React Native component for drawing perfect pressure-sensitive freehand lines using perfect-freehand and Skia renderer.
