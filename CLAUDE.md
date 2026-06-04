# CLAUDE.md — Conventions for this repo

This file is for future Claude sessions (or any LLM pair-programmer) working in this codebase. Read this first.

## What this project is

A two-site portfolio for Joshua Schaeffer. One Next.js app, one Payload CMS database, two domains:

- **schaeffer.design** → primary, "Joshua Schaeffer — Product + Brand Design Lead". For founders, hiring managers, agencies, recruiters.
- **schaefferpractice.com** → secondary, "Schaeffer Practice". A tonally-tuned variant for family offices, fintech, and investment firms.

The codebase serves both via hostname-based multi-tenancy. See `middleware.ts` and `lib/brand.ts`.

## Architectural rules

1. **Never duplicate content across brands.** Use the `brand` field on Pages and CaseStudies to control visibility.
2. **Per-brand singletons** (`Settings`, `Navigation`, `Footer`) are collections with a unique `brand` value. Two entries per collection, one per brand.
3. **All page content lives in Payload, not in code.** No hardcoded copy in the public-facing pages. The only exception is the Payload admin itself.
4. **Block schemas live in `/blocks`. Block renderers live in `/components/blocks`.** Add a new block type by updating both, then registering in `blocks/index.ts` and `components/BlockRenderer.tsx`.
5. **Server components by default.** Use `'use client'` only when needed (motion, interactivity).
6. **Brand comes from the `[brand]` route segment, not a header.** `middleware.ts` rewrites each request (by hostname, or `?brand=` in dev) to an internal `/personal/...` or `/practice/...` path — the public URL stays clean and the brand becomes part of the ISR cache key. Server components read `params.brand` (via `asBrand()`) and pass it to the `lib/queries.ts` helpers.

## Stack reference

- **Next.js 15 App Router**
- **Payload CMS 3** — runs in the same app under `(payload)` route group. Admin at `/admin`, REST API at `/api/[...slug]`, GraphQL at `/api/graphql`.
- **TypeScript** — strict mode. Use the auto-generated `payload-types.ts` once you run `pnpm payload generate:types`.
- **Tailwind CSS v4** — theme tokens in `app/globals.css` via `@theme`. No `tailwind.config.ts` needed for v4.
- **Postgres adapter** for Payload. Neon free tier.
- **Vercel Blob** for media storage.
- **motion / Framer Motion** for animations. Import from `motion/react`.

## Directory map

```
app/
  (frontend)/              ← public site
    [[...slug]]/page.tsx   ← dynamic Page renderer (catch-all)
    work/[slug]/page.tsx   ← case study renderer
    layout.tsx             ← frontend layout with Nav + Footer
  (payload)/               ← Payload admin
    admin/                 ← Payload admin UI
    api/                   ← Payload REST + GraphQL
    layout.tsx             ← Payload root layout
    custom.scss            ← admin style overrides
  globals.css              ← Tailwind + theme tokens

collections/               ← Payload collection schemas
  Pages.ts                 ← the page builder (uses blocks)
  CaseStudies.ts           ← case studies (header + blocks body)
  Logos.ts                 ← reusable client logos
  Testimonials.ts          ← reusable testimonials
  Tags.ts
  Media.ts                 ← Vercel Blob-backed uploads
  Settings.ts              ← per-brand: 1 personal, 1 practice
  Navigation.ts            ← per-brand
  Footer.ts                ← per-brand
  Users.ts                 ← admin accounts

blocks/                    ← Payload block schemas (12 blocks)
  Hero.ts, TextSection.ts, Image.ts, ImageGrid.ts, Spacer.ts,
  FeaturedWork.ts, CaseStudyGrid.ts, LogoWall.ts,
  LifecycleSection.ts, Capabilities.ts, ValuesBlock.ts, CTA.ts
  index.ts                 ← exports allBlocks array

components/
  blocks/                  ← React renderers for each block type
  BlockRenderer.tsx        ← maps block.blockType → component
  Nav.tsx, Footer.tsx

fields/                    ← reusable Payload field configs
  brandField.ts            ← shared brand multi-select
  seoGroup.ts              ← shared SEO group

lib/
  brand.ts                 ← brand detection, hostname mapping
  payload.ts               ← Payload client singleton
  queries.ts               ← data fetching helpers
  utils.ts                 ← cn() class helper

middleware.ts              ← hostname → rewrite to /[brand]/… path
payload.config.ts          ← Payload main config
```

## Block library

15 blocks total (see `blocks/index.ts`):

**Layout & content (12 core):**

| Block | Use |
|---|---|
| `hero` | Top-of-page hero with headline, subhead, CTA, optional background |
| `textSection` | Rich text with optional eyebrow and heading |
| `image` | Single image with caption |
| `imageGrid` | 2/3/4-column grid of images |
| `spacer` | Vertical whitespace |
| `featuredWork` | 1–3 large case study cards (with 3D tilt hover built in) |
| `caseStudyGrid` | 4–8 case study tiles |
| `logoWall` | Quiet credibility row |
| `lifecycleSection` | One phase of "Selected Experience" with logos + artifacts |
| `capabilities` | Inline / pills / grid list of capabilities |
| `values` | 2–4 values with descriptions |
| `cta` | Centered call to action |

**Advanced animation (3):**

| Block | Use |
|---|---|
| `motionImage` | Single image with skew, four shadow modes (including drop-shadow that follows PNG transparency), mask-to-another-image clipping, and four hover behaviors |
| `lottie` | Lottie / vector animation player. Dynamically imported so it never hits the main bundle. |
| `marqueeLogos` | Infinite scrolling logo strip |

