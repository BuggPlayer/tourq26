# Dev tools architecture

This document describes the canonical structure for `/dev-tools` tools in this codebase.

## Routes

| Path | Purpose |
|------|---------|
| `/dev-tools` | Hub listing all tools by category |
| `/dev-tools/[slug]` | Single dynamic route; `generateStaticParams` builds every slug from `UMBRELLA_TOOLS` |
| `/dev-tools/about` | Static about page |

## Page shell (`UmbrellaToolsLayout`)

Order of UI:

1. `DevToolsTopBar`
2. `DevToolsSidebar` (desktop) / `DevToolsMobileSection` (mobile)
3. `main`: `DevToolsBreadcrumbs` → **tool content** → optional **public FAQ** (`DevToolEditorialSections`, admin `faqHtml`) → `DevToolsToolFaq` → `DevToolsRelatedTools`
4. `Footer`

The public FAQ block is injected from `app/dev-tools/[slug]/page.tsx` when `faqHtml` (or legacy migrated content) exists. Registry/code FAQs (`DevToolsToolFaq`) still render after it. Related tools are shared.

## Registry

- `types.ts` — `UmbrellaTool` (slug, title, description, category, icon, optional `seoTitle`, `seoDescription`, `seoIntro`, `faq`, `keywords`).
- `tools-registry-core.ts` — hand-maintained tools.
- `tools-registry-extra.ts` — extended/generated catalog (merged; core wins on duplicate slug).
- `tools-config.ts` — merges registries, sorts by category, applies `applyDevToolSeoOverrides`.
- `seo-overrides.ts` — per-slug SEO patches that survive registry regeneration.

## SEO and JSON-LD

- `app/dev-tools/[slug]/page.tsx` calls `devToolsPageMetadata(slug)` and injects `devToolsToolFullJsonLd` (WebPage, BreadcrumbList, SoftwareApplication/WebApplication, FAQPage when FAQs exist).
- FAQ items come from `getDevToolFaqItems(slug)` (`dev-tool-faq.ts` + optional `tool.faq` + defaults).

## Tool UI: `DevToolPageShell`

Use `DevToolPageShell` from `src/components/umbrella-tools/DevToolPageShell.tsx` for every tool:

- Renders `<article>`, `ToolHeader` (title, description, category, optional `seoIntro` from registry), and by default a **“Try it”** section with a top border.
- Props: `slug` (must exist in `UMBRELLA_TOOLS`), `children`, optional `showTryHeading` (default `true`), optional `tryHeading` (default `"Try it"`).

**Long-form pages** (extra sections below the primary UI, e.g. JSON formatter, slug generator): pass `showTryHeading={false}` and place your own sections (still include a “Try it” block inside `children` if you want that heading).

**Slug-based tools** (e.g. per-algorithm hash/HMAC): pass `slug={slug}` from props.

## Admin overrides (operational control)

Runtime flags are stored separately from the code registry so operators can change visibility without redeploying.

| Concern | Detail |
|--------|--------|
| **Persistence** | Vercel KV key `content:dev-tools-admin` when `KV_REST_API_URL` / `KV_REST_API_TOKEN` are set; otherwise `content/dev-tools-admin.json` under the project `content/` directory. |
| **Types** | `DevToolAdminOverride` (`enabled?`, `featured?`, `notes?`, `faqHtml?` primary; optional legacy `editorialSections?` / `featuresHtml?` / `bestPracticesHtml?`) and `DevToolsAdminDocument` in `src/lib/content.ts`. |
| **Public behavior** | Default is **enabled** if a slug has no override. `enabled: false` removes the tool from the hub, related-tool blocks, and sitemap; `/dev-tools/[slug]` returns **404** for normal visitors. |
| **Featured** | `featured: true` shows a **Featured** badge on hub cards and sorts that tool **first within its category** (then title order). JSON-LD item list for the hub follows the same ordering helpers. |
| **API** | `GET` / `PUT` `/api/admin/dev-tools` (admin session only). `PUT` replaces the persisted override map with the request body — always send the **full** `overrides` object (same as the list UI). |
| **Admin UI** | `/admin/dev-tools` table; `/admin/dev-tools/[slug]` uses the same **RichTextEditor** pattern as blog (toolbar, height), **FAQ only** for public copy, overrides, registry description, **live preview** iframe (see below). |
| **Registry** | Adding or removing a tool permanently still requires an `UmbrellaTool` entry in code and deploy — admin only toggles runtime visibility and metadata stored in KV/file. |

### Public FAQ (blog-style editor)

Operators edit **one FAQ block** per tool in `/admin/dev-tools/[slug]` using `RichTextEditor` (same Quill toolbar as blog: headings, alignment, lists, etc.). Stored as **`faqHtml`**. Saving clears older **`editorialSections`** / legacy HTML fields for that slug. **Sanitized on every `PUT`** (`src/lib/dev-tool-html-sanitize.ts`). **120k** characters max after sanitize. Quill Snow CSS: `app/admin/layout.tsx`. Legacy multi-section data is still read for display until `faqHtml` is saved.

### Admin preview of disabled tools

Signed-in admins can open `/dev-tools/[slug]?adminPreview=1` to render a tool even when it is disabled (hub still hides it). The admin detail page embeds this URL in an iframe so operators can verify the full tool UI before re-enabling. Non-admins cannot use the query param to bypass the 404.

### FAQ

- **What does “featured” do?** It is stored in the admin document. On the public hub, featured tools get a visible **Featured** badge on the card and appear **first** in their category section (then alphabetical by title). It does not change SEO copy in the registry; use `seo-overrides` / FAQ modules for that.
- **Where are operator notes shown?** Only in `/admin/dev-tools` and `/admin/dev-tools/[slug]`. They are not rendered on public pages.
- **Why does my PUT clear other tools’ settings?** The API persists exactly the `overrides` object you send. The list and detail UIs keep the full map in client state so one save updates all rows consistently.
- **Can I preview a tool while it is off?** Yes: use **Detail & preview** under Dev tools admin, or open `/dev-tools/[slug]?adminPreview=1` while logged in as admin.
- **How does admin FAQ relate to the code FAQ?** Admin `faqHtml` renders as one **FAQ** section with rich HTML. The structured accordion from `getDevToolFaqItems` / `DevToolsToolFaq` still renders **below** that block.
- **Why merge overrides when saving from the list?** List edits only touch toggles and notes; the client keeps the full override map (including HTML fields) so a save from the table does not drop editorial content. Same pattern as other multi-slug admin documents.

## Adding a new tool

1. Add an `UmbrellaTool` row (unique `slug`, valid `category`).
2. Implement the UI; wrap with `DevToolPageShell` and wire `case "your-slug":` in `DevToolsToolRouter.tsx`.
3. Optionally extend `seo-overrides.ts` and `dev-tool-faq.ts`.
4. Run `npm run build` to confirm static params and types.
