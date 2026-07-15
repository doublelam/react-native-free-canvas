---
name: run-expo-example
description: >-
  Run the Expo example app that consumes react-native-free-canvas from ../src.
  Use when manually testing the library UI, after dependency upgrades, or when
  verifying the example still starts with Metro.
---

# Run Expo example (test the library)

## How the example depends on the library

`expo-example/package.json` uses **`"react-native-free-canvas": "link:../src"`** so `node_modules/react-native-free-canvas` is a **symlink to `src/`** (live edits; not a Yarn copy). Do **not** use `link:..` — that exposes the whole monorepo (nested `expo-example` + library `node_modules`) and breaks Metro with duplicate React/Skia.

`expo-example/metro.config.js` watches **`../src` only**, forces resolution to `src/index.tsx`, and pins peer deps to the example’s `node_modules`. After changing Metro config, restart with **`npx expo start --clear`**.

The demo header shows **`react-native-free-canvas vX.Y.Z · <sha>[*] (src)`** from `generated/library-build-info.ts` (created by `yarn generate:library-build-info` on install/start). `*` means a dirty git working tree.

**Caveat:** If Metro ever resolves duplicate native copies of Skia/Reanimated, prefer a **packed install** (`npm pack` + `file:../.pack/…tgz`) for a consumer-faithful test (see **upgrade-dependencies** skill).

## Commands

**One command from repo root (install + start):**

```bash
yarn demo
```

**Platform shortcuts:**

```bash
yarn demo:ios
yarn demo:android
```

**Manual (same as `yarn demo` without the single alias):**

```bash
yarn --cwd expo-example install && yarn --cwd expo-example start
```

After **native** or **Babel** dependency changes:

```bash
cd expo-example && npx expo start --clear
```

## Verify library build (optional)

From repo root:

```bash
yarn build
yarn eslint src --max-warnings 0
```

## Outside this repo

From the library root: `yarn build && npm pack`, then in any app: `yarn add file:/absolute/path/to/react-native-free-canvas-<version>.tgz`.
