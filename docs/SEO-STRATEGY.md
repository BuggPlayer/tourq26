# Torq Studio — SEO strategy & checklist

Use this as your ongoing SEO playbook to rank better and keep technical SEO healthy.

---

## What’s already in place (technical)

- **Sitemap** — `src/app/sitemap.ts`  
  - Home, `/privacy`, `/terms` with correct priorities and change frequencies.  
  - Served at: `https://torqstudio.com/sitemap.xml`

- **Robots** — `src/app/robots.ts`  
  - Allow all crawlers, no disallow rules, `sitemap` and `host` set.  
  - Served at: `https://torqstudio.com/robots.txt`

- **Metadata (root)** — `src/app/layout.tsx`  
  - Title template, meta description, keywords, authors, robots.  
  - Open Graph and Twitter Card (title, description, image).  
  - Canonical for homepage.

- **Per-page SEO**  
  - Privacy & Terms: unique title, description, canonical, Open Graph, robots.

- **Structured data (JSON-LD)**  
  - `Organization` and `WebSite` (with `potentialAction` for search).  
  - Rendered in root layout.

- **OG/Twitter image**  
  - Dynamic `opengraph-image` (no static `og.png` required).  
  - 1200×630, used for social shares.

- **Security / crawlability**  
  - Sensible security headers in `next.config.ts`.  
  - `metadataBase` set so relative URLs resolve correctly.

---

## Strategy to rank in the top

### 1. Keywords and content

- **Primary terms:**  
  e.g. “software development partner”, “mobile app development company”, “AI solutions provider”, “remote IT team”, “offshore development”, “technology partner”.
- **Long-tail:**  
  e.g. “hire mobile app developers for startup”, “AI integration for business”, “reduce software development cost”.
- **Where to use them:**  
  - H1, first paragraph, and one subheading on the homepage.  
  - Service names and short descriptions (e.g. in `Services`, `WhyChooseUs`).  
  - One focused page per major service (see below).

**Action:**  
- Pick 3–5 primary and 5–10 long-tail keywords.  
- Weave them into existing copy without stuffing; keep tone natural and benefit-led.

### 2. Content and site structure

- **Homepage:**  
  - Clear value proposition, social proof (case studies, testimonials, logos).  
  - Internal links to “Services”, “Why us”, “Case studies”, “Contact”.
- **Dedicated service pages (high impact):**  
  - e.g. `/services/mobile-app-development`, `/services/web-development`, `/services/ai-solutions`, `/services/remote-it`.  
  - Each with: unique H1, 300–600 words, keywords, CTA, canonical, and Open Graph.  
  - Add these URLs to `sitemap.ts` with `changeFrequency: "monthly"` and `priority: 0.8–0.9`.
- **Trust and relevance:**  
  - Blog or “Insights” with 1–2 posts per month (e.g. “How we build mobile apps”, “AI use cases for business”).  
  - Optional: `/about`, `/contact` with unique metadata and canonicals.

**Action:**  
- Add at least 2–3 service pages and wire them in the sitemap and main nav.

### 3. Technical and UX (Core Web Vitals)

- **Performance:**  
  - Optimize images (Next.js `Image`, WebP/AVIF).  
  - Minimize render-blocking JS/CSS; keep above-the-fold lean.
- **Mobile:**  
  - Already responsive; test on real devices and in Mobile-Friendly Test.
- **Core Web Vitals:**  
  - Aim for LCP &lt; 2.5s, FID/INP &lt; 100ms, CLS &lt; 0.1.  
  - Use PageSpeed Insights and Search Console.

**Action:**  
- Run Lighthouse (performance + SEO), fix critical issues, then re-check.

### 4. Links and visibility

- **Backlinks:**  
  - Guest posts, partner/client pages, directories (e.g. Clutch, GoodFirms), HARO/niche Q&A.  
  - One strong, relevant link beats many low-quality ones.
- **Internal links:**  
  - Homepage → service pages, case studies, CTA.  
  - Service pages → each other and back to homepage.
- **Local / regional:**  
  - If you target a specific country, add that to `Organization` (e.g. `address`) and consider a simple “Locations” or “We serve” section.

**Action:**  
- List 5–10 realistic backlink targets; get 1–2 live, then iterate.

### 5. Search Console and monitoring

- **Google Search Console:**  
  - Add property for `https://torqstudio.com`.  
  - Submit `sitemap.xml` (URL: `https://torqstudio.com/sitemap.xml`).  
  - Monitor coverage, indexing, and manual actions.
- **Bing Webmaster Tools:**  
  - Add site and submit same sitemap.
- **Optional:**  
  - Google Analytics 4 or similar for traffic and behavior.  
  - Rank tracking for your main keywords (e.g. Ahrefs, Semrush, or free tools).

**Action:**  
- Verify and submit sitemap in GSC and Bing within the first week after launch.

### 6. When you add new pages

- Give each page:  
  - Unique `title` and `description`.  
  - `alternates.canonical` (absolute URL).  
  - `openGraph` (at least title, description, url).  
  - `robots: { index: true, follow: true }` unless it’s private.
- Add the URL to `src/app/sitemap.ts` with a sensible `priority` and `changeFrequency`.
- Use one H1 per page and clear headings (H2/H3) for structure.

---

## Quick checklist (before/after launch)

- [ ] `NEXT_PUBLIC_SITE_URL` set to `https://torqstudio.com` in production.
- [ ] Visit `https://torqstudio.com/robots.txt` and `https://torqstudio.com/sitemap.xml` — both return correct content.
- [ ] Test OG image: share homepage link on Twitter/LinkedIn and confirm image and title/description.
- [ ] Google Search Console: property added, sitemap submitted, no critical errors.
- [ ] Bing Webmaster Tools: site added, sitemap submitted.
- [ ] Core Web Vitals and SEO in the green (Lighthouse).
- [ ] All important pages have unique meta title/description and canonicals.
- [ ] At least 2–3 service pages live and in sitemap.

---

## File reference

| What              | File(s) |
|-------------------|--------|
| Sitemap           | `src/app/sitemap.ts` |
| Robots            | `src/app/robots.ts` |
| Root metadata     | `src/app/layout.tsx` |
| OG image          | `src/app/opengraph-image.tsx` |
| Privacy metadata  | `src/app/privacy/page.tsx` |
| Terms metadata    | `src/app/terms/page.tsx` |

When you add new routes, update the sitemap and give the new pages proper metadata and canonicals so the site stays ready to rank.
