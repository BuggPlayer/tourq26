export type BreadcrumbItem = { name: string; path: string };

export function breadcrumbListJsonLd(siteUrl: string, items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${siteUrl}${it.path.startsWith("/") ? it.path : `/${it.path}`}`,
    })),
  };
}

export function blogPostingJsonLd(params: {
  siteUrl: string;
  slug: string;
  title: string;
  description: string;
  datePublished: string;
  siteName: string;
  authorName?: string;
}) {
  const url = `${params.siteUrl}/blog/${params.slug}`;
  const author =
    params.authorName && params.authorName.trim()
      ? { "@type": "Person" as const, name: params.authorName.trim() }
      : { "@type": "Organization" as const, name: params.siteName, url: params.siteUrl };

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: params.title,
    description: params.description,
    datePublished: params.datePublished,
    dateModified: params.datePublished,
    author,
    publisher: {
      "@type": "Organization",
      name: params.siteName,
      url: params.siteUrl,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
  };
}

export function webPageJsonLd(params: {
  siteUrl: string;
  path: string;
  name: string;
  description: string;
}) {
  const url = `${params.siteUrl}${params.path}`;
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": url,
    url,
    name: params.name,
    description: params.description,
    isPartOf: { "@type": "WebSite", url: params.siteUrl, name: params.name },
  };
}

export function servicesItemListJsonLd(siteUrl: string, services: { name: string; description: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Services",
    numberOfItems: services.length,
    itemListElement: services.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.name,
      description: s.description,
      url: `${siteUrl}/#services`,
    })),
  };
}

export function caseStudyArticleJsonLd(params: {
  siteUrl: string;
  slug: string;
  headline: string;
  description: string;
  datePublished: string;
  siteName: string;
}) {
  const url = `${params.siteUrl}/case-studies/${params.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: params.headline,
    description: params.description,
    datePublished: params.datePublished,
    dateModified: params.datePublished,
    author: { "@type": "Organization", name: params.siteName, url: params.siteUrl },
    publisher: { "@type": "Organization", name: params.siteName, url: params.siteUrl },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    about: params.description,
  };
}

export function faqPageJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
