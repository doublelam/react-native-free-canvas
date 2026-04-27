---
name: commit
description: >-
  Prepares Conventional Commit messages, verifies scope, and commits changes in
  react-native-free-canvas. Use when the user asks to commit, save work, or
  finalize a change set before push or PR.
---

# Commit (react-native-free-canvas)

## When to apply

- User asks to **commit**, **stage**, or **write a commit message**.
- Wrapping up a feature/fix before **push** or **PR**.

## Workflow

1. **Inspect**
   - Run `git status -sb` and `git diff` (and `git diff --staged` if anything is already staged).
   - Confirm only intentional paths are included (no secrets, `.env`, local `.pack/` tarballs, or accidental `node_modules` edits).

2. **Verify (when library source or build output changed)**
   - If `src/` changed: from repo root run `yarn build`, `yarn eslint src --max-warnings 0`, and `npx tsc --noEmit -p tsconfig.json`.
   - If only docs, `.npmignore`, `.cursor/`, or metadata changed, skip the full build unless the user asks.

3. **Stage**
   - `git add` only the paths that belong in this commit. Prefer **one logical commit** per request; split if the diff mixes unrelated concerns.

4. **Message format (Conventional Commits)**

   ```
   type(scope): imperative subject under ~72 characters

   Optional body: what changed and why; breaking changes noted here.
   ```

   **Types** (common in this repo): `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `build`, `ci`, `revert`.

   **Scopes** (examples): `publish`, `deps`, `expo-example`, `canvas`, `eslint`, `cursor`, `bob`.

   - Subject: **imperative**, no trailing period, no vague “update” without context.
   - **Breaking changes**: add `!` after scope/type or a `BREAKING CHANGE:` footer.

5. **Commit**
   - `git commit -m "type(scope): subject"` or use `-m` twice for subject + body.
   - Do not amend or force-push unless the user explicitly asks.

## What not to do

- Do not commit generated `lib/` unless it is the deliberate outcome of `yarn build` for a release (this repo normally commits `lib/` when `src/` changes; follow existing practice on the branch).
- Do not bundle unrelated refactors with a focused fix in one commit without user approval.
