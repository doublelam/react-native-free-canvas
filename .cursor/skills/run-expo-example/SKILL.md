---
name: run-expo-example
description: >-
  Run the Expo example app that consumes react-native-free-canvas from ../src.
  Use when manually testing the library UI, after dependency upgrades, or when
  verifying the example still starts with Metro.
---

# Run Expo example (test the library)

## How the example depends on the library

`expo-example/package.json` uses **`"react-native-free-canvas": "../src"`** so Metro bundles **library source** from the repo. Run **`yarn build`** at the repo root when you need **`lib/`** artifacts (publish or type consumers); the example does not require the tarball for day-to-day UI work.

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
