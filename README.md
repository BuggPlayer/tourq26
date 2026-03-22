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

### Trust & SEO

- Security headers in `next.config.ts` where configured.
- **Organization** + **WebSite** JSON-LD (no fake site search).
- **Home:** WebPage + ItemList (services).
- **Blog posts:** BlogPosting + BreadcrumbList; optional **author** per post in admin.
- **Breadcrumbs** on about, contact, blog, freebies, privacy, terms.
- **`robots.txt`:** allows public pages; **disallows `/admin` and `/api/`**.
- **`sitemap.xml`** built from Site URL + blog + freebies.
- **404** uses `noindex`.

## Structure

- `src/app/` — Layout, metadata, home, privacy, terms, 404, robots, sitemap
- `src/components/` — Header, Hero, TrustBar, Services, WhyChooseUs, CaseStudies, Testimonials, CTA, Footer
