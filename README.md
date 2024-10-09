# react-native-free-canvas
Free sketch on canvas base on  @shopify/react-native-skia

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

# Methods

- reset: () => void;
- undo: () => void;
- toBase64: (
  fmt?: ImageFormat,
  quality?: number,
) => Promise<string | undefined>;
- getSnapshot: () => Promise<SkImage | undefined> | undefined;
