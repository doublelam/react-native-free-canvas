---
name: run-expo-example
description: >-
  Test react-native-free-canvas via the Expo example: sync packed tarball then
  start Metro. Use when verifying consumer install behavior or after library changes.
---

# Run Expo example (test the library)

## Why not `file:..`?

Symlinking the repo root (`file:..`) makes Metro resolve **Reanimated / Skia** from the **library’s** `node_modules`, which duplicates native modules vs Expo Go. The example uses **`file:../.pack/react-native-free-canvas.tgz`** instead (same as a real **`npm install`**).

## Commands (repository root)

```bash
yarn example:sync    # yarn build + npm pack → .pack/react-native-free-canvas.tgz + yarn install in expo-example
yarn test:expo       # sync + EXPO_OFFLINE=1 + expo start
yarn expo:start      # start only (sync first if you changed the library)
```

`.pack/` is gitignored. Run **`yarn example:sync`** after clone or whenever `src/` / `lib/` changes.

## Outside this repo (simplest mental model)

From the library root: `yarn build && npm pack`, then in **any** Expo app: `yarn add file:/path/to/react-native-free-canvas-<version>.tgz`. No monorepo, no `expo-example` folder required.

## Notes

- Expo must be started from **`expo-example/`** (`yarn --cwd expo-example start` or root `yarn expo:start`).
- If Expo Go / simulator issues: see README (`EXPO_OFFLINE`, online start, Expo Go install).
- After Babel or dependency changes: `npx expo start --clear` from `expo-example/`.
