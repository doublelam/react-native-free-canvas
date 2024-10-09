# rn-free-canvas
Free sketch on canvas base on  @shopify/react-native-skia

![ezgif-4-3968c99ec1](https://github.com/user-attachments/assets/9b3669f7-9c01-4208-9b35-a55c31741758)



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
