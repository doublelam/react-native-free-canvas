import {
  CornerPathEffect,
  ImageFormat,
  Path as SkiaPath,
  Rect,
  Canvas,
  Image,
  Skia,
} from '@shopify/react-native-skia';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Alert,
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import FreeCanvas, { type FreeCanvasRef } from 'react-native-free-canvas';

const STROKE_PRESETS = [
  { color: '#38bdf8', label: 'Sky' },
  { color: '#f472b6', label: 'Pink' },
  { color: '#fbbf24', label: 'Amber' },
  { color: '#34d399', label: 'Mint' },
  { color: '#a78bfa', label: 'Violet' },
  { color: '#f8fafc', label: 'Snow' },
] as const;

const WIDTH_PRESETS = [4, 8, 14, 22] as const;

const BG_PRESETS = ['#f1f5f9', '#ecfdf5', '#fff7ed', '#1e293b'] as const;

const ZOOM_PRESETS: [number, number][] = [
  [0.35, 5],
  [0.5, 2],
  [0.8, 1.8],
];

function buildDotGridPath(width: number, height: number) {
  const p = Skia.Path.Make();
  const step = 26;
  for (let x = step; x < width; x += step) {
    for (let y = step; y < height; y += step) {
      p.addCircle(x, y, 1.25);
    }
  }
  return p;
}

