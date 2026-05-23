"use client";

type Props = {
  siteUrl: string;
  slug: string;
  title: string;
  description: string;
};

function clamp(s: string, n: number) {
  return s.length > n ? `${s.slice(0, n - 1).trim()}…` : s;
}

function hostname(u: string) {
  try {
    return new URL(u).hostname.replace(/^www\./, "");
  } catch {
    return u;
  }
}

export function SerpPreview({ siteUrl, slug, title, description }: Props) {
  const base = siteUrl.replace(/\/$/, "");
  const isHome = !slug.trim();
  const url = isHome ? base : `${base}/blog/${slug}`;
  const host = hostname(base);
  const crumbs = isHome ? host : `${host} › blog › ${slug}`;
  return (
    <div className="card-flat p-4">
      <p className="mono-eyebrow text-muted-foreground">GOOGLE PREVIEW</p>
      <div className="mt-3 rounded-md border border-border bg-background p-4 font-sans">
        <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
          <span
            aria-hidden
            className="inline-block h-5 w-5 rounded-full border border-border bg-muted"
          />
          <div className="leading-tight">
            <p className="text-foreground">{host || "yoursite.com"}</p>
            <p className="text-[11px] text-muted-foreground">{crumbs}</p>
          </div>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 block text-[18px] leading-tight text-[color:#1a0dab] hover:underline"
        >
          {clamp(title || "Your post title — Site name", 70)}
        </a>
        <p className="mt-1 text-[13px] leading-snug text-muted-foreground">
          {clamp(
            description || "Your meta description appears here. Aim for 120–160 characters.",
            160,
          )}
        </p>
      </div>
    </div>
  );
}
