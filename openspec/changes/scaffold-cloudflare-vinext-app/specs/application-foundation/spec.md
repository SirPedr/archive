## Purpose

Define the observable runtime, public shell, liveness, release-safety,
generated-type, and clean-checkout quality contracts that all later Archive
capabilities build upon.

## ADDED Requirements

### Requirement: Local and production application availability

The application SHALL provide the same public foundation shell and liveness
behavior in local development and on the live production Cloudflare Worker.
Production deployment MUST fail without replacing the currently live version
when its build or required configuration validation fails.

#### Scenario: Clean local startup

- **WHEN** a contributor installs the pinned dependencies from a clean checkout
  and starts local development
- **THEN** the public foundation shell and liveness endpoint become reachable
  without production credentials

#### Scenario: Successful production deployment

- **WHEN** a validated candidate is promoted to production
- **THEN** the production Worker serves the foundation shell and liveness
  endpoint

#### Scenario: Failed production build

- **WHEN** the production build or deployment validation fails
- **THEN** the currently live production version remains unchanged

### Requirement: Responsive neutral foundation shell

The public shell SHALL present Archive identity and semantic header and
main-content landmarks in English. It MUST remain usable without horizontal
overflow at supported narrow and wide viewport widths and MUST NOT present
authentication, library, upload, chat, settings, or other product actions before
those capabilities exist.

#### Scenario: Narrow viewport

- **WHEN** the shell is rendered at a narrow mobile viewport
- **THEN** its identity and primary content remain readable, ordered, and
  reachable without horizontal scrolling

#### Scenario: Wide viewport

- **WHEN** the shell is rendered at a desktop viewport
- **THEN** it uses the available width while preserving a clear reading
  hierarchy and semantic landmarks

#### Scenario: Pre-product state

- **WHEN** a visitor opens the foundation shell before later product
  capabilities ship
- **THEN** the page communicates a neutral application state without displaying
  non-functional product controls

### Requirement: Privacy-safe liveness contract

The application SHALL expose a dependency-free public liveness endpoint in local
development, candidate previews, and production. A healthy request MUST return
HTTP 200 with a stable machine-readable status and MUST NOT include secrets,
binding values, deployment identifiers, source metadata, user information, or
downstream dependency state.

#### Scenario: Healthy runtime

- **WHEN** a client sends a GET request to the liveness endpoint on a running
  application
- **THEN** it receives HTTP 200 and the JSON body `{"status":"ok"}`

#### Scenario: Public response contains no sensitive data

- **WHEN** any caller reads a successful liveness response
- **THEN** the response contains only the documented status contract and no
  environment-specific or private fields

### Requirement: Generated Cloudflare environment types

Worker runtime and binding types MUST be generated deterministically from the
checked-in Cloudflare configuration and MUST be consumed by type checking rather
than duplicated as hand-written authoritative declarations.

#### Scenario: Type generation from a clean checkout

- **WHEN** a contributor runs the documented type-generation command after
  installing pinned dependencies
- **THEN** the generated declarations represent the checked-in Worker
  configuration without requiring Cloudflare credentials

#### Scenario: Binding configuration changes

- **WHEN** a binding is added, removed, or renamed in checked-in configuration
- **THEN** regenerating types updates the compile-time environment contract and
  stale binding usage fails type checking

### Requirement: Reproducible quality commands

A clean checkout SHALL use pinned Node LTS and pnpm toolchains and SHALL expose
independent commands for production build, type checking, linting, formatting
verification, UI tests, Worker tests, and the combined quality gate. Each
command MUST exit non-zero when its contract fails.

#### Scenario: Complete clean-checkout verification

- **WHEN** a contributor installs from the committed lockfile and runs the
  combined quality command
- **THEN** production build, type checking, linting, formatting verification, UI
  tests, and Worker tests all execute without cloud credentials

#### Scenario: UI behavior test failure

- **WHEN** the rendered shell violates a tested user-observable accessibility or
  content contract
- **THEN** the UI test command exits non-zero

#### Scenario: Worker behavior test failure

- **WHEN** the liveness handler violates its status, content, or privacy
  contract inside the Workers runtime
- **THEN** the Worker test command exits non-zero

#### Scenario: Unmocked outbound test request

