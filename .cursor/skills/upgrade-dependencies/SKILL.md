---
name: upgrade-dependencies
description: >-
  Upgrades Yarn dependencies for the library root and expo-example, resolves
  version skew (Skia / Reanimated / Worklets / RN / Expo), verifies build and
  lint, and updates README and docs/PROJECT_OVERVIEW.md. Use when bumping
  packages, fixing peer conflicts, after Expo SDK upgrades, or when the user
  asks to upgrade or align dependencies.
---

# Upgrade dependencies (react-native-free-canvas)

## Upgrade strategy: **aggressive (latest first)**

Default to **latest stable** versions, **including majors** (e.g. `2.3.4` → `3.1.0`, not `2.5.0`), unless something in the stack forbids it.

- **Goal:** maximize freshness in one pass; avoid timid “minor-only” bumps when a newer major is compatible.
- **Constraint:** after each wave of bumps, the tree must have **no unresolved peer dependency errors** and **no broken native stack** (rules below). Fix conflicts by adjusting pins or upgrading the whole related group (e.g. Expo SDK + RN together), not by indefinitely staying on old majors “to be safe.”
- **Expo example caveat:** packages **managed by Expo** for a given SDK (RN, Skia, Reanimated, worklets, gesture-handler, etc.) must stay **compatible with that SDK** until you **upgrade the Expo SDK** (then go aggressive on the new SDK’s matrix). For everything else (navigation, dev tools, non-Expo-pinned libs), prefer **latest** like the root.
- **Library root:** devDependencies may sit **newer** than the example (e.g. newer RN / Skia for `bob` + types) as long as **`yarn build`**, **`eslint`**, and **`tsc`** pass and peer rules are satisfied.

## Scope

Two workspaces (run commands from **repo root** unless noted):

| Workspace | Path | Role |
|-----------|------|------|
| Library | `.` | `devDependencies` pin what `bob build` and ESLint typecheck against |
| Example | `expo-example/` | Expo app; native deps must match **Expo SDK** until SDK is upgraded |

Package manager: **Yarn 1** (`packageManager` in root `package.json`).

## Workflow (agent checklist)

1. **Inventory**
   - Read root `package.json` (`devDependencies`, `peerDependencies`, `dependencies`, `scripts`).
   - Read `expo-example/package.json` (`dependencies`, `devDependencies`).
   - Note: library source imports **`react-native-worklets`** (`scheduleOnRN` in `src/drawing-canvas.tsx`); consumers need a compatible **worklets** version with **Reanimated**.

2. **Choose upgrade target (aggressive)**
   - Run **`yarn outdated`** (root and `expo-example/`) and **`npm view <pkg> version`** / release notes when a major jump is risky.
   - **Expo example:** either (a) bump **`expo`** to the **latest SDK** you want, then run **`npx expo install --fix`** so native modules align to that SDK in one shot, or (b) stay on the current SDK but still take **latest patch/minor** Expo allows for pinned modules. Do not leave the app on an old SDK only to avoid editing `package.json`—upgrade SDK when the goal is “latest everywhere” and conflicts are resolved.
   - **Library root:** bump **direct** devDependencies to **latest** (majors OK): ESLint, TypeScript, Prettier, `@typescript-eslint/*`, Skia, Reanimated, Gesture Handler, RN, React, `react-native-builder-bob`, etc., subject only to **peer/native** rules below.
   - After **`react-native-builder-bob`** majors, re-check **`package.json`** `exports` / `types` paths against actual **`lib/typescript/**`** layout from `yarn build`.

3. **Conflict rules (no broken native stack)**

   These override “always latest”: if peers clash, **fix the set** (upgrade/downgrade together) until installs are clean.

   - **Reanimated** ↔ **react-native-worklets:** follow **`peerDependencies`** on the chosen Reanimated version (pair must match; never bump one alone).
   - **@shopify/react-native-skia:** JS version must match native; in the example, follow **`expo install`** for SDK-validated pins unless you also change SDK/native setup.
   - **react-native-gesture-handler:** compatible with RN + Reanimated per upstream.
   - **Do not** change native deps in `expo-example` without **`yarn install`** there and **`npx expo start --clear`** when natives change.

4. **Apply upgrades (prefer latest, including majors)**

   ```bash
   # Root — see everything; then bump aggressively
   yarn outdated
   # Interactive: select latest (including red/major) where rules allow
   yarn upgrade-interactive --latest
   # Or direct latest for specific packages:
   # yarn add -D some-package@latest other-package@latest
   yarn install

   # Example — same idea; use expo install after expo version changes
   cd expo-example && yarn outdated
   yarn upgrade-interactive --latest   # for non-Expo-pinned deps
   # When changing Expo SDK or core RN/Reanimated/Skia/worklets:
   npx expo install expo@latest          # or expo@~<sdk>.0 then:
   npx expo install --fix
   yarn install
   cd ..
   ```

   Resolve **peer dependency errors** (not mere warnings): adjust **`peerDependencies`** on the library root and/or example pins until **`yarn install`** exits successfully.

5. **Verify (must pass before committing)**

   ```bash
   yarn install
   yarn build
   yarn eslint src --max-warnings 0
   npx tsc --noEmit -p tsconfig.json

   cd expo-example && yarn install && npx eslint app --max-warnings 0
   cd ..
   ```

   Run **`npx expo-doctor`** from `expo-example/` after Expo or native bumps.

6. **Update documents** (whenever versions or install story change)

   | File | What to sync |
   |------|----------------|
   | `README.md` | **Install** code block: list every root **`peerDependency`** with correct lower bounds (include `react-native-worklets` if the library imports it). |
   | `docs/PROJECT_OVERVIEW.md` | **Tech stack** table and **Version notes**: reflect pinned majors (RN, Expo SDK, Skia, Reanimated, worklets). **Scripts and workflows**: must match **root** `package.json` `scripts` (do not document scripts that do not exist). |
   | `.cursor/skills/run-expo-example/SKILL.md` | If root scripts for packing/syncing the example change, update that skill’s command list. |

7. **Regenerate `lib/`** after `src/` or build config changes

   ```bash
   yarn build
   ```

   Do not hand-edit `lib/`.

## Common fixes

- **Duplicate native modules / wrong Reanimated instance**: example must not symlink monorepo root for the library in a way that pulls a second `node_modules` tree for Skia/Reanimated (see `run-expo-example` skill if using tarball workflow).
- **`scheduleOnRN` / worklets**: ensure `react-native-worklets` is a **dependency** (not only devDependency) of any app that imports it directly from JS (e.g. `expo-example` if it uses `scheduleOnRN`).
- **`bob` / TypeScript emit layout** changed on builder major: update root **`package.json`** `types` and **`exports`**.**`types`** to match **`lib/typescript/**`**; add **`exclude`** entries in **`tsconfig.json`** if stray roots (e.g. `eslint.config.js`, `scripts/`) get pulled into declaration emit.
- **Yarn resolutions**: only add `resolutions` in root or example as a last resort; prefer aligning direct dependencies.

## What not to do

- Do not bump only one of **Reanimated** / **worklets** without checking compatibility.
- Do not commit secrets or local `.pack/` tarballs if policy forbids it.
- Do not edit `lib/` manually.
