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

1. **Domain** — Set `NEXT_PUBLIC_SITE_URL` (e.g. `https://torqstudio.com`) so `robots.txt` and `sitemap.xml` use the correct base URL. In `src/app/layout.tsx`, update the `siteUrl` constant if needed.
2. **Social preview** — Add `public/og.png` (1200×630 px) for link previews on social and messaging apps.
3. **Contact** — Replace `hello@torqstudio.com` in footer, CTA, and legal pages with your real email.
4. **Legal** — Review and tailor `/privacy` and `/terms` content for your jurisdiction and practices.

### Trust & SEO

- Security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) are set in `next.config.ts`.
- Schema.org Organization JSON-LD is in the layout for search engines.
- `robots.txt` and `sitemap.xml` are generated automatically.

## Structure

- `src/app/` — Layout, metadata, home, privacy, terms, 404, robots, sitemap
- `src/components/` — Header, Hero, TrustBar, Services, WhyChooseUs, CaseStudies, Testimonials, CTA, Footer
