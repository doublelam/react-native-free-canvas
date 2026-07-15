---
name: publish
description: >-
  Builds react-native-free-canvas, bumps package.json version, commits and
  pushes to the git remote, then publishes to npm. Use when the user asks to
  publish, release, or ship a new npm version.
---

# Publish (react-native-free-canvas)

Release workflow for the library root package (`react-native-free-canvas`).

## When to apply

- User asks to **publish**, **release**, **ship**, or **npm publish**.
- Do **not** run this for expo-example-only changes.

## Prerequisites (stop if unmet)

- Working tree should only contain intentional release changes (or be clean after build + version bump).
- Logged into npm: `npm whoami` must succeed (run `npm login` if not).
- On the intended branch with a configured remote (`git remote -v`, usually `origin`).
- Package manager: **Yarn 1** at repo root; publish with **npm**.

## Workflow

Copy and track:

```
Publish Progress:
- [ ] 1. Build
- [ ] 2. Bump version
- [ ] 3. Commit and push
- [ ] 4. Publish to npm
```

### 1. Build

From repo root:

```bash
yarn build
```

Must exit 0. If it fails, fix and re-run; do not bump or publish.

Optionally (recommended when `src/` changed):

```bash
yarn eslint src --max-warnings 0
npx tsc --noEmit -p tsconfig.json
```

### 2. Change the version number

Read current `version` from root `package.json`.

**Choose the next version:**

- If the user already specified a bump (`patch` / `minor` / `major`) or exact version (`2.1.0`), use that.
- Otherwise **ask** before changing anything: patch, minor, major, or an exact semver.

Bump with npm (updates `package.json` only; do not use `--git-tag-version` here — commit is step 3):

```bash
npm version <patch|minor|major|x.y.z> --no-git-tag-version
```

Confirm `package.json` `"version"` matches the intended release.

### 3. Commit and push to git remote

1. Stage release artifacts that belong in the release:
   - `package.json` (version)
   - `lib/` if `yarn build` changed it
   - any other intentional files the user included in this release
2. Commit with Conventional Commits (see `.cursor/skills/commit/SKILL.md`):

   ```
   chore(publish): release vX.Y.Z
   ```

3. Create an annotated tag:

   ```bash
   git tag -a "vX.Y.Z" -m "vX.Y.Z"
   ```

4. Push branch and tag:

   ```bash
   git push -u origin HEAD
   git push origin "vX.Y.Z"
   ```

Do **not** force-push. If push fails (auth/network), stop before npm publish.

### 4. Publish to npm

From repo root:

```bash
npm publish
```

- Default access for this public package; do not pass `--access restricted` unless the user asks.
- If the version already exists on npm, stop and report; do not bump again without asking.
- On success, report: published version, npm package URL, and git tag.

## What not to do

- Do not publish without a successful `yarn build`.
- Do not skip the version bump or reuse a version already on npm.
- Do not commit secrets, `.env`, `.pack/` tarballs, or `node_modules`.
- Do not amend or force-push unless the user explicitly asks.
- Do not publish from a dirty tree of unrelated WIP unless the user confirms those files are part of the release.
