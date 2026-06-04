# Loading & Performance Strategy

This codebase implements the 2026 state of the art for making a content site feel like a native app. Every URL is its own page (so you can share/bookmark them), but navigations are essentially instant, content arrives in priority order, and transitions are smooth.

This doc explains the seven techniques layered together and how they cooperate.

## TL;DR — what makes it feel like an app

1. **Static-first (ISR).** Every page and case study is pre-built at deploy and served from CDN. First byte is milliseconds.
2. **Aggressive prefetching.** Next.js auto-prefetches links in view. When you hover, the full next page is already downloaded.
3. **Speculation Rules (Chrome/Edge).** Goes beyond prefetch — actually *prerenders* the next page invisibly. Click feels instant because the page is already running.
4. **View Transitions API.** Browser-native cross-fade between routes. No JavaScript animation library needed; runs on the compositor thread.
5. **Persistent layout.** Nav and footer never re-mount across page changes — only the content swaps.
6. **Streaming + Suspense.** When dynamic content is needed, it streams in piece by piece instead of blocking the whole page.
7. **Blur placeholders + priority hints.** Above-the-fold images preload at high priority; everything else lazy-loads with a blurred preview.

Combined: a Linear-style "URL changes but the page just appears" feel.

---

## 1. Static Generation + ISR

The single biggest factor in perceived speed. Every page is pre-rendered at build time, then regenerated *in the background* whenever content changes.

### What's wired up

- **`generateStaticParams()`** in `app/(frontend)/[[...slug]]/page.tsx` and `app/(frontend)/work/[slug]/page.tsx` — at build time, Next.js queries Payload for every published page slug and pre-renders each one as static HTML.
- **`export const revalidate = 3600`** — if no on-demand revalidation hits, pages refresh themselves every hour. Belt-and-suspenders.
- **On-demand revalidation** via `/api/revalidate/route.ts` + the `hooks/revalidate.ts` Payload hooks. When you save a Page or Case Study in the admin, Payload calls the revalidate endpoint, which calls `revalidatePath()` for that route. The CDN evicts and the next request gets the fresh content. Cycle is usually under 5 seconds.

### Result

Users hitting any URL — direct, from search, from a tweet — get HTML from the CDN edge. Time to first byte is under 100ms globally. They never wait on the database.

---

## 2. Aggressive Prefetching

Next.js automatically prefetches the JavaScript and data for any `<Link>` component in view.

### What's wired up

- The default behavior is on: every `<Link>` Next.js renders in the viewport triggers a background fetch of the destination page's RSC payload.
- This applies to nav links (`<Nav>`), case study cards (`<FeaturedWorkBlock>`, `<CaseStudyGridBlock>`), CTAs — everywhere.
- Hover prefetching is automatic too — even links scrolled off-screen prefetch the moment you point at them.

### Result

By the time the user clicks, the data and code for the destination is sitting in memory. The click is just a render.

---

## 3. Speculation Rules API

The next layer above prefetching. Tells Chrome and Edge to *prerender the entire page* in a hidden background tab when the user shows intent.

### What's wired up

- `components/loading/SpeculationRules.tsx` injects a `<script type="speculationrules">` into `<head>`.
- Eagerness is **"moderate"** for prerender (kicks in after 200ms hover) and **"eager"** for prefetch (kicks in as soon as the link enters the viewport).
- Excludes `/admin/*` and `/api/*` paths.
- Excludes links marked `[data-no-prerender]` if you ever need to opt out.

### Result

On Chrome/Edge (~70% of users), clicking a prerendered link is **literally** instant — the page is already running in a background tab and just swaps to foreground. Firefox/Safari silently ignore the tag and fall back to standard navigation (which is still fast thanks to prefetching).

### Why "moderate" instead of "eager"?

Eager prerendering on hover (10ms) can rack up bandwidth and CPU on long lists. Moderate (200ms hover) is a good balance for a portfolio — only triggers when the user looks like they're actually about to click.

---

## 4. View Transitions API

The cross-fade between pages. Browser-native, GPU-accelerated, runs on the compositor — doesn't block JS at all.

### What's wired up

- `next.config.ts` enables `experimental.viewTransition: true`
- `app/globals.css` defines the keyframes: fast 150ms fade-out, gentler 280ms fade-in with a slight upward translate
- `@media (prefers-reduced-motion)` disables the transition for users who request it
- `components/loading/PageTransition.tsx` adds a body attribute that any view-transition-named element can hook into for morphing

### Result

Page-to-page navigations feel like a single SPA, not separate page loads. Quoting Chrome's docs: the user sees old content leave quickly so it doesn't compete for attention, and new content arriving gently so they have time to register it.

### Going further: morphing specific elements

You can name elements to morph across routes (e.g., a case study card on the homepage that "grows" into the hero on the case study page). Add `view-transition-name: case-study-hero` to both elements in CSS, and the browser auto-animates position/size/opacity between them. Worth implementing once Phase 1 case studies are designed.

---

## 5. Persistent Layout

Next.js App Router keeps `layout.tsx` mounted across route changes — only the page content re-renders.

### What's wired up

- `app/(frontend)/layout.tsx` defines `<Nav>`, `<Footer>`, `<SmoothScroll>`, etc.
- These never remount during navigation. The Lenis scroll instance, the speculation rules script, the brand context — all persistent.
- Only the `{children}` slot swaps.

### Result

