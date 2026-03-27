# Torq Studio — Website

Marketing site for **Torq Studio**, your trusted technology partner for the Middle East & Europe.

## Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Fonts:** DM Sans (body), Outfit (headings)

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build & production

```bash
npm run build
npm start
```

### Before going live

1. **Domain (canonical)** — In **Admin → Site & SEO**, set **Site URL** to your production origin (e.g. `https://torqstudio.com`). That value drives **canonical URLs**, **sitemap**, **robots.txt host**, and **metadataBase**. Optional: set `NEXT_PUBLIC_SITE_URL` to the same value for any client-only code.
2. **Social profiles** — In Site & SEO, add **X/Twitter handle** (without `@`) and **Social profile URLs** (LinkedIn, etc.) for Organization `sameAs` and Twitter meta tags.
3. **Social preview** — Default OG image: `src/app/opengraph-image.tsx`. Blog posts and freebies each have a **dynamic OG image** route.
4. **Contact** — Replace `hello@torqstudio.com` where needed; ensure **Vercel KV** (or writable `content/`) so the contact form saves submissions.
5. **Legal** — Review `/privacy` and `/terms` for your jurisdiction.
6. **WhatsApp (floating button)** — Set **`NEXT_PUBLIC_WHATSAPP_NUMBER`** to your WhatsApp Business / mobile number in **international format, digits only, no `+`** (example India: `919876543210`). If you use a **10-digit local** number, the app prepends **`NEXT_PUBLIC_WHATSAPP_PREFIX`** (defaults to **`91`**). Use `1` for US/Canada, `44` for UK, etc. Links use **`https://api.whatsapp.com/send`** (more reliable than `wa.me` with bad numbers). **`NEXT_PUBLIC_*` is applied at build time** — after changing env on Vercel, **redeploy**.
7. **Developer utilities** — **`/dev-tools`** hosts client-side helpers (SVG→CSS, JSON→CSV, CSS shadows). No API key required.
8. **YouTube playlist length** — **`/youtube-playlist-length`** totals watch time for public playlists via **YouTube Data API v3**. Set **`YOUTUBE_API_KEY`** in `.env.local` (see `docs/youtube-playlist-length.env.example`). Optional: **`NEXT_PUBLIC_PLAUSIBLE_DOMAIN`** for privacy-friendly analytics on that route only. The UI includes **pinned favorites** and **recent playlists** (local), **keyboard shortcuts** (`?`, `/`, Esc, Ctrl/⌘+Enter), **copy all visible titles**, **CSV export**, and **remembered playback speed + sort** in `localStorage`.

### Trust & SEO

- Security headers in `next.config.ts` where configured.
- **Organization** + **WebSite** JSON-LD (no fake site search).
- **Home:** WebPage + ItemList (services).
- **Blog posts:** BlogPosting + BreadcrumbList; optional **author** per post in admin.
- **Breadcrumbs** on about, contact, blog, freebies, privacy, terms.
- **`robots.txt`:** allows public pages; **disallows `/admin` and `/api/`**.
- **`sitemap.xml`** built from Site URL + blog + freebies + **dev-tools** (`/dev-tools` and each utility slug) + **`/youtube-playlist-length`**.
- **404** uses `noindex`.

## TorqStudio Interview Hub (`/hub`)

Full-stack interview preparation and hiring surface (candidates + companies), co-located with the marketing site.

### Features (high level)

- **Landing & navigation** — Hero, candidate vs hiring CTAs, sidebar with TorqStudio agency CTA + modal.
- **Candidate** — Filterable question bank (DSA / UI / quiz / frontend system design), Monaco editor, **Piston** runs (`/api/run`), graded submit (`/api/submit`) with optional **OpenAI** feedback, UI **iframe `srcDoc` preview**, **React Flow** system-design canvas, quizzes, preparation plans, progress stats.
- **Hiring** — Rule-based interview set generator + **PDF export** (`@react-pdf/renderer`).
- **Jobs & talent** — Job board API, talent pool opt-in with filters.
- **Mock interviews** — Complimentary Calendly embed during launch; paid checkout code path kept for later.
- **Community** — Per-question forums, static live-session copy (MVP).
- **Pricing / access** — **Launch: full hub is free** (`HUB_ALL_FREE_LAUNCH = true` in `src/lib/hub/usage.ts`). Stripe + tier checks are disabled until you flip that flag.
- **Auth** — **NextAuth.js** (credentials + optional Google/GitHub via env).
- **Ops** — **Admin → Feature flags** (plus env kill-switches) for maintenance, marketing sections, header links, and WhatsApp chip — see `docs/ADMIN-KV.md`.
- **Content** — Blog editor in admin: rich text, **Preview**, **Content score**, links, code blocks; public posts use sanitized HTML.

### Hub setup

