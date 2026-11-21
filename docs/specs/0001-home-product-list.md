---
id: 0001
title: The home page lists three products with their price
status: accepted
size: M
paths:
  - src/lib/products.ts
  - src/lib/products.test.ts
  - src/app/page.tsx
  - src/app/page.module.css
  - src/app/layout.tsx
adrs: []
issue: "#3"
---

# The home page lists three products with their price

## Problem

A visitor who opens the site today sees the Next.js starter page: logos, links to Vercel and the
Next.js docs, and the title "Create Next App". Nothing tells them what the shop sells or what it
costs. A first, fixed catalogue of three products gives the site its purpose and a base for the
price display work in #1.

## Acceptance criteria

Product data (`src/lib/products.ts`):

1. Given the product list, when it is read, then it holds exactly three products.
2. Given the product list, when ids are compared, then every id is unique.
3. Given the product list, when names are read, then every name is a non-empty string after trimming.
4. Given the product list, when prices are read, then every `priceCents` is a positive integer
   (`Number.isInteger(priceCents) && priceCents > 0`).

Home page (`/`):

5. Given a visitor on `/`, when the page loads, then it shows one level-1 heading naming the shop
   and no other level-1 heading.
6. Given a visitor on `/`, when the page loads, then the products appear as a list (`<ul>`) with one
   item (`<li>`) per product, in the order of the product list.
7. Given a product item, when it is read, then it shows the product name as a level-2 heading and
   its price exactly as `formatPrice(priceCents)` returns it (for example "12.34 €").
8. Given a visitor on `/`, when the page loads, then none of the starter content remains (Next.js
   and Vercel logos, "Deploy Now", "Documentation", "Templates", "Learning" links).
9. Given any page, when the browser tab or a search result shows its metadata, then the title and
   description name the shop instead of "Create Next App".

## Out of scope

- Prices in French locale ("12,34 €"): issue #1. The page only calls `formatPrice`, so #1 changes
  the display without touching this page.
- Product images, detail pages, cart, checkout, a database or an API for products.
- Component or end-to-end tests of the page: Vitest runs in the node environment without jsdom,
  and adding one is a new dependency this issue does not need.
- Deleting the unused starter assets in `public/` (`next.svg`, `vercel.svg`, ...): harmless, can go
  in a separate S cleanup.
- `/api/health` (#2) and the `x-api-key` check (#4).

## Test seams

- `src/lib/products.test.ts`, colocated like `src/lib/price.test.ts`: covers criteria 1 to 4 on the
  exported array. It does not assert formatted price strings, so #1 cannot break it.
- `formatPrice` is already covered by `src/lib/price.test.ts`; the page must not format prices
  itself (project rule: `formatPrice` is the only euro conversion).
- Criteria 5 to 9 are checked by review and by `npm run build` plus a look at `/` in `npm run dev`
  (headings and list visible in the browser accessibility tree). No automated page test in this
  issue (see Out of scope).

## Technical notes

- `products` is a `readonly` array of `{ id: string; name: string; priceCents: number }`, exported
  with its type from `src/lib/products.ts`. The `id` is the React `key`.
- `page.tsx` stays a Server Component (no `"use client"`), imports `products` and `formatPrice`.
- `page.module.css` keeps only the classes the new markup uses; starter-only classes are removed.
- `layout.tsx` keeps `lang="en"`; only `metadata.title` and `metadata.description` change.

## Open questions

- Shop name and the three product names and prices: not given by the issue. Recommended: the
  implementer picks neutral placeholders (for example "Sandbox Shop"; products at 1299, 2450 and
  499 cents, one of them under 10 € to show formatting of small amounts). Replaceable in one line.
