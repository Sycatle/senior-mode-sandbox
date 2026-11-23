# Architecture

<!-- How the system fits together, for a new teammate. Kept current by the `docs` skill after each merged pull request. Facts only: what is not known stays "To confirm". Decisions live in docs/adr/. -->

## Overview
To confirm: what the system does and who uses it, in a few sentences.

## Components
- Ping endpoint: `GET /api/ping`, a Next.js route handler in `src/app/api/ping/route.ts` (PR #16).

To confirm: the other main parts (services, packages, jobs, apps), one line each on what it does and where it lives.

## Data flow
- `GET /api/ping` answers `200` with `{"pong":true}`. It reads no input and touches no datastore (`src/app/api/ping/route.ts`).

To confirm: how the rest of the requests and data move through the components, from entry to storage.

## External services
To confirm: the datastores, providers and APIs the system depends on, and what each is used for.

## Decisions
Architecture decision records: [docs/adr](adr/).
