## 1. Reproducible runtime scaffold

- [x] 1.1 Pin Node.js 24.21.0 in repository runtime metadata, set
      `packageManager` to `pnpm@12.4.2`, bootstrap pnpm with Node 24's Corepack,
      commit the lockfile, and verify `pnpm install --frozen-lockfile` succeeds
      from a clean checkout.
- [x] 1.2 Scaffold from `create-vinext-app@1.0.0-beta.3`; pin
      `vinext@1.0.0-beta.10`, `@vinext/cloudflare@1.0.0-beta.8`, `next@16.2.7`,
      `react@19.2.7`, `react-dom@19.2.7`, `react-server-dom-webpack@19.2.7`,
      `vite@8.0.0`, `@vitejs/plugin-react@6.1.0`, `@vitejs/plugin-rsc@0.5.34`,
      `typescript@7.0.2`, `@types/node@24.13.5`, `@types/react@19.2.16`, and
      `@types/react-dom@19.2.3`; then verify peer resolution, `vinext check`,
      development render, and production build without introducing another
      adapter.
- [x] 1.3 Pin `wrangler@4.132.0` and `@cloudflare/vite-plugin@1.54.10`;
      configure local execution and the production Worker `archive-production`
      with `compatibility_date: "2026-09-16"` and no redundant Node
      compatibility flag, commit `worker-configuration.d.ts`, and verify
      `wrangler types ... --check` plus strict type checking without
      `@cloudflare/workers-types` or hand-written authoritative bindings.
- [x] 1.4 Establish the four-layer `app → screens → features → shared` source
      structure without speculative empty folders, place the neutral foundation
      surface under `src/screens/home`, and define explicit screen and feature
      public-entrypoint conventions with separate `index.server.ts` entrypoints
      only where server-only behavior exists.
- [x] 1.5 Add path aliases, `server-only@0.0.1` guards, and source-scoped Oxlint
      restricted-import rules for the allowed dependency direction; verify
      temporary `next`/vinext-outside-app, sibling-feature,
      shared-to-upper-layer, deep-import, production-fixture, and
      client-to-server violations are rejected before removing the proofs.

## 2. Public foundation surface

- [x] 2.1 Pin StyleX runtime, unplugin, and lint plugin 0.19.1 plus
      `unplugin@2.3.11`; register StyleX before vinext and the Cloudflare plugin
      without duplicate React/RSC registration, add the deliberate CSS entry and
      development virtual assets, then prove RSC, SSR, hydration, HMR, and
      production HTML-linked compiled CSS.
- [x] 2.2 Implement the tokenized responsive Archive foundation shell in
      `src/screens/home`, expose it through the screen public interface, keep
      the Next.js page as a thin adapter, and verify its observable content and
      landmarks with React Testing Library.
- [x] 2.3 Implement the dependency-free public liveness route returning only
      HTTP 200 and `{"status":"ok"}`, then verify no environment, binding,
      deployment, source, or user fields are present.

## 3. Focused quality harnesses

- [x] 3.1 Pin Vitest 4.1.0, `@cloudflare/vitest-plugin@1.1.10`, jsdom 30.0.1,
      and the researched Testing Library packages; configure exclusive `ui` and
      `worker` Vitest 4 projects without unsupported environment/runner
      settings, then verify focused and combined commands select the intended
      files.
- [x] 3.2 Add durable UI behavior coverage for Archive identity, semantic
      landmarks, absence of non-functional product controls, and representative
      narrow-content behavior, then verify the UI project passes while leaving
      real layout/overflow proof to the rendered-surface smoke.
- [x] 3.3 Add Worker-runtime coverage through `exports.default.fetch()` for
      liveness status, JSON content type, exact body, and absence of extra
      fields, then verify the Worker project passes inside workerd.
- [x] 3.4 Pin `msw@2.15.0` and `@msw/cloudflare@0.0.1`; configure UI
      `onUnhandledRequest: 'error'` and Worker
      `network.configure({ onUnhandledFrame: 'error' })` lifecycles, then prove
      handled interception and temporary unhandled failures in each project
      before removing the proofs.
- [x] 3.5 Pin `oxlint@1.83.0` and `oxlint-tsgolint@7.0.2001`; enable the
      required native/type-aware rule families and load StyleX through built-in
      `jsPlugins`, then separately prove invalid-style, unused-style,
      floating-Promise, and misused-Promise failures before removing the
      throwaway fixtures.
- [x] 3.6 Pin `prettier@3.9.6`; configure separate write/check commands plus
      independent build, type, lint, UI-test, Worker-test, combined-test, and
      full local quality commands, then verify every command returns a
      meaningful non-zero exit when its contract is deliberately broken.

## 4. Environment and release lifecycle

- [x] 4.1 Add unambiguous commands for vinext development, build plus
      workerd-local production execution, candidate upload, explicit-ID
      production promotion, and explicit-ID rollback against
      `archive-production` and generated `dist/server/wrangler.json`; verify
      none can accidentally deploy an unnamed root/default Worker.
- [x] 4.2 Configure `preview_urls: true`; record current deployment state,
      upload a tagged candidate version without traffic, capture its version
      ID/preview URL, and verify a failed candidate remains undeployed without
      requiring impossible individual-version deletion.
- [x] 4.3 Promote only the recorded candidate ID to 100%, capture and explicitly
      target the previous live version ID for rollback, verify deployment status
      after each transition, and document the 100-version rollback horizon plus
      the fact that bindings/resources are not reverted.
- [x] 4.4 Update `docs/ARCHITECTURE.md` and contributor-facing documentation to
      replace persistent staging with local, production, retained candidate
      versions, and disposable-resource cleanup while preserving privacy,
      ownership, deletion, and rollback invariants.

## 5. End-to-end acceptance

- [x] 5.1 Recreate a clean checkout, enable Corepack, perform the frozen
      install, verify generated platform types are current, and run the full
      local quality gate without Cloudflare credentials.
- [x] 5.2 Build and launch the generated Worker under local workerd, inspect the
      actual shell at representative narrow and wide viewports, request liveness
      over HTTP, and verify responsive layout, compiled styling, semantic
      content, and the exact health response.
- [x] 5.3 If the named production Worker does not exist, perform and record the
      one-time bootstrap creation; then upload a candidate, verify shell, StyleX
      output, and liveness through its versioned preview URL, and confirm
      production traffic did not change.
- [x] 5.4 Promote the validated candidate ID, verify the live shell and liveness
      endpoint, exercise rollback to the explicitly recorded previous known-good
      ID, restore the validated ID, clean only disposable resources with
      supported deletion operations, and record the deployment evidence for
      issue #8.
