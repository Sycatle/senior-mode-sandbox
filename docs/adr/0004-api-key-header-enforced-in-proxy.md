---
id: 0004
title: Every /api/ route requires an x-api-key header, enforced in one place (src/proxy.ts) with an explicit list of open routes
status: proposed
spec: 0004
---

## Context

The app is about to get its first API routes (`/api/health` in #2, others later). Issue #4 asks
that API calls without an `x-api-key` header be refused with 401, except the health check.

Two things make this hard to undo:

- **It is a contract with API clients.** Once clients send `x-api-key` and read
  `{"error":"missing_api_key"}`, renaming the header, switching to `Authorization: Bearer`, or
  changing the error shape breaks them.
- **It sets where access rules live.** Every future API route will either rely on a central check
  or carry its own; switching later means revisiting every route.

For now only the presence of the header is checked, not its value (spec 0004). Real key validation
is a later decision, but it will plug into the place chosen here.

Next.js 16 offers a Proxy file (`src/proxy.ts`, formerly `middleware`) that runs before any route
and can answer directly.

## Decision

All requests to `/api/` and below must carry an `x-api-key` header. One file, `src/proxy.ts`,
checks this before any API route runs and answers 401 `{"error":"missing_api_key"}` when the header
is missing or blank. Routes that must stay open are listed by exact path in that same file; today
the list holds only `/api/health`. Protection is the default; opening a route is a deliberate,
visible edit.

## Alternatives considered

- **Check inside each API route (a shared helper every route handler calls):** keeps the rule next
  to the code it protects and works the same in tests and at runtime. Not chosen: protection
  becomes opt-in, so a forgotten call silently leaves a route open, and with no routes yet there is
  nothing to gain from per-route flexibility.
- **Central check, exemption expressed in the matcher (negative lookahead such as
  `/api/((?!health$).*)`):** the health route never even reaches the proxy. Not chosen: regex
  exemptions are easy to get subtly wrong (`/api/healthz`, `/api/health/x`), hard to read in
  review, and only testable through Next's experimental matcher helper. An exact-path list in code
  is plain and unit-testable.
- **Use the standard `Authorization: Bearer <key>` header instead of `x-api-key`:** what most HTTP
  tooling and proxies already know how to handle and redact. Not chosen: the
  issue names `x-api-key` explicitly and it is a common convention for service keys; changing the
  name is a product decision for the issue author, not this ADR.
- **Do nothing until real authentication exists:** no false sense of security from a check anyone
  can bypass. Not chosen: the issue asks for it, and fixing the contract and the enforcement point
  before the first route ships is cheaper than retrofitting them.

## Consequences

- Easier: every new API route is protected without extra code; real key validation later changes
  one function, not every route.
- Easier: the list of open API routes is in one file, reviewable at a glance.
- Harder: a route that must be public needs an edit to `src/proxy.ts`, which reviewers must watch.
- Harder: the rule depends on the proxy `matcher` staying `/api/:path*`; a careless matcher edit
  can silently remove protection. Tests on the matcher are required to catch this.
- Bad: until the key value is validated, this is not authentication. Anyone sending any value gets
  through. Nothing sensitive should sit behind `/api/` on the strength of this check alone.
- Bad: browser CORS preflights (`OPTIONS`) carry no custom headers and will get 401; a future
  browser client needs a CORS decision.
- Must maintain: the `x-api-key` header name, the 401 status and the `missing_api_key` error code
  as a public contract; changing any of them needs a new ADR.
- `src/proxy.ts` now carries an access rule but is not in the `protected` paths of
  `.claude/senior-mode.json` (only `middleware.*` is); adding it is recommended.
