---
name: publish-npm
description: >-
  Publishes react-native-free-canvas to npm: build with bob, verify tarball,
  version bump, and npm publish. Use when the user asks to publish, release to
  npm, ship a version, or deploy the package.
---

# Publish to npm (react-native-free-canvas)

## When to apply

- User asks to **publish**, **release**, **ship to npm**, or **deploy the package**.
- After merging release prep (version, changelog, docs) and needing the actual registry upload.

## Prerequisites (human)

1. **npm account** with publish rights to the package name in root `package.json` (`name` field). If you forked the repo, change `name` to a scoped package you own, or get maintainer access from the owner.
2. **Login**: `npm login` (browser/device flow) or a CI **automation token** in `~/.npmrc` / `NPM_TOKEN`. Enable **2FA** on npm; publishing often requires **OTP** unless using a granular token with publish permission.
3. **Do not edit `lib/` by hand** — run `yarn build` after `src/` changes (see workspace rules).

## Pre-publish checklist

- [ ] `git status` clean on the branch you intend to tag from (or commit version bump first).
- [ ] `yarn install` at repo root.
- [ ] `yarn build` — regenerates `lib/` via react-native-builder-bob.
- [ ] `yarn eslint src --max-warnings 0` and `npx tsc --noEmit -p tsconfig.json` when `src/` changed.
- [ ] `package.json` **version** reflects the release you want (see Version bump below).

## What gets published

- `package.json` **`files`** lists `lib` and `src`; **`.npmignore`** prunes dev junk and excludes `expo-example/`, `docs/`, lockfiles, etc. Sanity-check with pack (next step).

## Verify tarball (recommended)

From repo root:

```bash
npm pack --dry-run
```

Or inspect the tarball:

```bash
npm pack
tar -tzf react-native-free-canvas-*.tgz | head -50
rm react-native-free-canvas-*.tgz
```

Confirm `lib/` entry points exist and no secrets or unwanted paths appear.

## Version bump

Pick one:

- **npm (creates git commit + tag)** — from a clean tree:  
  `npm version patch` | `npm version minor` | `npm version major`  
  Use `--no-git-tag-version` only if you will tag manually.
- **Manual** — edit `package.json` `version`, commit, then tag `vX.Y.Z` to match.

## Publish

From **repository root** (where `package.json` lives):

```bash
npm publish
```

- **First publish** of a new name: `npm publish --access public` only applies to **scoped** packages (`@scope/name`). This package is **unscoped**; default is public.
- **OTP (2FA)**: if npm prompts, run with one-time password: `npm publish --otp=123456`.
- **Dry run** (no upload): `npm publish --dry-run`.

After success: `git push` and `git push --tags` if you used `npm version` or created tags locally.

## Post-publish

- Confirm on [https://www.npmjs.com/package/react-native-free-canvas](https://www.npmjs.com/package/react-native-free-canvas) (or your published `name`).
- Optional: GitHub **Release** from the tag with notes.

## Troubleshooting

| Issue | What to do |
|-------|------------|
| `403` / not authorized | Confirm logged-in user (`npm whoami`) has publish rights; check org/package permissions. |
| `409` / version exists | Bump `version` in `package.json` (never republish the same version). |
| Wrong files in tarball | Adjust `package.json` `files` and `.npmignore`; re-run `npm pack --dry-run`. |
| Consumers get stale JS | Ensure `yarn build` ran; `main`/`exports` point at `lib/`. |

## What not to do

- Do not publish without a fresh **`yarn build`** if `src/` changed since last build.
- Do not commit secrets; `.npmrc` with tokens should stay local or CI-only, not in the repo.
