# react-native-free-canvas
Free sketch on canvas base on  @shopify/react-native-skia


https://github.com/user-attachments/assets/3f1801ea-42b9-460d-a361-278217604f07




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
