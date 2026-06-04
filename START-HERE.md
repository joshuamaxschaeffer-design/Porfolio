# START HERE — Getting the site running

This is the walkthrough from "scaffold exists" to "live site at localhost:3000". Roughly **45 minutes** if you've never set up Next.js + Postgres before, **15 minutes** if you have.

Most steps require *your* accounts and *your* machine, so I can't do them for you — but I've prepared everything I can.

---

## Status: what's already done

- ✅ Full repo scaffold (88 files: Next.js + Payload + Tailwind + animations + loading stack)
- ✅ `.env` file with a real, randomly-generated `PAYLOAD_SECRET`
- ✅ `setup.sh` script that automates install + type generation
- ✅ All four reference docs in the parent folder (`Portfolio-Strategy.md`, etc.) plus this repo's `README.md`, `CLAUDE.md`, `ANIMATIONS.md`, `LOADING.md`

## What you need to do — checklist

### Step 1 — Move the project out of Dropbox (~30 seconds)

**Important:** node_modules contains tens of thousands of files. If you `pnpm install` inside Dropbox, Dropbox will try to sync every one of them. Move first, install second.

```bash
# In a Terminal:
mkdir -p ~/code
mv ~/Dropbox/_Design\ Portfolio/Claude\ Site/schaeffer-portfolio ~/code/
cd ~/code/schaeffer-portfolio
```

(Adjust paths if your Dropbox is in a different location. The "code" folder is just a convention — anywhere outside iCloud/Dropbox/Google Drive works.)

### Step 2 — Sign up for Neon and get a database URL (~3 minutes)

