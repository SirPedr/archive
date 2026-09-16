---
name: conventional-commit
description: Create safe, focused Git commits using Conventional Commits 1.0.0. Load this skill every time a commit is about to be created—whether the user explicitly asks to commit, another workflow commits automatically, or committing is the final step of a larger task. Do not run `git commit` without using this skill first.
compatibility: Requires Git.
metadata:
  version: "1.0"
---

# Conventional Commit

Use this workflow immediately before every commit in this project. Its purpose is to keep each commit focused, accurately described, and compatible with Conventional Commits 1.0.0.

## Workflow

1. Inspect the working tree and staged changes. Read the actual diff; do not infer the commit from the conversation alone.
2. Identify the single intent represented by the changes. If unrelated changes are mixed together, separate them into focused commits when safe. Never include unrelated user work.
3. Stage only the files or hunks belonging to that intent. Preserve files already staged by the user. If the index contains unrelated staged changes, do not unstage or include them; stop before committing and report the staging conflict unless the user explicitly authorizes restaging.
4. Choose the message from the observable change:
   - `feat`: adds user-visible or API-visible capability.
   - `fix`: corrects faulty behavior.
   - `docs`: changes documentation only.
   - `test`: adds or corrects tests only.
   - `refactor`: restructures code without changing behavior.
   - `perf`: improves performance without changing behavior.
   - `build`: changes build tooling or dependencies.
   - `ci`: changes continuous-integration configuration.
   - `style`: changes formatting without changing behavior.
   - `chore`: maintenance that fits none of the types above.
   - `revert`: reverts an earlier commit.
5. Add a short noun scope only when it clarifies the affected subsystem. Omit vague scopes such as `app`, `code`, or `misc`.
6. Write the subject in this form:

   ```text
   <type>[optional scope][optional !]: <description>
   ```

   Use lowercase for the type and scope. Make the description imperative, specific, and concise; do not end it with a period.
7. Add a body only when the motivation, tradeoff, or non-obvious behavior cannot fit in the subject. Separate it from the subject with one blank line.
8. Mark breaking changes with `!` before the colon, a `BREAKING CHANGE: <description>` footer, or both. The footer must explain what broke and what consumers must change.
9. Add issue references or other trailers as footers after a blank line when they are relevant.
10. Commit once with the resulting message. Never amend, force, bypass hooks, or sign on the user's behalf unless explicitly requested.
11. Report the commit hash and subject after Git confirms success. If the commit fails, report the exact cause and leave the working tree intact.

## Message examples

```text
feat(chat): support multiple rule systems
```

```text
fix(upload): reject unsupported document formats
```

```text
feat(api)!: require authenticated document uploads

BREAKING CHANGE: upload clients must now send a valid bearer token.
```

## Guardrails

- Base the type and scope on the diff, not the task label or branch name.
- A commit must describe everything it includes and include only what it describes.
- Do not use `feat` for internal cleanup or `fix` for speculative hardening without a demonstrated bug.
- Do not commit secrets, generated credentials, local environment files, or unrelated artifacts.
- Do not create an empty commit unless the user explicitly requests one.
- If hooks modify files, inspect those modifications before making any follow-up commit.
