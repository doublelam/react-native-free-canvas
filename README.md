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
      <FreeCanvas style={{flex: 1}} />
    </>
  )
};

```




## Properties

- style?: StyleProp<ViewStyle>;
- strokeColor?: string | SharedValue<string>;
- strokeWidth?: number | SharedValue<number>;
- backgroundColor?: string;
- background?: React.ReactNode;
- foreground?: React.ReactNode;

## Methods

- reset: () => void;
- undo: () => void;
- toBase64: (
  fmt?: ImageFormat,
  quality?: number,
) => Promise<string | undefined>;
- getSnapshot: () => Promise<SkImage | undefined> | undefined;