No flash of nav reloading. The site feels like a single app, not a series of full-page loads.

---

## 6. Streaming + Suspense

When something *is* dynamic (e.g., a future search page, contact form state), it streams in instead of blocking the page.

### What's wired up

- `app/(frontend)/loading.tsx` — global loading boundary. Shows a quiet pulse skeleton instantly while a route is being prepared.
- `app/(frontend)/error.tsx` — error boundary with retry. Catches any runtime errors gracefully.
- `app/(frontend)/not-found.tsx` — branded 404. Replaces the default Next.js 404.
- Server components fetch in parallel via `Promise.all()` (see `layout.tsx`).

### Result

A user never sees a blank screen waiting. Either the page is already prerendered (and instant), or they see the skeleton instantly while it streams in.

---

## 7. Image Loading

Images are usually the biggest payload on a portfolio. Every one is optimized.

### What's wired up

- **`next/image` everywhere.** Never plain `<img>`.
- **Vercel image CDN** with AVIF and WebP serving — automatic format negotiation per browser.
- **Multiple sizes per image** — Payload's Media collection (in `collections/Media.ts`) generates `thumbnail`, `card`, `feature`, and `hero` variants on upload.
- **Blur placeholders** — `lib/blurPlaceholder.ts` uses the 400px thumbnail as a low-quality preview that's embedded inline and blurs out as the real image loads.
- **`priority` on above-the-fold images only** — hero images get `priority: true`, everything else lazy-loads on intersection.
- **`sizes` prop on every `<Image>`** — tells the browser which variant to request based on viewport.
- **`fetchPriority="high"`** on LCP elements (Next.js sets this automatically when `priority` is true).

### Result

Hero images appear under 1 second on mobile. Below-the-fold images blur in smoothly as you scroll, with zero layout shift.

---

## How they cooperate

The seven techniques are designed to layer:

1. User hits a URL. **Static + ISR** means the HTML is already at the edge — under 100ms to first byte.
2. The page renders **with persistent layout** — nav, footer, fonts, theme tokens are all already loaded if the user has been here before.
3. **Hero image** loads with `priority` + blur placeholder. User sees content within 500ms of click.
4. **Prefetching** silently downloads everything the user might click next.
5. User hovers a case study card for 200ms. **Speculation Rules** prerenders the case study in a hidden tab.
6. User clicks. **View Transitions API** cross-fades into the new page. The prerendered case study is already running — the click is just a swap.
7. New page mounts. **Persistent layout** means nav/footer don't reload — only the `{children}` content swaps.

Every interaction is either instant or feels instant. The URL changes (so it's bookmarkable, shareable, SEO-able), but the experience is single-page-app fast.

---

## Performance budget

| Metric | Target | Why |
|---|---|---|
| Lighthouse Performance (mobile) | ≥ 95 | "Excellent" tier |
| Time to First Byte | < 200ms globally | CDN edge serving |
| Largest Contentful Paint | < 2.0s mobile | Hero image with priority |
| Cumulative Layout Shift | < 0.05 | Explicit image dimensions |
| Interaction to Next Paint | < 200ms | Server components + RSC payload |
| Main JS bundle (gzipped) | < 150KB | Dynamic imports for heavy libs |

Run `pnpm build && pnpm start` then a Lighthouse audit before every release. Vercel auto-runs this on PRs.

---

## What we deliberately did NOT do

Some "advanced" techniques are net-negative for a portfolio. Skipped:

- **PWA / Service Worker.** Adds ~30KB JS, complex cache-invalidation, and no real value for a portfolio site that ISR already serves from the edge.
- **`unstable_after()` and React Server Actions everywhere.** Overkill — your portfolio doesn't have heavy server-mutating workflows.
- **Custom code-splitting boundaries.** Next.js auto-splits per route. Don't fight it.
- **Heavy state management (Redux, Zustand).** No app state to manage. Everything is RSC + URL.
- **Manual cache headers on the API.** Vercel handles this; over-configuring causes more bugs than it solves.

---

## How to verify it's working

After first deploy:

### Check that pages are static
```bash
pnpm build
# Look for ƒ (Dynamic) vs ○ (Static) markers in the output
# Pages and Case Studies should be ○ (Static) or ● (SSG)
```

### Check Speculation Rules in Chrome DevTools
1. Open Chrome DevTools → Application tab → Background services → Speculative loads
2. Hover any link for 200ms
3. You'll see "Prerendered" status if it's working

### Check on-demand revalidation
1. Edit a page in `/admin`, save
2. Within ~5 seconds, the public URL reflects the change
3. If not, check the Vercel function logs for `/api/revalidate` — should see the POST

### Check View Transitions
1. Chrome DevTools → Rendering → Emulate vision deficiencies → set to none, then watch a navigation
2. You should see a quick cross-fade

### Check blur placeholders
1. Throttle to Slow 3G in DevTools Network
2. Refresh a page with images
3. You should see blurred low-quality versions instantly, sharpening as the full images load

---

## Cost on the free tier

Important: all of this stays within Vercel Hobby + Neon + Vercel Blob free tiers because:

- ISR runs at deploy time + on-demand only, not per-request
- Static pages are served from CDN edge — no compute charges
- Speculation Rules and View Transitions are browser-native, no JS bundle cost
- Prefetching is bandwidth-amortized — Next.js sends RSC payloads (small) not full HTML

For a portfolio with thousands of monthly visitors, expected monthly costs: **$0**.
