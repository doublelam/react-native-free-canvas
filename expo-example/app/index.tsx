import { StyleSheet, View, Button } from 'react-native';
import React, { useRef, useState } from 'react';
import FreeCanvas, { FreeCanvasRef } from 'react-native-free-canvas';
import { Canvas, Image, Skia } from '@shopify/react-native-skia';
export default function HomeScreen() {
  const ref = useRef<FreeCanvasRef>(null);
  const [img, setImg] = useState('');
  const data = Skia.Data.fromBase64(img);
  const image = Skia.Image.MakeImageFromEncoded(data);
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <FreeCanvas
          ref={ref}
          zoomRange={[0.1, 7]}
          zoomable
          style={{ flex: 1 }}
          backgroundColor={'#eee'}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            gap: 4,
            padding: 8,
          }}
        >
          <Button title="undo" onPress={() => ref.current?.undo()} />
          <Button title="reset" onPress={() => ref.current?.reset()} />
          <Button title="resetZoom" onPress={() => ref.current?.resetZoom()} />
          <Button
            title="Get image"
            onPress={async () => {
              const base64 = await ref.current?.toBase64();
              if (base64) {
                setImg(base64);
              }
            }}
          />
        </View>
        <View></View>

        <View style={styles.img}>
          {img ? (
            <Canvas style={{ flex: 1 }}>
              <Image image={image} x={0} y={0} width={50} height={100} />
            </Canvas>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  img: {
    position: 'absolute',
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
    borderColor: 'black',
    backgroundColor: 'white',
    top: 40,
    right: 20,
    width: 50,
    height: 100,
  },
});
