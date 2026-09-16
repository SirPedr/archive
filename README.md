# Archive

Archive is a private, source-grounded tabletop rules assistant for dungeon masters and players. Users organize uploaded text-based PDF and Markdown rulebooks into named systems and editions, enable one or more systems in a persistent chat, and ask rules questions conversationally.

Archive answers only from enabled uploads, separates rules-as-written evidence from reasoning, verifies quotations against extracted source text, cites the best available chapter, section, or page location, supports multilingual questions and cross-system comparisons, and lets users publish selected cited answers as anonymous read-only links.

## Project status

Archive is planning an invite-only minimum viable product (MVP). See the [target architecture](docs/ARCHITECTURE.md), the [MVP Alpha milestone](https://github.com/SirPedr/archive/milestone/1), and the [GitHub Project](https://github.com/users/SirPedr/projects/5) for scope and delivery status.

## Local development

Use Node.js `24.21.0`. Enable the Corepack distributed with Node, then install
the committed dependency graph:

```sh
corepack enable
pnpm install --frozen-lockfile
```

The main commands are:

| Command | Contract |
| --- | --- |
| `pnpm dev` | Run vinext development with local values and no Cloudflare credentials. |
| `pnpm build` | Produce the vinext Worker bundle. |
| `pnpm start:local` | Build once, then serve `dist/server/wrangler.json` under local workerd. |
| `pnpm types:generate` | Regenerate `worker-configuration.d.ts` from `wrangler.jsonc`. |
| `pnpm types:check` | Fail when generated Worker types are stale. |
| `pnpm typecheck` | Run strict TypeScript checking. |
| `pnpm lint` | Run native, type-aware, architecture, and StyleX lint checks. |
| `pnpm format` | Write repository formatting. |
| `pnpm format:check` | Verify repository formatting without changing files. |
| `pnpm test:ui` | Run the jsdom React behavior project. |
| `pnpm test:worker` | Build and run liveness behavior inside workerd. |
| `pnpm test` | Build and run both exclusive Vitest projects. |
| `pnpm quality` | Run the complete credential-free local quality gate. |

## Production release

`archive-production` is the only remote Worker. Candidate versions receive no
production traffic until they pass preview validation. Never run `wrangler
delete` for candidate cleanup: uploaded versions and versioned preview URLs are
retained Cloudflare deployment history.

1. Run `pnpm quality`, then `pnpm start:local` and verify `/` plus
   `/api/health`.
2. Record the current production version with `pnpm release:status`.
3. For the first release only, create the named Worker with
   `pnpm release:bootstrap`.
4. Upload without traffic using an opaque tag:
   `pnpm release:candidate -- <candidate-tag>`.
5. Capture the uploaded version ID and versioned preview URL. Verify the shell,
   compiled styling, and exact `{"status":"ok"}` liveness response.
6. Promote that exact artifact:
   `pnpm release:promote -- <candidate-version-id>`.
7. If production smoke checks fail, restore the recorded version with
   `pnpm release:rollback -- <previous-version-id>`.

Rollback is limited to Cloudflare's 100 most recent published versions. It
changes Worker code traffic only; it does not revert bindings, resource data,
or future database migrations.
