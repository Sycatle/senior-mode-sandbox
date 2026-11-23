---
id: 0004
title: API requests without an x-api-key header are refused
status: draft
size: L
paths:
  - src/proxy.ts
  - src/proxy.test.ts
adrs: [0004]
issue: "#4"
---

# API requests without an x-api-key header are refused

## Problem

Anyone who can reach the app can call any route under `/api/`. There are no API routes yet, but
the first ones are coming (`/api/health` in #2). Before they ship, every API caller should be
required to identify itself with an `x-api-key` header, so that the rule exists from day one
instead of being retrofitted route by route.

This spec covers **presence only**: a request with any non-blank `x-api-key` value goes through.
The value is not compared with anything. **This is not authentication**: anyone can send
`x-api-key: anything` and get in. It only stops callers that send no key at all, and it fixes the
contract (header name, error response) that real key validation will build on later.

The health check (`/api/health`) stays open so that load balancers and uptime monitors, which
cannot send custom headers, keep working.

## Acceptance criteria

Missing key:

- Given a request to `/api/anything` with no `x-api-key` header, when it reaches the app, then the
  response has status 401, content type `application/json`, and body `{"error":"missing_api_key"}`.
- Given a request to `/api/anything` whose `x-api-key` header is empty or only whitespace, when it
  reaches the app, then the response is the same 401 as above.
- Given a request to `/api` (no trailing segment) with no `x-api-key` header, when it reaches the
  app, then the response is the same 401.
- Given a `POST` request to `/api/anything` with no `x-api-key` header, when it reaches the app,
  then the response is the same 401 (the rule applies to every HTTP method).

Key present:

- Given a request to `/api/anything` with `x-api-key: some-value`, when it reaches the app, then
  the proxy lets it through unchanged (the route answers as if there were no proxy; an unknown
  route answers 404).
- Given a request with the header spelled `X-API-Key: some-value`, when it reaches the app, then it
  is let through (header names are case-insensitive).

Health exemption:

- Given a request to exactly `/api/health` with no `x-api-key` header, when it reaches the app,
  then the proxy lets it through unchanged (with #2 merged, the route answers 200).
- Given a request to `/api/health?verbose=1` with no `x-api-key` header, when it reaches the app,
  then it is let through (the query string does not affect the exemption).
- Given a request to `/api/health/details` or `/api/healthz` with no `x-api-key` header, when it
  reaches the app, then the response is the 401 above (the exemption is the exact path only).

Outside `/api`:

- Given a request to `/` or any page, with or without `x-api-key`, when it reaches the app, then the
  proxy does not run and the page renders as before.
- Given a request to `/apidocs` (starts with the letters `api` but is not under `/api/`), when it
  reaches the app, then the proxy does not run.

## Out of scope

- Validating the key value against a secret, an environment variable or a key store. Follow-up
  ticket; it needs its own ADR (where keys live, rotation, how many keys).
- Per-key permissions, rate limiting, logging of rejected calls.
- CORS. A browser preflight (`OPTIONS`) does not carry custom headers, so it would get a 401. No
  browser client calls `/api` today; handle it when one does.
- Implementing `/api/health` itself (#2).
- Server Functions: they post to page routes, not to `/api/`, and are not covered by this rule.

## Test seams

- `proxy(request)` exported from `src/proxy.ts`: call it in Vitest with
  `new NextRequest('http://localhost/api/...', { headers })`.
  - Refused: assert `response.status === 401` and `await response.json()` equals
    `{ error: 'missing_api_key' }`.
  - Let through: assert the response is a pass-through (`response.headers.get('x-middleware-next')
    === '1'`, which is what `NextResponse.next()` sets), not a 401.
- `config.matcher` exported from `src/proxy.ts`: assert which URLs the proxy runs on with
  `unstable_doesMiddlewareMatch({ config, url })` from `next/experimental/testing/server`
  (`/api`, `/api/x` match; `/`, `/apidocs` do not). Experimental API: if a Next upgrade breaks it,
  replace these cases with a check against a running `next start`, do not drop them.
- Tests live in `src/proxy.test.ts`, default Vitest node environment, no new dependency.

## Users and journeys

- **API client (script, service, future frontend):** sends `x-api-key` on every `/api/` call. If it
  forgets, it gets a 401 with a machine-readable error code and can fix its configuration.
- **Uptime monitor / load balancer:** calls `GET /api/health` with no header and gets the health
  answer.
- **Site visitor:** browses pages; nothing changes for them.
- **Developer adding an API route:** gets the protection without doing anything. To add another
  open route, they edit the allowlist in `src/proxy.ts`, which is a visible, reviewed change.

## Design

One file, `src/proxy.ts`, using the Next.js 16 Proxy convention (the former `middleware`, renamed
in v16; docs in `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`).

- `export const config = { matcher: '/api/:path*' }`: a literal, so Next can analyse it at build
  time. Matches `/api` and everything below it; does not match `/apidocs`.
- `export function proxy(request: NextRequest)`:
  1. If `request.nextUrl.pathname` is in the allowlist (only `/api/health`), return
     `NextResponse.next()`.
  2. Read `request.headers.get('x-api-key')`. If it is `null` or blank after trimming, return
     `Response.json({ error: 'missing_api_key' }, { status: 401 })`.
  3. Otherwise return `NextResponse.next()`.
- The exemption is a check in code, not a negative lookahead in the matcher: easier to read, and
  directly unit-testable without the experimental matcher helper.

Public contract introduced (see ADR 0004): header name `x-api-key`; error status 401; error body
`{"error":"missing_api_key"}`. Clients will depend on these; changing them later is a breaking
change.

## Rollout and risks

- No API route exists yet, so no current caller breaks. Once merged, every new `/api/` route is
  protected by default.
- If #2 merges first, `/api/health` already works and keeps working; if this merges first,
  `/api/health` returns 404 until #2 lands (the proxy lets it through, there is just no route yet).
  Neither order blocks the other.
- **False sense of security:** presence-only checks are trivially bypassed. Anything sensitive
  behind `/api/` must wait for real key validation (follow-up) or check access in the route itself.
- **Trailing slash:** with the default `trailingSlash: false`, Next redirects `/api/health/` to
  `/api/health` before the proxy runs, so the exact-path exemption holds in production.
- **Silent loss of coverage:** a later change to `matcher` could stop the proxy running on some
  `/api/` paths. The matcher test cases guard against that.
- `src/proxy.*` is not in the `protected` list of `.claude/senior-mode.json` (only `middleware.*`
  is). See open questions.
- Rollback: delete `src/proxy.ts`; no data or schema involved.

## Open questions

- Should `proxy.*` and `src/proxy.*` be added to `protected` in `.claude/senior-mode.json`, like
  `middleware.*`? Recommended: yes, since this file now carries an access rule. That file is
  protected itself, so a human makes the change.
- Should key validation (compare against a secret from an environment variable) follow right
  after? Recommended: yes, as its own ticket with its own ADR, before any `/api/` route exposes
  non-public data.
