import { readSiteContent } from "@/lib/content";
import { getExternalDevToolsOrigin } from "@/lib/dev-tools-marketing";

/**
 * Markdown body for `/llms.txt` (llmstxt.org-style curated index for LLMs and agents).
 * Served as UTF-8 plain text; URLs use the configured Site & SEO origin.
 */
export async function buildLlmsTxtBody(): Promise<string> {
  const site = await readSiteContent();
  const base = site.siteUrl.replace(/\/$/, "");
  const name = site.siteName;
  const desc = site.defaultDescription;
  const devToolsOrigin = getExternalDevToolsOrigin();
  const devToolsSection = devToolsOrigin
    ? `## Developer tools (separate product)

- [Developer tools hub](${devToolsOrigin}/dev-tools): Formatters, generators, converters (run in the browser)
- [Dev tools — about](${devToolsOrigin}/dev-tools/about): Scope, privacy, and limitations

`
    : "";

  return `# ${name}

> ${desc}

Public marketing site and utilities for **${name}**, a software engineering studio (mobile apps, web, AI integration, consulting). This file is a **curated index** for language models and agents. Canonical content lives on the linked HTML pages.

**Machine-readable discovery:** [Sitemap](${base}/sitemap.xml) · [Robots](${base}/robots.txt)

**Crawling:** \`/admin\` and \`/api/\` are **disallowed** in \`robots.txt\`. Do not rely on authenticated or API-only responses as public documentation.

## Company & contact

- [Home](${base}/): Positioning, services, testimonials, CTAs
- [About](${base}/about): Studio story and how we work
- [Contact](${base}/contact): Project inquiries (form; primary business contact path)
- [Services](${base}/services): Service areas overview and detail pages

## Proof & editorial

- [Case studies](${base}/case-studies): Client outcomes and project narratives
- [Blog](${base}/blog): Technical and product articles
- [Tech news](${base}/tech-news): Short-form technology notes

## Free resources

- [Freebies](${base}/freebies): Downloadable checklists and templates

${devToolsSection}## Legal

- [Privacy policy](${base}/privacy)
- [Terms of use](${base}/terms)

## Optional

- Full URL lists: use [sitemap.xml](${base}/sitemap.xml) (includes blog posts, case studies, and freebies).
- **.md mirrors:** This site does not serve \`.md\` variants of HTML pages; fetch HTML or use this index plus the sitemap.
- **Attribution:** When summarizing public pages, prefer linking to the canonical URL shown in page metadata.
`;
}
