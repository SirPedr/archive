## Context

See `proposal.md` for motivation. The repository currently contains architecture
and OpenSpec planning material but no runtime, package manifest, application
source, tests, or Cloudflare configuration.
[Issue #8](https://github.com/SirPedr/archive/issues/8) is the dependency root
for resource provisioning, schema, observability, model evaluation, security
boundaries, and authentication.

Cloudflare recommends vinext for new Next.js-on-Workers applications, but labels
it beta and instructs adopters to evaluate compatibility. Its current
compatibility dashboard reports broad Next.js coverage, and its primary
deployment target is Cloudflare Workers. StyleX officially supports Vite React
Server Components through `@stylexjs/unplugin`. Cloudflare's current test
integration is `@cloudflare/vitest-plugin`, while DOM component tests require a
separate Vitest execution environment.

The confirmed environment decision supersedes the standing-staging language in
`docs/ARCHITECTURE.md`: local and production are the only persistent
environments. Remote candidate previews provide the validation boundary but are
not a third environment. Uploaded Worker versions remain in Cloudflare's
platform-managed history; only disposable external resources and replaceable
aliases are cleanup targets.

## Goals / Non-Goals

**Goals:**

- Make the first application build, run, test, and type-check deterministically
  from a clean checkout.
- Prove vinext, Next.js App Router, StyleX RSC compilation, Workers deployment,
  generated bindings, and the selected lint bridge on the actual local and
  production paths.
- Give later issues stable runtime, styling, test, command, health, and release
  conventions.
- Keep production promotion reversible and prevent failed candidates from
  changing live traffic.

**Non-Goals:**

- No Clerk integration, internal user resolution, domain persistence, Cloudflare
  data-product bindings, ingestion, retrieval, model calls, streaming answers,
  quotas, operator tools, or public answer pages.
- No persistent staging environment and no CI deployment automation; issue #9
  adds resource provisioning and automation while preserving the release
  contract.
- No AI SDK dependency or placeholder AI route. Next.js compatibility preserves
  that option for model-dependent issues without preselecting their runtime
  contracts.
- No marketing page or disabled controls that imitate later product
  capabilities.

## Decisions

### Commit to Next.js 16 App Router on vinext

Scaffold a Next.js 16 App Router application and use vinext for development,
production build, local production execution, candidate preview, and Workers
deployment. Set the Worker `compatibility_date` to `2026-09-16`. Do not add
`nodejs_compat` or `nodejs_compat_v2`: Cloudflare enables both behaviors by date
for new configurations on or after `2026-08-04`, and documents the explicit
flags as redundant. Access future bindings through the Workers runtime rather
than Node-only process globals.

The implementation must run vinext's compatibility check and prove a production
build, local server render, Worker-runtime liveness request, StyleX output, and
live deployment. Local production proof means building with vinext and running
`wrangler dev --local --config dist/server/wrangler.json`; `vinext start` is a
Node server and does not prove workerd behavior. There is no OpenNext or
alternate-framework fallback. A blocking vinext gap leaves the issue incomplete
and is reported as a platform constraint; it does not justify weakening an
acceptance criterion.

Alternatives rejected:

- OpenNext: more established, but Cloudflare now recommends vinext for new
  applications and vinext is the intended Vite-native path.
- A non-Next React framework: viable on Workers, but forfeits the selected
  Next.js/AI ecosystem surface.

### Pin the researched dependency baseline

The following exact versions are the implementation baseline researched on
`2026-09-16`. Exact pins and the committed lockfile prevent independent upgrades
across tightly coupled beta, RSC, Vite, Worker, test, and lint packages.

| Concern                                | Exact version                                                                                                                           |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Contributor runtime                    | Node.js `24.21.0`, Corepack distributed with Node 24, pnpm `12.4.2`                                                                     |
| Vinext scaffold and Cloudflare adapter | `create-vinext-app@1.0.0-beta.3`, `vinext@1.0.0-beta.10`, `@vinext/cloudflare@1.0.0-beta.8`                                             |
| Application runtime                    | `next@16.2.7`, `react@19.2.7`, `react-dom@19.2.7`, `react-server-dom-webpack@19.2.7`, `server-only@0.0.1`                               |
| Vite pipeline                          | `vite@8.0.0`, `@vitejs/plugin-react@6.1.0`, `@vitejs/plugin-rsc@0.5.34`, `@cloudflare/vite-plugin@1.54.10`                              |
| Type system                            | `typescript@7.0.2`, `@types/node@24.13.5`, `@types/react@19.2.16`, `@types/react-dom@19.2.3`                                            |
| StyleX                                 | `@stylexjs/stylex@0.19.1`, `@stylexjs/unplugin@0.19.1`, `@stylexjs/eslint-plugin@0.19.1`, `unplugin@2.3.11`                             |
| Worker tooling                         | `wrangler@4.132.0`; no application dependency on `@cloudflare/workers-types`                                                            |
| Test runner and runtimes               | `vitest@4.1.0`, `@cloudflare/vitest-plugin@1.1.10`, `jsdom@30.0.1`                                                                      |
| UI test libraries                      | `@testing-library/react@16.3.3`, `@testing-library/dom@10.4.2`, `@testing-library/user-event@14.6.7`, `@testing-library/jest-dom@7.0.1` |
| Request interception                   | `msw@2.15.0`, `@msw/cloudflare@0.0.1`                                                                                                   |
| Static quality                         | `oxlint@1.83.0`, `oxlint-tsgolint@7.0.2001`, `prettier@3.9.6`                                                                           |

`next@16.2.7` and the React `19.2.7` trio match vinext's current repository
catalog and lockfile and satisfy vinext beta.10's published peer ranges. They
are stronger evidence than independently selecting npm-latest packages, but they
are not a released-tarball compatibility guarantee: vinext's public dashboard
currently exercises a nearby Next release against vinext `main`. `vite@8.0.0` is
the conservative canonical Vite 8 candidate permitted by the published peer
ranges; vinext's repository currently aliases its own Vite dependency. Therefore
clean peer resolution is necessary but not sufficient. `vinext check`,
development/HMR, production build, SSR, hydration, local workerd, and live
preview smoke are hard implementation gates.

The StyleX packages remain on one `0.19.1` family. `@stylexjs/unplugin@0.19.1`
peers on `unplugin ^2.3.11`, so `unplugin@2.3.11` is intentional; current
unplugin 3.x is incompatible with that peer contract. The Vite configuration
starts with `stylex.vite()`, followed by `vinext()`, then the Cloudflare plugin.
Vinext owns React and RSC plugin registration, so the application must install
but not separately register `react()` or `rsc()`. No official vinext-plus-StyleX
fixture proves this combined pipeline; RSC, SSR, client compilation, virtual
development assets, HMR, and linked production CSS must all be exercised.

The test baseline deliberately pins Vitest 4.1.0 rather than npm-latest Vitest
5: `@cloudflare/vitest-plugin@1.1.10` peers on `^4.1.0`. The Worker MSW adapter
is an experimental `0.0.1` package and Oxlint's JavaScript-plugin bridge is
alpha; each remains a separate implementation-blocking proof instead of an
assumed guarantee.

Primary version and compatibility evidence:

- Vinext package, source catalog, and compatibility dashboard:
  <https://registry.npmjs.org/vinext/latest>,
  <https://github.com/cloudflare/vinext/blob/main/pnpm-workspace.yaml>,
  <https://github.com/cloudflare/vinext/blob/main/pnpm-lock.yaml>,
  <https://vinext.dev/compatibility>
- Vinext Cloudflare adapter and Cloudflare Vite plugin:
  <https://registry.npmjs.org/@vinext%2fcloudflare/latest>,
  <https://registry.npmjs.org/@cloudflare%2fvite-plugin/latest>
- StyleX Vite/RSC integration:
  <https://stylexjs.com/docs/learn/installation/vite/vite-rsc>,
  <https://registry.npmjs.org/@stylexjs%2funplugin/latest>
- Workers compatibility and generated types:
  <https://developers.cloudflare.com/workers/configuration/compatibility-dates/>,
  <https://developers.cloudflare.com/workers/configuration/compatibility-flags/>,
  <https://developers.cloudflare.com/workers/languages/typescript/>
- Workers deployment, preview, and rollback:
  <https://developers.cloudflare.com/workers/versions-and-deployments/deployment-management/>,
  <https://developers.cloudflare.com/workers/versions-and-deployments/preview-urls/>,
  <https://developers.cloudflare.com/workers/versions-and-deployments/rollbacks/>
- Vitest integration and network mocking:
  <https://developers.cloudflare.com/workers/testing/vitest-integration/>,
  <https://developers.cloudflare.com/workers/testing/vitest-integration/mock-outbound-requests/>
- Oxlint JavaScript plugins and type-aware linting:
  <https://oxc.rs/docs/guide/usage/linter/js-plugins.html>,
  <https://oxc.rs/docs/guide/usage/linter/type-aware.html>

### Keep one application boundary

Use the App Router root for the public shell and a route handler for
dependency-free liveness. The shell and liveness handler share the same Worker
deployment; do not introduce a separate API Worker or service boundary for this
foundation.

The liveness handler returns only HTTP 200 and `{"status":"ok"}`. It does not
inspect future bindings or expose version, commit, environment, timing,
hostname, or deployment data. Readiness of D1, R2, Vectorize, Workflows, AI
Gateway, and Clerk belongs to their provisioning or feature issues.

Alternative rejected: a dependency-readiness endpoint would couple issue #8 to
resources that do not exist and create a public metadata surface.

### Keep the Next.js layer thin and enforce four application layers

Use `src/app` only for Next.js-required route, layout, metadata, error, loading,
and route-handler adapters. These files translate framework inputs into calls or
renders against application-owned public interfaces; they do not own product
state, domain decisions, reusable UI, data orchestration, or test fixtures.

Adopt four layers with one-way dependencies instead of mirroring URL segments
throughout the application:

```text
src/
├── app/                             # Thin Next.js adapters only
├── screens/                         # Framework-neutral route-level composition
│   └── <screen>/
│       ├── components/
│       └── index.ts                 # Screen public interface
├── features/                        # User-facing product capabilities
│   └── <feature>/
│       ├── components/
│       ├── hooks/
│       ├── model/
│       ├── api/
│       ├── lib/
│       ├── fixtures/
│       ├── index.ts                 # Explicit universal/client-safe API
│       └── index.server.ts          # Explicit server-only API, when needed
└── shared/                          # Domain-neutral cross-feature code
    ├── components/
    ├── hooks/
    ├── lib/
    └── fixtures/
```

Create a directory only when the slice has code of that responsibility; the tree
is a placement rule, not a requirement to pre-create empty folders. The neutral
foundation surface lives in `src/screens/home`, because it is route-level
composition rather than a user capability. Reusable shell primitives move to
`src/shared/components` only after genuine reuse emerges.

Dependencies flow `app → screens → features → shared`. A screen may compose
multiple feature public interfaces. A feature may import its own internals and
shared code but must not import a sibling feature; cross-feature behavior is
composed by a screen. Shared code must not import from screens, features, or
`app`. Screens, features, and shared code must not import `next`, `next/*`, or
direct vinext framework APIs; React, React DOM, RSC directives, StyleX, and
`server-only` remain legal in the appropriate lower-layer modules. The framework
adapter supplies framework-specific inputs and navigation behavior. Future use
of Next navigation, image, request, cache, redirect, or route-type APIs below
`app` requires a narrow framework-neutral port or an explicit architecture
revision rather than a hidden deep import.

Within a slice, use relative imports and do not import through the slice's own
public interface. Consumers use path aliases and explicit public entrypoints
rather than deep imports. `index.ts` exposes only deliberately selected
universal or client-safe symbols and never uses wildcard exports. Server
Components, data access, or server operations are exposed separately through
`index.server.ts` and guarded with `server-only`. Fixtures are test-only, are
absent from production entrypoints, and may receive a dedicated testing
entrypoint only when tests outside the slice need one.

Code moves to `shared` only when it is domain-neutral, independently coherent,
stable enough to expose across capabilities, and free of feature orchestration.
Consumer count alone does not justify promotion, and small duplication is
preferable to a false shared abstraction. Each library under `shared/lib` has a
narrow named responsibility rather than becoming a general utility bucket.

Encode the dependency directions, public entrypoints, runtime boundaries, and
fixture restrictions with path aliases and Oxlint `no-restricted-imports` rules
scoped by source area. The rule set must reject framework imports outside `app`,
feature-to-feature imports, shared-to-upper-layer imports, deep feature imports,
production fixture imports, and client imports of server-only entrypoints.

This uses Feature-Sliced Design's high-cohesion slices, public interfaces,
environment-specific entrypoints, and downward dependency principle without
adopting its full fixed layer vocabulary. Next.js explicitly supports keeping
project code outside `app` and using `app` purely for routing, so the
application remains portable if the framework boundary changes.

Alternatives rejected:

- Colocating application logic under route segments couples domain structure to
  URLs and Next.js conventions.
- Flat root-level `components`, `hooks`, `lib`, and `fixtures` directories
  obscure their shared-only role and encourage low-cohesion technical buckets.
- Full Feature-Sliced Design adds entities, widgets, and naming conventions that
  issue #8 does not yet need.

### Build the neutral shell with compiled StyleX

Remove the generated Tailwind styling path and use `@stylexjs/stylex@0.19.1`
with `@stylexjs/unplugin@0.19.1` and `unplugin@2.3.11`. Put `stylex.vite()`
before `vinext()` and the Cloudflare plugin, and do not register React or RSC
plugins a second time. The root layout imports one deliberate CSS entry so
StyleX can append compiled output across RSC, SSR, and client environments.
Development must prove the documented virtual stylesheet/runtime path and HMR;
production must prove that rendered HTML links the emitted CSS asset.

Define a small token layer for color, typography, spacing, measure, and
breakpoints, then style semantic header and main landmarks. The shell contains
Archive identity and a concise neutral state only. The production proof must
verify that compiled StyleX CSS is present and the shell remains styled after
server rendering and client hydration. Responsive acceptance covers a
representative narrow mobile viewport and a wide desktop viewport;
implementation verification must inspect both actual rendered surfaces.

Alternatives rejected: Tailwind was the scaffold default but not the selected
styling system; CSS Modules and global CSS would establish a competing component
convention.

### Use Oxlint as the single lint runner

Use `oxlint@1.83.0` as the only lint runner. Enable its native TypeScript,
React, Next.js, JSX accessibility, import, promise, and Vitest rule families.
Install `oxlint-tsgolint@7.0.2001` and enable type-aware checks for floating and
misused promises. The JavaScript-plugin bridge is built into Oxlint; do not
install `@oxlint/plugins`. Load `@stylexjs/eslint-plugin@0.19.1` through
`jsPlugins` and enable `@stylexjs/valid-styles` and `@stylexjs/no-unused`.

Because Oxlint's bridge is alpha and the StyleX plugin is not in its
conformance-tested set, implementation must separately prove that the configured
command rejects one invalid StyleX declaration and one unused named style, then
remove both throwaway fixtures. It must also reject representative floating- and
misused-Promise fixtures through the same command. If either StyleX rule
crashes, fails to load, or does not diagnose, the issue is blocked; adding
ESLint or dropping StyleX validation is not an implicit fallback.

Alternative rejected: a narrow second ESLint runner would be more mature for
StyleX but violates the confirmed single-runner choice and adds duplicate lint
infrastructure.

### Separate UI and Worker Vitest projects

Use one Vitest 4.1.0 root project graph with two uniquely named, independently
runnable projects and exclusive file globs:

- `ui` uses `jsdom@30.0.1`, React Testing Library, user-event, jest-dom, and
  `msw/node`. Its setup calls `server.listen({ onUnhandledRequest: 'error' })`,
  resets handlers after each test, and closes the server after the suite.
- `worker` uses only `@cloudflare/vitest-plugin@1.1.10` with
  `cloudflareTest({ wrangler: { configPath: './wrangler.jsonc' } })`; it does
  not set a DOM/Node environment or custom runner. Tests prefer
  `exports.default.fetch()` from `cloudflare:workers` for integration behavior.
  `@msw/cloudflare@0.0.1` configures its returned network API with
  `onUnhandledFrame: 'error'`, enables it before tests, resets handlers after
  each test, and disables it afterward.

Keep `vitest run --project ui`, `vitest run --project worker`, and a combined
`vitest run` command. UI tests assert semantic, accessible, user-visible
behavior rather than component internals. Worker tests assert status, response
body, content type, and absence of extra liveness fields. A temporary unhandled
request must make each project fail; package setup alone is not proof of strict
interception.

Alternative rejected: real-browser Vitest mode adds browser runtime and CI
weight without interactive product behavior. Actual narrow/wide visual smoke
verification remains required during implementation but does not justify a
permanent browser suite in this issue.

### Pin the contributor toolchain and generate platform types

Pin Node.js `24.21.0` in repository runtime metadata and set `packageManager` to
`pnpm@12.4.2`. Bootstrap with the Corepack shipped in Node 24, commit the pnpm
lockfile, and use `pnpm install --frozen-lockfile` for clean-checkout
verification. Corepack is experimental and is not bundled beginning with Node
25, so the project must not depend on an unpinned global pnpm.

Use strict TypeScript `7.0.2` and a separate `tsc --noEmit` command. Generate
and commit `worker-configuration.d.ts` with
`pnpm wrangler types worker-configuration.d.ts`; verify drift with
`pnpm wrangler types worker-configuration.d.ts --check`. The generated file plus
`@cloudflare/vitest-plugin/types` is authoritative for application and
Worker-test runtime types. Do not add `@cloudflare/workers-types` as a second
global runtime-type source or maintain a hand-written environment interface.

Expose boring, composable commands for development, production build,
workerd-local production execution, type generation/checking, linting, Prettier
write/check, UI tests, Worker tests, combined tests, the full local quality
gate, candidate upload, production promotion, and explicit-ID rollback. The
combined local gate excludes cloud deployment so it can run without credentials.

### Use local and production as the only persistent environments

Local development uses local emulation and local-only values. Production uses
the explicit Worker name `archive-production`; no command may deploy an
ambiguous root/default Worker. Issue #8 deploys the public shell and health
route to that Worker. Issue #9 later attaches isolated production bindings and
deployment automation.

Remote validation uses versioned candidate previews on `archive-production`. A
candidate version is uploaded without traffic and must use an opaque tag/message
and checked-in `preview_urls: true`. Version preview URLs are not short-lived
and Cloudflare exposes no individual-version deletion or TTL. Rejected versions
therefore remain undeployed platform history. Cleanup applies only to disposable
external resources and replaceable aliases; it must never invoke
`wrangler delete` against the production Worker. If retained public preview URLs
become unacceptable, protect them with Access or revise the architecture around
disposable Workers rather than claiming a nonexistent cleanup operation.

Candidate-specific resources must be isolated from production data and named
from opaque deployment identifiers, not user-controlled content. Issue #8 has no
durable data resources, so its candidate is only a retained, undeployed version
preview. Issue #9 must extend the lifecycle to disposable
D1/R2/Vectorize/Workflow resources where remote validation requires them. The
architecture document must be updated during implementation to preserve all
privacy, ownership, deletion, and rollback invariants.

### Gate promotion and preserve rollback

A release proceeds in this order:

1. Reproduce the pinned clean checkout and run the full local quality gate.
2. Build once and run the generated Worker locally under workerd.
3. For an already-created production Worker, record
   `wrangler deployments status --json`, then upload a candidate with
   `wrangler versions upload` without moving traffic. Capture the candidate
   version ID and preview URL.
4. Smoke-test candidate shell rendering, compiled styling, and liveness through
   the versioned preview URL. Reject failures without changing production
   traffic; retain the undeployed version as platform history and clean only
   disposable resources.
5. Promote only the recorded candidate ID with
   `wrangler versions deploy <candidate-id>@100% --yes`; do not rebuild or
   re-upload during promotion.
6. Smoke-test the production shell and liveness.
7. On failure, run `wrangler rollback <previous-known-good-id>` using the
   production version ID recorded before promotion, verify it, preserve
   diagnostic evidence, and later restore the validated version by explicitly
   deploying its ID.

The first-ever Worker creation is a one-time exception:
`wrangler versions upload` cannot create a Worker, so the named production
Worker must first be provisioned with C3 or `wrangler deploy`. There is no prior
traffic to preserve for that bootstrap. Every subsequent release follows upload,
preview, and explicit-ID promotion. Rollback covers only the 100 most recent
published versions and does not revert bindings or resource data. No database
migration exists in issue #8. Later schema work must satisfy the architecture's
forward-compatibility rule before using this application rollback path.

## Risks / Trade-offs

- [Vinext is beta and the selected exact package set is not a
  released-artifact-tested matrix] → Pin the researched versions, run
  `vinext check`, and prove the exact App Router surface in development, build,
  workerd, and a live preview; block rather than silently switch stacks.
- [Canonical Vite 8 plus StyleX has no official vinext fixture] → Start from the
  published peer-compatible `vite@8.0.0`, keep StyleX first and vinext in
  control of React/RSC registration, then require RSC, SSR, hydration, HMR, and
  production CSS-link proofs.
- [StyleX rules through Oxlint's alpha JS bridge may be incompatible] →
  Independently prove validity and unused-style rules plus type-aware Promise
  checks; report a blocker rather than claiming coverage.
- [`@msw/cloudflare` is an experimental `0.0.1` adapter] → Configure
  `onUnhandledFrame: 'error'` explicitly and prove both handled and unhandled
  outbound requests under workerd.
- [Simulated DOM tests can miss browser layout defects] → Keep permanent tests
  focused on semantics and behavior, then visually smoke-test actual narrow and
  wide rendered surfaces during implementation and candidate validation.
- [No persistent staging increases release risk] → Require an undeployed
  candidate version, explicit version-ID promotion, production smoke checks, and
  rollback to the recorded previous live ID.
- [Candidate preview URLs persist and individual Worker versions cannot be
  deleted] → Keep issue #8's preview content-free, retain versions as platform
  history, and clean only resources that have a real deletion API; use Access or
  revise the architecture if preview privacy requirements tighten.
- [Future Cloudflare services may not support fully ephemeral equivalents] →
  Issue #9 must define disposable-resource mechanics per service while
  preserving isolation and cleanup; it may not substitute live user data as test
  input.
- [A public pre-authentication shell is reachable before Clerk lands] → Keep it
  content-free and make all private routes/data nonexistent until issue #15 adds
  server-enforced authentication.

## Migration Plan

1. Scaffold and validate the exact pinned local application and quality
   toolchain without cloud credentials.
2. Reconcile `docs/ARCHITECTURE.md` and issue-facing command documentation with
   the confirmed local/production plus candidate-version model.
3. Build and run the generated Worker bundle locally under workerd.
4. If the named production Worker does not exist, perform the documented
   one-time bootstrap creation.
5. Record the current production deployment, upload a candidate version, and
   verify its shell, StyleX output, and liveness through the versioned preview
   URL.
6. Promote the recorded candidate ID to 100%, verify the public production URL,
   roll back once to the explicitly recorded previous known-good ID, and restore
   the validated ID.
7. Delete only disposable candidate resources or aliases that expose a supported
   deletion operation. Retain uploaded Worker versions as Cloudflare-managed
   deployment history.

Rollback restores the explicitly recorded previous known-good Worker version and
rechecks the shell and liveness contract. Because this change introduces no
persistent data migration, rollback does not require data repair. Bindings and
resource data are not rolled back by a Worker-version rollback.
