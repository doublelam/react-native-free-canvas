---
description: >-
  Upgrade Yarn deps (root + expo-example) aggressively to latest compatible
  versions (majors OK), fix peers and native stack, verify build/lint, sync
  README and docs
---

# upgrade-dependencies

Run **`.cursor/skills/upgrade-dependencies/SKILL.md`**.

**Strategy:** prefer **latest** versions **including majors** (e.g. `2.3.4` → `3.x`), not only minor bumps—then fix **peer/native conflicts** (Reanimated + worklets, Expo SDK matrix, Skia, `bob` types paths). Use **`yarn upgrade-interactive --latest`** and **`npx expo install --fix`** after Expo SDK changes. Finish with **`yarn build`**, ESLint, **`tsc`**, **`expo-doctor`**, and updates to **README.md** (install peers) and **docs/PROJECT_OVERVIEW.md** (versions + scripts).
