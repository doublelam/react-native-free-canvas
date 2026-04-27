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

**Peer dependencies** (consumers must install): Skia ≥2, React ≥18, RN ≥0.72, gesture-handler ≥2, reanimated ≥3, **worklets ≥0.5** (see root `package.json` `peerDependencies`).

**Example app** (`expo-example/`): Expo Router app; depends on **`react-native-free-canvas`** via **`file:../src`** (see `expo-example/package.json`). Use **`yarn --cwd expo-example install`** after changing library or example dependencies; clear Metro cache after native bumps (`npx expo start --clear`).

## Repository layout

| Path | Role |
|------|------|
| `src/` | Library source (the editable codebase) |
| `lib/` | Generated publish artifacts (do not hand-edit; regenerate with `yarn build`) |
| `expo-example/` | Demo app consuming **`react-native-free-canvas`** via **`file:../src`** (see `run-expo-example` skill) |
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

- **Build library** (repo root): `yarn build` (runs `bob build`).
- **Example app**: `yarn --cwd expo-example install`, then `yarn --cwd expo-example start` (or `cd expo-example && npx expo start`). After native dependency changes, use `npx expo start --clear`.
- **Upgrading dependencies**: follow **`.cursor/skills/upgrade-dependencies/SKILL.md`** so root + `expo-example` stay aligned and README / this doc stay in sync.

## Version notes

The root `package.json` **devDependencies** pin the library dev stack for CI and `bob build` (currently **RN 0.85.x**, **Reanimated 4.3.x**, **worklets 0.8.x**, **Skia 2.6.x**, **gesture-handler 2.31.x** — see that file for exact pins). **`expo-example`** tracks **Expo SDK 55** (`expo` ~55.0.x, **RN 0.83.x**, **Skia 2.4.x** per `expo install`, **Reanimated ~4.2** / **worklets 0.7.x**). The example follows Expo’s pinned matrix; the root is often **one RN minor ahead** for typecheck and `bob` while keeping **Reanimated + worklets** internally consistent per their peers. Re-run **`yarn install`** in both roots after any bump; use **`npx expo start --clear`** after native changes. **Expo SDK 55** expects a current **Xcode** toolchain for local iOS prebuilds (see `npx expo-doctor` / [Expo–Xcode compatibility](https://expo.fyi/expo-sdk-xcode-compatibility)); Expo Go or EAS builds may still work on older hosts.

## Further reading

- Root `README.md`: API table, transform order, peer installs, `CornerPathEffect` example.