export default function HomeScreen() {
  const ref = useRef<FreeCanvasRef>(null);
  const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 });
  const [strokeColor, setStrokeColor] = useState<string>(
    STROKE_PRESETS[0].color,
  );
  const [strokeWidth, setStrokeWidth] = useState(8);
  const [backgroundColor, setBackgroundColor] = useState<string>(BG_PRESETS[0]);
  const [smoothCorners, setSmoothCorners] = useState(true);
  const [zoomable, setZoomable] = useState(true);
  const [zoomRange, setZoomRange] = useState<[number, number]>(ZOOM_PRESETS[0]);
  const [strokeCount, setStrokeCount] = useState(0);
  const [snapshotB64, setSnapshotB64] = useState<string | null>(null);
  const [metrics, setMetrics] = useState({
    tx: 0,
    ty: 0,
    scale: 1,
    ox: 0,
    oy: 0,
  });

  const mergeMetrics = useCallback((patch: Partial<typeof metrics>) => {
    setMetrics(m => ({ ...m, ...patch }));
  }, []);

  const onTranslate = useCallback(
    (x: number, y: number) => {
      'worklet';
      scheduleOnRN(mergeMetrics, { tx: x, ty: y });
    },
    [mergeMetrics],
  );

  const onScale = useCallback(
    (scale: number) => {
      'worklet';
      scheduleOnRN(mergeMetrics, { scale });
    },
    [mergeMetrics],
  );

  const onTransformOriginChange = useCallback(
    (x: number, y: number) => {
      'worklet';
      scheduleOnRN(mergeMetrics, { ox: x, oy: y });
    },
    [mergeMetrics],
  );

  const pathEffect = useMemo(
    () =>
      smoothCorners ? (
        <CornerPathEffect r={Math.max(16, strokeWidth * 1.8)} />
      ) : undefined,
    [smoothCorners, strokeWidth],
  );

  const gridPath = useMemo(() => {
    if (canvasSize.w < 8 || canvasSize.h < 8) {
      return null;
    }
    return buildDotGridPath(canvasSize.w, canvasSize.h);
  }, [canvasSize.w, canvasSize.h]);

  const foreground = useMemo(() => {
    const w = Math.max(canvasSize.w, 1);
    const h = Math.max(canvasSize.h, 1);
    const t = 3;
    const c = 'rgba(56, 189, 248, 0.45)';
    return (
      <>
        <Rect x={0} y={0} width={w} height={t} color={c} />
        <Rect x={0} y={h - t} width={w} height={t} color={c} />
        <Rect x={0} y={0} width={t} height={h} color={c} />
        <Rect x={w - t} y={0} width={t} height={h} color={c} />
      </>
    );
  }, [canvasSize.w, canvasSize.h]);

  const onCanvasLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setCanvasSize({ w: width, h: height });
  }, []);

  const snapshotImage = useMemo(() => {
    if (!snapshotB64) {
      return null;
    }
    const data = Skia.Data.fromBase64(snapshotB64);
    return Skia.Image.MakeImageFromEncoded(data);
  }, [snapshotB64]);

  const capturePng = useCallback(async () => {
    const b64 = await ref.current?.toBase64(ImageFormat.PNG, 92);
    if (b64) {
      setSnapshotB64(b64);
    } else {
      Alert.alert('Snapshot', 'Nothing to export yet — draw a stroke first.');
    }
  }, []);

  const captureJpeg = useCallback(async () => {
    const b64 = await ref.current?.toBase64(ImageFormat.JPEG, 88);
    if (b64) {
      setSnapshotB64(b64);
    } else {
      Alert.alert('Snapshot', 'Nothing to export yet — draw a stroke first.');
    }
  }, []);

  const captureViaGetSnapshot = useCallback(async () => {
    const img = await ref.current?.getSnapshot();
    if (!img) {
      Alert.alert('getSnapshot', 'No image returned.');
      return;
    }
    const b64 = img.encodeToBase64(ImageFormat.PNG, 90);
    setSnapshotB64(b64);
  }, []);

  const sharePaths = useCallback(() => {
    const paths = ref.current?.toPaths() ?? [];
    const json = JSON.stringify(paths, null, 2);
    Share.share({ message: json, title: 'Drawn paths' }).catch(() => {});
  }, []);

  const restoreDemo = useCallback(() => {
    const paths = ref.current?.toPaths() ?? [];
    if (paths.length === 0) {
      Alert.alert('Paths', 'Draw something first, then use Restore demo.');
      return;
    }
    ref.current?.reset();
    requestAnimationFrame(() => {
      ref.current?.drawPaths(paths);
    });
  }, []);

  const handleUndo = useCallback(() => {
    const steps = ref.current?.undo() as number | false | undefined;
    if (typeof steps === 'number' && steps > 0) {
      setStrokeCount(c => Math.max(0, c - steps));
    }
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Free canvas</Text>
        <Text style={styles.subtitle}>
          Draw · pinch zoom · two-finger pan{zoomable ? '' : ' (zoom off)'}
        </Text>
        <View style={styles.metricsRow}>
          <View style={styles.metricChip}>
            <Text style={styles.metricLabel}>pan</Text>
            <Text style={styles.metricValue}>
              {metrics.tx.toFixed(0)}, {metrics.ty.toFixed(0)}
            </Text>
          </View>
          <View style={styles.metricChip}>
            <Text style={styles.metricLabel}>scale</Text>
            <Text style={styles.metricValue}>{metrics.scale.toFixed(2)}×</Text>
          </View>
          <View style={styles.metricChip}>
            <Text style={styles.metricLabel}>origin</Text>
            <Text style={styles.metricValue}>
              {metrics.ox.toFixed(0)}, {metrics.oy.toFixed(0)}
            </Text>
          </View>
          <View style={styles.metricChip}>
            <Text style={styles.metricLabel}>strokes</Text>
            <Text style={styles.metricValue}>{strokeCount}</Text>
          </View>
        </View>
      </View>

      <View style={styles.canvasShell} onLayout={onCanvasLayout}>
        <View style={styles.canvasInner}>
          <FreeCanvas
            ref={ref}
            style={styles.canvas}
            strokeColor={strokeColor}
            strokeWidth={strokeWidth}
            backgroundColor={backgroundColor}
            background={
              gridPath ? (
                <SkiaPath
                  path={gridPath}
                  style="fill"
                  color="rgba(15, 23, 42, 0.07)"
                />
              ) : null
            }
            foreground={foreground}
            pathEffect={pathEffect}
            zoomable={zoomable}
            zoomRange={zoomRange}
            onDrawEnd={() => setStrokeCount(c => c + 1)}
            onTranslate={onTranslate}
            onScale={onScale}
            onTransformOriginChange={onTransformOriginChange}
          />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.sectionTitle}>Stroke</Text>
        <View style={styles.rowWrap}>
          {STROKE_PRESETS.map(p => (
            <Pressable
              key={p.color}
              onPress={() => setStrokeColor(p.color)}
              style={({ pressed }) => [
                styles.swatch,
                { backgroundColor: p.color },
                strokeColor === p.color && styles.swatchActive,
                pressed && styles.swatchPressed,
              ]}
              accessibilityLabel={p.label}
            />
          ))}
        </View>

        <Text style={styles.sectionLabel}>Width</Text>
        <View style={styles.rowWrap}>
          {WIDTH_PRESETS.map(w => (
            <Pressable
              key={w}
              onPress={() => setStrokeWidth(w)}
              style={({ pressed }) => [
                styles.widthChip,
                strokeWidth === w && styles.widthChipActive,
                pressed && styles.widthChipPressed,
              ]}
            >
              <Text
                style={[
                  styles.widthChipText,
                  strokeWidth === w && styles.widthChipTextActive,
                ]}
              >
                {w}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Actions</Text>
        <View style={styles.rowWrap}>
          <Pressable style={styles.actionBtn} onPress={handleUndo}>
            <Text style={styles.actionBtnText}>Undo</Text>
          </Pressable>
          <Pressable
            style={styles.actionBtn}
            onPress={() => {
              ref.current?.reset();
              setStrokeCount(0);
              setSnapshotB64(null);
            }}
          >
            <Text style={styles.actionBtnText}>Reset</Text>
          </Pressable>
          <Pressable
            style={styles.actionBtn}
            onPress={() => ref.current?.resetZoom()}
          >
            <Text style={styles.actionBtnText}>Reset zoom</Text>
          </Pressable>
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Smooth corners</Text>
          <Switch value={smoothCorners} onValueChange={setSmoothCorners} />
        </View>

        <Text style={styles.sectionTitle}>Canvas</Text>
        <Text style={styles.sectionLabel}>Background</Text>
        <View style={styles.rowWrap}>
          {BG_PRESETS.map(c => (
            <Pressable
              key={c}
              onPress={() => setBackgroundColor(c)}
              style={({ pressed }) => [
                styles.bgSwatch,
                { backgroundColor: c },
                backgroundColor === c && styles.bgSwatchActive,
                pressed && styles.bgSwatchPressed,
              ]}
              accessibilityLabel={`Background ${c}`}
            />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Zoom</Text>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Pinch & two-finger pan</Text>
          <Switch value={zoomable} onValueChange={setZoomable} />
        </View>
        <Text style={styles.sectionLabel}>Range (min × — max ×)</Text>
        <View style={styles.rowWrap}>
          {ZOOM_PRESETS.map(([lo, hi]) => {
            const isActive = zoomRange[0] === lo && zoomRange[1] === hi;
            return (
              <Pressable
                key={`${lo}-${hi}`}
                onPress={() => setZoomRange([lo, hi])}
                style={({ pressed }) => [
                  styles.zoomChip,
                  isActive && styles.zoomChipActive,
                  pressed && styles.zoomChipPressed,
                ]}
              >
                <Text
                  style={[
                    styles.zoomChipText,
                    isActive && styles.zoomChipTextActive,
                  ]}
                >
                  {lo} — {hi}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Snapshot</Text>
        <View style={styles.rowWrap}>
          <Pressable style={styles.actionBtn} onPress={capturePng}>
            <Text style={styles.actionBtnText}>PNG</Text>
          </Pressable>
          <Pressable style={styles.actionBtn} onPress={captureJpeg}>
            <Text style={styles.actionBtnText}>JPEG</Text>
          </Pressable>
          <Pressable style={styles.actionBtn} onPress={captureViaGetSnapshot}>
            <Text style={styles.actionBtnText}>getSnapshot</Text>
          </Pressable>
        </View>

        {snapshotImage ? (
          <View style={styles.previewWrap}>
            <Text style={styles.sectionLabel}>Preview</Text>
            <Canvas style={styles.previewCanvas}>
              <Image
                image={snapshotImage}
                x={0}
                y={0}
                width={PREVIEW_W}
                height={PREVIEW_H}
                fit="contain"
              />
            </Canvas>
          </View>
        ) : null}

        <Text style={styles.sectionTitle}>Paths</Text>
        <View style={styles.rowWrap}>
          <Pressable style={styles.actionBtn} onPress={sharePaths}>
            <Text style={styles.actionBtnText}>Share JSON</Text>
          </Pressable>
          <Pressable style={styles.actionBtn} onPress={restoreDemo}>
            <Text style={styles.actionBtnText}>Restore demo</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const PREVIEW_W = 280;
const PREVIEW_H = 160;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#f8fafc',
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#94a3b8',
  },
  metricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  metricChip: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  metricLabel: {
    fontSize: 11,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#e2e8f0',
    fontVariant: ['tabular-nums'],
  },
  canvasShell: {
    height: 280,
    marginHorizontal: 12,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#020617',
  },
  canvasInner: {
    flex: 1,
  },
  canvas: {
    flex: 1,
  },
  scroll: {
    flex: 1,
    marginTop: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 4,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 13,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  sectionLabel: {
    marginTop: 8,
    marginBottom: 6,
    fontSize: 13,
    color: '#cbd5e1',
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    alignItems: 'center',
  },
  swatch: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  swatchActive: {
    borderColor: '#38bdf8',
  },
  swatchPressed: {
    opacity: 0.85,
  },
  widthChip: {
    minWidth: 44,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  widthChipActive: {
    borderColor: '#38bdf8',
    backgroundColor: '#172554',
  },
  widthChipPressed: {
    opacity: 0.9,
  },
  widthChipText: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    color: '#94a3b8',
  },
  widthChipTextActive: {
    color: '#f8fafc',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingVertical: 4,
  },
  switchLabel: {
    fontSize: 15,
    color: '#e2e8f0',
  },
  bgSwatch: {
    width: 48,
    height: 36,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  bgSwatchActive: {
    borderColor: '#38bdf8',
  },
  bgSwatchPressed: {
    opacity: 0.9,
  },
  zoomChip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  zoomChipActive: {
    borderColor: '#38bdf8',
    backgroundColor: '#172554',
  },
  zoomChipPressed: {
    opacity: 0.9,
  },
  zoomChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
  },
  zoomChipTextActive: {
    color: '#f8fafc',
  },
  actionBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#1d4ed8',
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f8fafc',
  },
  previewWrap: {
    marginTop: 12,
  },
  previewCanvas: {
    width: PREVIEW_W,
    height: PREVIEW_H,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1e293b',
    alignSelf: 'center',
  },
});
