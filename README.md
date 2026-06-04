# schaeffer-portfolio

A two-site portfolio built on Next.js + Payload CMS + Tailwind. Serves both **schaeffer.design** (Joshua Schaeffer's personal/contract portfolio) and **schaefferpractice.com** (the investor-focused Schaeffer Practice variant) from a single shared codebase with hostname-based multi-tenancy.

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15 (App Router) | RSC, image optimization, Vercel-native |
| CMS | Payload CMS 3 (self-hosted, inside this app) | Best-in-class admin, free, visual page builder |
| Database | Neon Postgres (free tier) | 0.5 GB storage, autoscales to zero |
| Image storage | Vercel Blob (free tier on Vercel Hobby) | One-click, official Payload integration |
| Styling | Tailwind CSS v4 | Fast iteration, CSS-driven theme tokens |
| Motion | motion (formerly Framer Motion) | Scroll-linked, view transitions |
| Hosting | Vercel Hobby (free) | One `git push` deploy, both domains on one project |

All free-tier for a portfolio's traffic.

## First-time setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Provision the database (Neon — free)

1. Sign up at https://neon.tech
2. Create a project (any region; pick closest to you)
3. Copy the **pooled connection string** from the dashboard
4. Paste it into `.env` as `DATABASE_URI`

### 3. Set up Vercel Blob storage

You'll do this after deploying to Vercel:

1. Deploy this repo to Vercel (see step 6 below)
2. In your Vercel project → **Storage** → **Create Database** → **Blob**
3. Vercel automatically injects `BLOB_READ_WRITE_TOKEN` into your project env

For local dev, copy the token from Vercel → Settings → Environment Variables and paste it into your local `.env`.

### 4. Create `.env`

```bash
cp .env.example .env
```

Fill in:

- `PAYLOAD_SECRET` — any long random string (`openssl rand -hex 32`)
- `DATABASE_URI` — the Neon connection string from step 2
- `BLOB_READ_WRITE_TOKEN` — from step 3 (can wait until first deploy)
- `NEXT_PUBLIC_SERVER_URL` — `http://localhost:3000` for dev

### 5. Run dev server

```bash
pnpm dev
```

- Frontend: http://localhost:3000
- Payload admin: http://localhost:3000/admin

On first visit to `/admin`, you'll create your admin user.

### 6. Deploy to Vercel

```bash
git init && git add . && git commit -m "Initial scaffold"
# create a new repo on GitHub, then:
git remote add origin git@github.com:yourusername/schaeffer-portfolio.git
git push -u origin main
```

In Vercel:

1. Import the GitHub repo
2. Add env vars: `PAYLOAD_SECRET`, `DATABASE_URI`, `NEXT_PUBLIC_SERVER_URL` (your production domain), `PAYLOAD_PUBLIC_SERVER_URL` (same)
3. Add a Vercel Blob store (Storage tab) — `BLOB_READ_WRITE_TOKEN` auto-injects
4. Deploy

### 7. Add domains

In Vercel project → **Settings → Domains**, add:

- `schaeffer.design`
- `www.schaeffer.design` (redirect to apex)
- `schaefferpractice.com`
- `www.schaefferpractice.com` (redirect to apex)

Both domains route to the same deployment. The middleware (`middleware.ts`) detects which one was requested and rewrites the request to an internal `/[brand]/…` path (`/personal/…` or `/practice/…`). The public URL stays clean, and the brand becomes part of the ISR cache key so the two sites never share a cached page.

Update DNS at your registrar to point both domains to Vercel.

## Working with the CMS

### Creating per-brand singletons

After deploy, you need one entry each for the three brand-scoped collections:

In `/admin`, create:

- **Settings** × 2 — one with `brand: personal`, one with `brand: practice`
- **Navigation** × 2 — same pattern
- **Footer** × 2 — same pattern

Then create your homepage Pages (slug `home`, one per brand).

### Adding a new page

1. `/admin` → Pages → Create New
2. Fill in slug, title, brand
3. In the `blocks` array, click `+ Add Block` to drop modules
4. Drag to reorder
5. Set status to Published

### Adding a new case study

1. `/admin` → Case Studies → Create New
2. Fill in the header fields (client, role, dates, outcome, hero image, metrics)
3. Toggle `featured` if it should appear in FeaturedWork blocks
4. In the Body tab, add blocks for the case study body
5. Publish

### Adding a new block type

Two-file change:

1. Create `blocks/MyBlock.ts` with the Payload schema
2. Create `components/blocks/MyBlockBlock.tsx` with the React renderer
3. Register both: add to `blocks/index.ts` (`allBlocks` array) and `components/BlockRenderer.tsx` (`blockComponents` map)
4. Restart dev server

## Multi-tenant testing

Test the practice site locally without registering a domain:

```
http://localhost:3000/?brand=practice
```

The middleware respects the `?brand=` query param in dev.

## Project structure

See `CLAUDE.md` for the full repo conventions and where to find things.

## Free-tier limits to watch

| Service | Free tier | What it covers |
|---|---|---|
| Vercel Hobby | 100 GB bandwidth/mo | Plenty for a portfolio |
| Neon | 0.5 GB storage, 191.9 compute hrs/mo | Portfolio-scale CMS |
| Vercel Blob | 0.5 GB storage, 1 GB bandwidth | ~50–100 optimized images |
| Cal.com | Free forever (personal plan) | Booking |
| Resend | 3k emails/mo | Contact form |

If image storage hits the limit, migrate to Cloudinary (25 GB free) by swapping the storage adapter in `payload.config.ts`.
