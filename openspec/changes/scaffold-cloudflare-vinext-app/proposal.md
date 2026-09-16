## Why

[GitHub issue #8](https://github.com/SirPedr/archive/issues/8), under
[platform foundation epic #1](https://github.com/SirPedr/archive/issues/1), must
establish a reproducible Cloudflare-native TypeScript application before
identity, storage, ingestion, retrieval, and model work can begin. Cloudflare
currently recommends vinext for new Next.js applications on Workers, and the
greenfield scaffold is the earliest point to prove that beta stack, its
production deployment, and its quality harnesses without weakening later MVP
behavior.

## What Changes

- Create a strict TypeScript, Next.js 16 App Router application that runs
  through vinext on Cloudflare Workers. Vinext is the committed runtime path: a
  failed compatibility or runtime contract blocks completion rather than
  triggering an adapter fallback or a reduced product contract.
- Keep the Next.js `app` tree as a very thin framework adapter. Organize
  route-level composition under framework-neutral `src/screens/`, product
  behavior under `src/features/<feature>/`, and domain-neutral cross-feature
  code under `src/shared/`, with explicit dependency direction and separate
  server-only public entrypoints where required.
- Add a polished, responsive, English-language foundation shell built with
  StyleX. The shell exposes Archive identity and semantic page structure without
  placeholder navigation, authentication, library, upload, or chat behavior
  owned by later issues.
- Expose the shell and a dependency-free liveness endpoint in both local
  development and the live production Worker. The liveness response discloses no
  secrets, bindings, deployment metadata, or user data.
- Generate Worker runtime and binding types from Cloudflare configuration;
  hand-written binding declarations are not authoritative.
- Establish pinned Node LTS and pnpm tooling plus clean-checkout commands for
  development, production build and deployment, type checking, linting,
  formatting checks, and focused tests.
- Establish separate Vitest projects for React behavior in a simulated DOM and
  Worker behavior in `workerd`, with React Testing Library and MSW adapters
  appropriate to each runtime.
- Use Oxlint as the single lint runner, including TypeScript, React, Next.js,
  accessibility, Vitest, and official StyleX rules loaded through Oxlint's
  JavaScript-plugin bridge. The scaffold must prove that StyleX validation works
  through that bridge.
- **BREAKING**: Replace the target architecture's persistent staging environment
  with two persistent environments—local and production—and versioned Cloudflare
  candidate previews. Uploaded Worker versions remain platform-managed
  deployment history because Cloudflare exposes no individual-version deletion
  or preview TTL; only disposable external candidate resources and replaceable
  aliases are destroyed after promotion or rejection. Production promotion
  requires successful candidate validation and retains an explicit version-ID
  rollback path.

## Capabilities

### New Capabilities

- `application-foundation`: Cloudflare Workers application runtime, responsive
  public foundation shell, liveness contract, environment and release behavior,
  generated types, and clean-checkout quality commands.

### Modified Capabilities

None. The repository has no existing capability specifications.

## Impact

- Introduces the first product runtime and frontend surface in the currently
  planning-only repository.
- Adds Next.js 16, React, vinext, Cloudflare Workers/Wrangler, StyleX,
  TypeScript, pnpm, Vitest, React Testing Library, MSW, Oxlint, Prettier, and
  their required runtime-specific adapters.
- Establishes a framework-independent, feature-driven client module boundary so
  later product work does not inherit Next.js route structure as its application
  architecture.
- Establishes production Worker deployment and versioned candidate-preview
  conventions that [issue #9](https://github.com/SirPedr/archive/issues/9) will
  extend with D1, R2, Vectorize, Workflows, AI Gateway, secrets, and deployment
  automation.
- Supplies the application boundary required by dependent issues
  [#10](https://github.com/SirPedr/archive/issues/10),
  [#11](https://github.com/SirPedr/archive/issues/11),
  [#13](https://github.com/SirPedr/archive/issues/13),
  [#14](https://github.com/SirPedr/archive/issues/14), and
  [#15](https://github.com/SirPedr/archive/issues/15) without implementing their
  domain behavior.
- Requires reconciliation of `docs/ARCHITECTURE.md` environment and
  release-validation language with the confirmed two-persistent-environment
  decision.
