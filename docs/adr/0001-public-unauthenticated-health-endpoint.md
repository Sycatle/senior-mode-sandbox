---
id: 0001
title: GET /api/health is a public, unauthenticated liveness endpoint with a fixed reply
status: proposed
spec: 0001
---

## Context

Uptime monitors and load balancers need to know whether the app is running. They are configured
outside this repository, often by other people, and usually cannot send secrets. Issue #4 will
require an `x-api-key` header on every `/api/*` route. If the health check falls under that rule,
every monitor needs the key, or it sees `401` and reports the app as down. Once monitors point at an
address and expect a reply, changing either breaks them silently, so the contract is hard to
reverse.

## Decision

`GET /api/health` is open to anyone, with no key or login. It always answers `200` with the body
`{"status":"ok"}` and says nothing else: no version, no dependency status, no internal detail. It
only means "the server is up and answering". The authentication added by issue #4 must skip this
one address, and #4 keeps a test proving it. Changing the address, the status code or the body
needs a new ADR.

## Alternatives considered

- **Health check behind the API key like every other `/api/*` route:** one uniform rule, no
  exception to maintain. Rejected: every monitor and load balancer would need the secret, which
  spreads it to third-party tools, and a key rotation would make the app look down.
- **Health check outside `/api/` (for example `/health` or `/healthz`):** avoids any exception in
  #4's auth since it is not under `/api/*`. Rejected: issue #2 asks for `/api/health`, and a page
  route at the root mixes the API with the site's pages. Credible if the exemption proves fragile;
  it would be a new ADR.
- **Readiness endpoint that also checks dependencies (database, Stripe):** tells more than "up".
  Rejected for now: the app has no dependencies yet, a failing third party would mark the app down
  and trigger restarts, and a public endpoint reporting dependency status leaks information. A
  separate, possibly authenticated, readiness endpoint can come later.
- **Do nothing:** no endpoint; monitors load the home page. Rejected: heavier, tied to page
  rendering, and breaks when the page changes.

## Consequences

- Monitors can be set up without any secret; key rotation in #4 never affects them.
- #4's auth must carry and test an explicit exemption for `/api/health`. Each future public route
  would add to that list; the list must stay short and be reviewed.
- Anyone on the internet can learn that the app is up. Accepted: the reply carries no other data.
- The endpoint can say "ok" while a dependency is broken; it is not a readiness signal.
- The path and reply are frozen: improving them (adding a version field, for example) needs a new
  ADR and care for existing monitors.