1. Go to **https://neon.tech** and sign up (GitHub login works, free tier is plenty)
2. Click **"Create project"**. Region: pick whichever is closest to you (US-West if you're West Coast, US-East otherwise)
3. Skip the schema setup screen — Payload will create tables itself
4. On the project dashboard, find **"Connection string"** → switch the toggle to **"Pooled connection"** → click **Copy**
5. Open `.env` in this repo (the file already exists, with your PAYLOAD_SECRET pre-filled)
6. Find the `DATABASE_URI=` line and paste your connection string after the `=`. It should look like:
   ```
   DATABASE_URI=postgresql://user:abc123@ep-something-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
7. Save the file

### Step 3 — Install Node.js if you don't have it (~3 minutes, skip if you do)

Check with:

```bash
node --version
```

If it says `v20.x.x` or higher, you're good. If not, install from **https://nodejs.org** (LTS version).

### Step 4 — Run the setup script (~3 minutes)

```bash
chmod +x setup.sh
./setup.sh
```

This installs all dependencies (~600 packages, takes 2–3 min), generates Payload TypeScript types, and tells you when it's done.

If you get a "pnpm: command not found" error, the script will install it for you automatically.

### Step 5 — Start the dev server

```bash
pnpm dev
```

Then open two tabs:

- **http://localhost:3000** — the frontend (will be empty since no content exists yet — you'll see a "404 — Couldn't find that page" because there's no home Page in the CMS yet)
- **http://localhost:3000/admin** — the Payload admin

### Step 6 — Create your admin user

The first visit to `/admin` shows a "Create your first user" screen. Fill it in:

- Email: any (recommend `josh@schaeffer.design` even before that domain is set up)
- Password: pick something good
- Name: Joshua

You're now logged into the CMS.

### Step 7 — Set up the per-brand singletons (~5 minutes)

In the admin, create one entry for each:

#### Settings → New
- Brand: **Personal (schaeffer.design)**
- Site name: **Joshua Schaeffer**
- Tagline: (e.g., "Product + Brand Design Lead")
- Contact email: your email
- Save

Repeat with Brand: **Practice (schaefferpractice.com)**, Site name: **Schaeffer Practice**.

#### Navigation → New
- Brand: **Personal**
- Items: add (Work / Home, About / Home, Contact / Home — leave the page references blank for now, you'll wire them up after creating pages)
- Save

Repeat for Practice.

#### Footer → New
- Brand: **Personal**, copyright text: `© 2026 Joshua Schaeffer`
- Save

Repeat for Practice.

### Step 8 — Create your first page (~1 minute)

#### Pages → New
- Title: **Home**
- Slug: **home**
- Brand: **Personal** (you can add Practice too if you want both to use the same homepage for now)
- Status: **Published**
- Blocks: click **+ Add Block** → **Hero**. Fill in:
  - Headline: `Product + Brand Design Lead building high-trust digital experiences.`
  - Subhead: `End-to-end product systems across fintech, enterprise, and consumer platforms.`
  - CTA label: `View Work`
  - CTA URL: `/work`
- Save

Now refresh **http://localhost:3000** — your hero should appear.

### Step 9 — Add a logo (testing the animation/image pipeline)

#### Logos → New
- Name: **Samsung**
- Image: upload your Samsung logo (any PNG/SVG)
- Industry: Enterprise
- Save

Then back on your Home page, add a **Logo Wall** block, select Samsung, save. Refresh and you'll see your first logo wall.

### Step 10 — You're now in the iteration loop

From here, everything you do is:

1. Edit content in the admin → see it on the site
2. Pair with Claude+Opus in your code editor when you want to:
   - Design a block (style the React renderer in `components/blocks/`)
   - Add a new block type
   - Tune the theme
   - Build the custom hero animation
   - Add the Schaeffer Practice variant (Phase 3)

---

## What about deploying to Vercel?

That comes once Phase 1 content exists locally. Roughly:

1. `git init`, push to a GitHub repo
2. Import the repo to Vercel
3. Add env vars to Vercel: `PAYLOAD_SECRET`, `DATABASE_URI`, `NEXT_PUBLIC_SERVER_URL` (your production URL)
4. Create a Vercel Blob store from the Storage tab — `BLOB_READ_WRITE_TOKEN` injects automatically
5. Attach domains: `schaeffer.design` (and later `schaefferpractice.com`)
6. Update DNS at your registrar

See README.md → "Deploy to Vercel" for the full sequence.

---

## Troubleshooting

**"pnpm install fails with peer dependency errors"**
Run `pnpm install --shamefully-hoist` instead. Common with cutting-edge React versions.

**"Can't connect to database"**
Double-check the `DATABASE_URI` in `.env`. Make sure it's the **pooled** connection (has `-pooler` in the hostname). Try copying it from Neon again.

**"Payload admin shows a blank page"**
You probably skipped `pnpm payload generate:importmap`. Run it now:
```bash
pnpm payload generate:importmap
```
Then restart `pnpm dev`.

**"Images don't upload locally"**
You don't have `BLOB_READ_WRITE_TOKEN` yet. That's normal until you deploy to Vercel. Everything else works — you just can't upload media yet. Once you deploy and add a Blob store on Vercel, copy the token into `.env` locally too.

**"Site looks completely unstyled"**
Check that `app/globals.css` is being imported by `app/(frontend)/layout.tsx`. The import line is `import '../globals.css'` at the top.

---

## What to ask Claude+Opus first

Once you're running:

1. **"Help me design the Hero block"** — open `components/blocks/HeroBlock.tsx` in your editor and pair on visual treatment
2. **"Build the process animation"** — design the white/black thin-line wireframe animation as a custom React component, hook it into Hero's "animation" background option
3. **"Add the Wingstop case study schema"** — generate the case study with Claude's help
4. **"Style the Tilt3D shine effect"** — fine-tune the existing 3D hover

Reference `CLAUDE.md` in this repo — it'll keep Claude consistent across sessions.

---

## Anything else I should worry about?

- **Free-tier costs:** Vercel Hobby, Neon free, and Vercel Blob free cover everything for a portfolio. Expected monthly bill: **$0**.
- **Backups:** Neon does point-in-time recovery automatically on the free tier. Your CMS data is safe.
- **Dropbox sync:** *Don't* put node_modules in Dropbox. Step 1 above moves the project out first to avoid this.
- **`payload-types.ts`:** This file is auto-generated by `pnpm payload generate:types` after you make schema changes. It's committed to git so other tools can read it.

Good luck — should be a smooth ride from here.