To add more: see "Adding a new block type" in README.md.

## Loading & performance

See **`LOADING.md`** for the full reference. Seven techniques layered:

1. **Static + ISR** — every page pre-built, regenerated on-demand
2. **Aggressive prefetching** — Next.js auto-prefetches in-view links
3. **Speculation Rules** — Chrome/Edge prerender pages on 200ms hover
4. **View Transitions API** — browser-native cross-route fade
5. **Persistent layout** — nav/footer never re-mount across routes
6. **Streaming + Suspense** — loading.tsx instant skeleton
7. **Blur placeholders + priority** — images load smoothly with no CLS

Critical files:

- `next.config.ts` — enables View Transitions, image optimization, cache headers
- `app/(frontend)/loading.tsx` — instant skeleton during route load
- `app/(frontend)/error.tsx` / `not-found.tsx` — graceful error states
- `components/loading/SpeculationRules.tsx` — Chrome prerender hints
- `components/loading/PageTransition.tsx` — View Transition CSS hook
- `lib/blurPlaceholder.ts` — convert Payload media to Image props with LQIP
- `app/api/revalidate/route.ts` — on-demand ISR endpoint
- `hooks/revalidate.ts` — Payload hooks that call /api/revalidate on content change

## Animation system

See **`ANIMATIONS.md`** for the full reference. Quick summary:

- **`components/animation/SmoothScroll.tsx`** — Lenis-powered smooth scroll, mounted in layout
- **`components/animation/Reveal.tsx`** — wrap any element for scroll-fade-in
- **`components/animation/MotionImage.tsx`** — skew/shadow/clip/hover image component
- **`components/animation/Tilt3D.tsx`** — cursor-tracked 3D card hover (no Three.js needed)
- **`components/animation/LottieAnimation.tsx`** — dynamically loaded Lottie player
- **`components/animation/Marquee.tsx`** — infinite horizontal scroll wrapper

**All primitives respect `prefers-reduced-motion` automatically.** Don't bypass this.

## Common tasks

### Generate Payload TypeScript types

After changing any schema:

```bash
pnpm payload generate:types
```

This writes `payload-types.ts` with strict types for every collection and block.

### Generate the import map (after adding custom admin components)

```bash
pnpm payload generate:importmap
```

### Test the practice brand locally

```
http://localhost:3000/?brand=practice
```

### Add a custom hero animation

Replace the `{/* TODO */}` placeholder in `components/blocks/HeroBlock.tsx` (the `background === 'animation'` branch) with the custom React animation component.

## Brand & voice

- **schaeffer.design (personal):** light theme by default. Headline: "Product + Brand Design Lead building high-trust digital experiences." Confident, modern, sharp.
- **schaefferpractice.com (practice):** dark theme via `[data-brand="practice"]` selector in globals.css. Headline: "Design for investment firms." Premium, restrained, operator-coded.

## Performance budget (non-negotiable)

| Metric | Target |
|---|---|
| Lighthouse Performance (mobile) | ≥ 95 |
| Largest Contentful Paint (mobile) | < 2.0s |
| Cumulative Layout Shift | < 0.05 |
| Interaction to Next Paint | < 200ms |
| Main bundle (gzipped) | < 150KB |

How we hit these: self-hosted Inter via `next/font/google`, all images go through `next/image` with explicit `sizes`, Lottie / heavy libraries dynamically imported, server components by default, motion runs on requestAnimationFrame.

## Responsive

- **Mobile-first.** Default styles target ~375px. Breakpoints add complexity for larger.
- **Three real breakpoints:** mobile (default), `md:` (768px tablet), `lg:` (1024px desktop). Don't overuse `sm:` / `xl:` / `2xl:`.
- **Touch targets ≥ 44px** on every interactive element.
- **`sizes` prop on every `next/image`.** Required for the browser to pick the right variant.
- **Test on a real phone**, not just dev tools (iPhone Safari is the canonical test).
- **Hide nothing critical on mobile** — hero, logo wall, primary CTA, contact link must all be reachable without horizontal scroll.

## Anti-patterns

- ❌ Hardcoding text in components. Always go through Payload.
- ❌ Duplicating case study content across brands.
- ❌ Using `'use client'` unnecessarily.
- ❌ Adding more than 12–15 block types without consolidating similar ones.
- ❌ Inline CSS files. All styling is Tailwind classes.
- ❌ Skipping the `brand` field on new content.
- ❌ Mocking the database in tests — point at a separate test schema if you need integration tests.

## Open work (as of scaffold)

These are stubs or pending in the scaffold:

- [ ] `components/blocks/HeroBlock.tsx` — animation background is a placeholder. Joshua designs the process animation.
- [ ] All block renderers — visually functional but not designed. Treat as wireframes to art-direct against.
- [ ] No seed script yet — populate content via `/admin` after first deploy.
- [ ] Practice dark theme — basic CSS variables set; full visual tuning happens in Phase 3.

## Reference docs (in `../`)

These live in the parent `Claude Site/` folder:

- `Portfolio-Strategy.md` — overall strategy, positioning, audiences, case study briefs
- `Portfolio-Todo.md` — phased to-do list
- `Portfolio-CMS-Plan.md` — full CMS architecture rationale
- `Portfolio-GPT-Chat.md` — reference conversation