1. **Environment** — Copy `.env.example` to `.env` and set at least:
   - `DATABASE_URL` — **MongoDB** (local `mongodb://127.0.0.1:27017/your_db` or Atlas `mongodb+srv://.../your_db?retryWrites=true&w=majority`). The path **must** include the database name.
   - `AUTH_SECRET` — `openssl rand -base64 32`
   - Optional: `OPENAI_API_KEY`, OAuth client IDs/secrets, Stripe keys (see `.env.example`).
2. **Database & seed** — Prisma uses **`db push`** for MongoDB (no SQL migrations folder in this setup).
   ```bash
   npx prisma db push
   npm run db:seed
   ```
3. **Run**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000/hub](http://localhost:3000/hub). Register at `/hub/register`, then sign in at `/hub/signin`.

### MongoDB (Atlas / self-hosted)

1. Create a cluster and database user; allow your app’s IP (or `0.0.0.0/0` for serverless hosts).
2. Use a connection string whose path is **`/your_database_name`** (not an empty path before `?`).
3. URL-encode special characters in the password.
4. Run `npx prisma db push` after schema changes; use `npm run db:seed` to load demo questions and tags.

### Stripe (INR) — optional (when not all-free)

While `HUB_ALL_FREE_LAUNCH` is `true`, users are not charged; you can skip Stripe in `.env`.

1. Create **Products / Prices** in [Stripe Dashboard](https://dashboard.stripe.com) in **INR** (recurring for Premium, one-time for mock interview).
2. Put Price IDs in `STRIPE_PRICE_MONTHLY_INR`, `STRIPE_PRICE_YEARLY_INR`, `STRIPE_PRICE_MOCK_INR`.
3. Add webhook endpoint pointing to `https://your-domain.com/api/webhooks/stripe` for `checkout.session.completed`; use signing secret as `STRIPE_WEBHOOK_SECRET`.
4. Successful subscription checkout sets `subscriptionTier` to `premium` on the user (see `src/app/api/webhooks/stripe/route.ts`).

### Vercel deployment (Interview Hub)

1. **Project** — Import the repo; **Framework Preset**: Next.js.
2. **Env vars** — Add all variables from `.env.example` in Vercel **Settings → Environment Variables** (Production + Preview as needed). Set `AUTH_URL` to `https://your-domain.com` if redirects misbehave.
3. **Database** — Use [MongoDB Atlas](https://www.mongodb.com/atlas) (or any MongoDB reachable from Vercel); set `DATABASE_URL` to a `mongodb` or `mongodb+srv` URL with a database name in the path. Run **`npx prisma db push`** once against production (locally or in a release job) whenever the Prisma schema changes; the default build runs `prisma generate` only.
4. **Build** — Default `npm run build` runs `prisma generate` via the `build` script.
5. **Stripe webhook** — In Stripe, add the production webhook URL; redeploy after adding `STRIPE_WEBHOOK_SECRET`.
6. **OAuth** — Add production callback URLs in Google/GitHub consoles: `https://your-domain.com/api/auth/callback/google` (and `/github`).

### API routes (hub)

| Route | Purpose |
|--------|---------|
| `POST /api/auth/[...nextauth]` | NextAuth |
| `POST /api/register` | Email/password signup |
| `GET /api/questions` | Filtered question list |
| `GET /api/questions/[id]` | Question detail + starters |
| `POST /api/submit` | Grade code / UI / diagram |
| `POST /api/run` | Piston-only run |
| `GET /api/quiz/random`, `GET /api/quiz/[id]`, `POST /api/quiz/answer` | Quizzes |
| `GET /api/plans`, `POST /api/plans/enroll` | Preparation plans |
| `GET,POST /api/jobs` | Job board |
| `GET,POST /api/talent` | Talent pool |
| `POST /api/checkout` | Stripe Checkout session |
| `POST /api/webhooks/stripe` | Stripe events |
| `GET,POST /api/forum`, `POST /api/forum/reply` | Discussions |
| `POST /api/youtube/playlist` | Server-side playlist analysis (requires `YOUTUBE_API_KEY`) |

### Deploying the YouTube playlist tool (Vercel)

1. In [Google Cloud Console](https://console.cloud.google.com/), enable **YouTube Data API v3** and create an API key (restrict by HTTP referrer or IP if possible).
2. In the Vercel project → **Settings → Environment Variables**, add **`YOUTUBE_API_KEY`** for Production (and Preview if needed). Redeploy so the serverless function picks it up.
3. Optional: increase **Function max duration** for `/api/youtube/playlist` on Pro plans if you expect playlists with many hundreds of items (the route sets `maxDuration = 60` where the platform allows it).
4. **`/youtube-playlist-length`** is static HTML with a client UI; the key never ships to the browser.

## Structure

- `src/app/` — Layout, metadata, home, privacy, terms, **dev-tools** (`/dev-tools/**`), **`youtube-playlist-length`**, **hub** (`/hub/**`), 404, robots, sitemap
- `src/components/` — Header, Hero, …, **`hub/*`** (Interview Hub UI)
- `prisma/` — Schema + seed data for the hub
