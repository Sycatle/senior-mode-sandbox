---
id: 0001
title: Anyone can check that the app is up with GET /api/health
status: draft
size: L
paths:
  - src/app/api/health/**
adrs: [0001]
issue: "#2"
---

# Anyone can check that the app is up with GET /api/health

## Problem

Uptime monitors, load balancers and the people who deploy the app have no way to ask
"is the server running and answering requests?" without loading a full page. They need a small,
stable address that answers quickly with a fixed reply. Because monitoring tools will be configured
against it, the address and its reply are a public contract: changing them later breaks setups
we do not control.

## Acceptance criteria

1. Given the app is running, when a client sends `GET /api/health`, then the response status is
   `200`.
2. Given the app is running, when a client sends `GET /api/health`, then the response
   `Content-Type` is `application/json` and the body is exactly `{"status":"ok"}`.
3. Given two requests to `GET /api/health`, when the second one is sent, then it is answered by
   the handler again and not from a cache (the route is dynamic; nothing in the build output marks
   it as static or prerendered).
4. Given a client sends `GET /api/health` with no credentials, when the request is handled, then
   it is answered as in criteria 1 and 2 (no authentication is required). This criterion stays
   true after issue #4 adds `x-api-key` auth on `/api/*`; #4 must keep a test proving it.

## Out of scope

- Readiness or dependency checks (database, Stripe, external APIs). The endpoint reports liveness
  only: the process is up and can run a route handler.
- Version, commit, uptime, timestamp or any other field in the body.
- Methods other than `GET` (`HEAD`, `POST`, ...): Next.js default behaviour applies, not part of
  the contract.
- Rate limiting, logging or metrics specific to this route.
- The authentication mechanism itself (issue #4).

## Test seams

- `GET` exported from `src/app/api/health/route.ts`, called directly in a colocated Vitest test
  `src/app/api/health/route.test.ts` (node environment, relative import, no alias). The test reads
  `response.status`, `response.headers.get("content-type")` and `await response.json()`.
  Covers criteria 1 and 2.
- Criterion 3: `npm run build` route table lists `/api/health` as dynamic (`ƒ`), checked during
  review; no automated test required.
- Criterion 4: owned by issue #4, tested at its seam (the proxy/auth function called with a
  `NextRequest` for `/api/health` without the key must let it through).

## Users and journeys (L only)

- **Uptime monitor / load balancer:** polls `GET /api/health` every N seconds; treats `200` as up,
  anything else or a timeout as down. Holds no API key.
- **Developer or operator after a deploy:** runs `curl https://<host>/api/health` and expects
  `{"status":"ok"}`.

## Design (L only)

- One App Router Route Handler: `src/app/api/health/route.ts` exports
  `export async function GET()` returning `Response.json({ status: "ok" })`. No request
  parameters, no I/O, no imports beyond the platform.
- Caching: in Next.js 16, `GET` Route Handlers are not cached by default. No `dynamic`,
  `revalidate` or cache directive is added; criterion 3 guards against a future change making it
  static.
- Public, unauthenticated contract: see [ADR 0001](../adr/0001-public-unauthenticated-health-endpoint.md).
  The path `/api/health`, the status `200` and the body `{"status":"ok"}` are stable; changing any
  of them requires a new ADR.

## Rollout and risks (L only)

- No migration, flag or backward-compatibility concern: the route is new.
- Risk: issue #4 adds auth on `/api/*` and forgets the exemption, monitors start getting `401`
  and report the app as down. Mitigation: criterion 4 and ADR 0001 make the exemption part of #4's
  acceptance.
- Risk: liveness says "ok" while a dependency is down. Accepted: this endpoint is liveness only; a
  readiness endpoint would be a separate spec.
- Risk: the endpoint reveals that the app exists and is up. Accepted: it returns no version or
  internal detail.

## Open questions

- In Next.js 16, `middleware.ts` is renamed `proxy.ts`. The `protected` list in
  `.claude/senior-mode.json` covers `middleware.*` but not `proxy.*`, so the auth code from #4
  would not be protected. Recommended: add `proxy.*` and `src/proxy.*` to `protected` before #4
  starts (a human edit; the file is itself protected).