- **WHEN** a focused test unexpectedly attempts an outbound network request
- **THEN** the test fails rather than reaching the external service

#### Scenario: Invalid StyleX declaration

- **WHEN** source contains a StyleX declaration rejected by the official StyleX
  lint rules
- **THEN** the Oxlint command exits non-zero

### Requirement: Two persistent environments with versioned candidate validation

The MVP SHALL maintain only local and production as persistent environments.
Remote release validation MUST use an uploaded Worker version that receives no
production traffic until build, quality, preview smoke, and liveness checks
pass. Uploaded Worker versions and their versioned preview URLs MAY remain as
platform-managed deployment history because Cloudflare exposes no
individual-version deletion or TTL. Any external candidate resources or
replaceable aliases MUST be isolated and destroyed after promotion or rejection
when their service exposes a supported deletion operation.

#### Scenario: Candidate passes validation

- **WHEN** a candidate build passes all local gates and its remote preview
  serves the shell and liveness contract successfully
- **THEN** its recorded version ID is eligible for explicit production promotion
  without rebuilding or re-uploading

#### Scenario: Candidate fails validation

- **WHEN** any candidate build, quality, preview smoke, or liveness check fails
- **THEN** it remains undeployed without changing production traffic, its
  uploaded version remains ordinary platform history, and its disposable
  external resources are cleaned up

#### Scenario: Candidate is promoted

- **WHEN** an eligible candidate version ID is explicitly promoted
- **THEN** production traffic moves to that exact version and the previously
  recorded live version remains available for rollback

#### Scenario: Production smoke check fails

- **WHEN** the post-promotion production shell or liveness smoke check fails
- **THEN** traffic is restored to the explicitly recorded previous known-good
  version and the failed version is retained as platform history for diagnosis

#### Scenario: First Worker creation

- **WHEN** the named production Worker does not yet exist
- **THEN** it is created once through a documented bootstrap deployment before
  later releases use upload, preview, and explicit version-ID promotion

### Requirement: Framework-independent application boundaries

The client application SHALL organize route-level composition under
`src/screens`, product behavior under `src/features`, and domain-neutral
cross-feature code under `src/shared`. The Next.js route tree MUST remain an
adapter that maps framework entry points to application-owned screen or server
interfaces. Dependencies MUST flow from `app` to screens, from screens to
features, and from features to shared code without reverse or sibling-feature
dependencies.

#### Scenario: Route renders a screen

- **WHEN** a framework route exposes a product surface
- **THEN** the route delegates rendering and behavior to a framework-neutral
  screen public interface instead of containing product logic

#### Scenario: Screen composes capabilities

- **WHEN** one product surface requires behavior from multiple features
- **THEN** its screen composes those feature public interfaces without either
  feature importing the other

#### Scenario: Feature-local change

- **WHEN** a contributor changes behavior owned by one feature
- **THEN** its components, hooks, model, API integration, library code, and
  fixtures remain within that feature boundary

#### Scenario: Shared-code promotion

- **WHEN** code is reused across feature boundaries
- **THEN** it moves to `src/shared` only if it is domain-neutral, independently
  coherent, stable, and free of feature orchestration

#### Scenario: Runtime-specific public interface

- **WHEN** a feature exposes both browser-safe and server-only behavior
- **THEN** it uses explicit universal or client-safe exports separately from a
  server-only public entrypoint, and production entrypoints expose neither
  fixtures nor feature internals

#### Scenario: Dependency direction violation

- **WHEN** code imports the framework outside `src/app`, imports an upper or
  sibling feature layer, bypasses a slice public interface, imports fixtures
  from production code, or imports a server-only entrypoint from client code
- **THEN** the automated architecture check exits non-zero

### Requirement: Foundation scope boundary

The foundation SHALL NOT implement identity, private data access, persistent
domain storage, uploads, retrieval, model calls, quotas, operator actions, or
public-answer publishing. Later capabilities MUST be able to add those behaviors
without replacing the runtime, shell, liveness, generated-type, or
quality-command contracts defined here.

#### Scenario: Foundation runs without downstream services

- **WHEN** no identity, database, object-storage, vector, workflow, or model
  binding has been provisioned
- **THEN** local startup, the foundation shell, liveness, and focused quality
  commands still work
