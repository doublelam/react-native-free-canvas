# react-native-free-canvas — project overview

## Summary

**react-native-free-canvas** is a React Native library (v2) for freehand drawing on a Skia canvas. It layers two Skia canvases (live stroke vs committed paths), uses Reanimated shared values for zoom/pan, and exposes an imperative ref API (undo, reset, snapshots, paths). Published output is built with **react-native-builder-bob** into `lib/` (CommonJS, ES modules, and TypeScript declarations).

## Tech stack

| Area | Choice |
|------|--------|
| UI / canvas | [@shopify/react-native-skia](https://github.com/Shopify/react-native-skia) (`Canvas`, `Path`, `Rect`, snapshots) |
| Gestures | [react-native-gesture-handler](https://docs.swmansion.com/react-native-gesture-handler/) (`Gesture.Pan`, `Gesture.Pinch`, `GestureDetector`) |
| Animation / UI thread | [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/) (`useSharedValue`, `useDerivedValue`, `useAnimatedStyle`, `useAnimatedReaction`, `withTiming`) |
| RN ↔ UI scheduling | [react-native-worklets](https://github.com/software-mansion/react-native-worklets) (`scheduleOnRN`) |
| Async path completion | [promises-delivery](https://www.npmjs.com/package/promises-delivery) (coordinate “path drawn” with layer commit) |
| Language | TypeScript (extends `@react-native/typescript-config`) |
| Lint / format | ESLint 9 flat config + Prettier (via `eslint-plugin-prettier`) |
| Build | `react-native-builder-bob` → `bob build` |
| Package manager | Yarn 1 (`packageManager` field) |

**Peer dependencies** (consumers must install): Skia ≥2, React ≥18, RN ≥0.72, gesture-handler ≥2, reanimated ≥3.

**Example app** (`expo-example/`): Expo ~54, Expo Router, depends on a **packed tarball** at **`file:../.pack/react-native-free-canvas.tgz`** (produced by **`yarn example:sync`** at the repo root) so installs match **`npm install`** without Metro monorepo hacks. See README “Develop and test”.

## Repository layout

| Path | Role |
|------|------|
| `src/` | Library source (the editable codebase) |
| `lib/` | Generated publish artifacts (do not hand-edit; regenerate with `yarn build`) |
| `expo-example/` | Demo app consuming **`.pack/react-native-free-canvas.tgz`** (see `yarn example:sync`) |
| `eslint.config.js` | ESLint flat config |
| `tsconfig.json` | TS config + path aliases `@root/*`, `@src/*` |
| `package.json` | `exports` map for ESM/CJS + types |

## Architecture (high level)

1. **`FreeCanvas`** (`src/index.tsx`): Root component wrapped in `GestureHandlerRootView`, `CanvasContext.Provider`, and `Animated.View` with transform order documented in the README (translate → scale, `transformOrigin`).
2. **`DrawingCanvas`**: Top absolute layer; captures pan/pinch; maintains a Skia path in a shared value; on finalize, registers completion via `promises-delivery` and pushes a `DrawnPath` into context.
3. **`DrawnCanvas`**: Bottom layer; renders background, committed `Path`s from React state, and resolves the delivery when the new path appears so the live path can clear.
4. **`CanvasContext`**: Holds drawn path list, drawing preview state, zoom/pan worklets (`setScale`, `setTranslate`, `finalize`), and `pathCompleteDelivery`.

Performance-related choices: `memo` on exported components, `useMemo` / `useCallback` for stable gesture configs and context value where dependencies allow, README guidance to avoid inline `style={{ flex: 1 }}` objects to reduce re-renders.

## Code style (enforced and conventional)

### ESLint + Prettier (`eslint.config.js`)

- **Prettier** (errors as ESLint): `singleQuote: true`, `trailingComma: 'all'`, `arrowParens: 'avoid'`, `endOfLine: 'auto'`.
- **Line length**: `max-len` 140 (strings/URLs ignored).
- **React**: JSX only in `.ts`/`.tsx`; `prop-types` and `display-name` off; flexible function component forms; `jsx-props-no-spreading` off.
- **TypeScript**: `@typescript-eslint/recommended`; `no-shadow` off in favor of `@typescript-eslint/no-shadow`; explicit return types not required.
- **Hooks**: `react-hooks/exhaustive-deps` off (typical for animation-heavy code where deps are intentional).
- **React Native**: `react-native/no-inline-styles` off (Skia `Canvas` still uses some inline layout where needed).

### TypeScript patterns

- **`import type`** for type-only imports from Skia, RN, Reanimated (see `types.ts`).
- **Component pattern**: `forwardRef` + `memo` for canvas components; default export of the main canvas.
- **Worklets**: `'worklet'` directive in callbacks that run on the UI thread; `getSharedValue` helper in `utils.ts` for `T | SharedValue<T>`.

### File naming

- `*.tsx` for components with JSX; `*.ts` for context, types, utilities, styles.

### Styling

- Shared `StyleSheet.create` in `styles.ts` (`flex1`, `canvas` absolute fill, etc.).

## Scripts and workflows

- **Build library**: `yarn build` (runs `bob build`).
- **Try locally (consumer-style)**: from repo root run **`yarn example:sync`**, then **`yarn test:expo`** or `yarn expo:start`. See README for the tarball workflow or for using a separate Expo app + `npm pack` outside this repo.

## Version notes

The root `package.json` pins RN 0.82 / Reanimated 4.x / Skia 2.3.x for library development; `expo-example` uses Expo SDK–aligned versions (e.g. RN 0.81, Skia 2.2) and loads the library from the **packed tarball** under `.pack/`.

## Further reading

- Root `README.md`: API table, transform order, peer installs, `CornerPathEffect` example.
