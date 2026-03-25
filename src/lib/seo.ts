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

export function webApplicationJsonLd(params: {
  siteUrl: string;
  path: string;
  name: string;
  description: string;
}) {
  const url = `${params.siteUrl}${params.path.startsWith("/") ? params.path : `/${params.path}`}`;
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: params.name,
    description: params.description,
    url,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

/** Single tech news story — NewsArticle for article detail pages. */
export function techNewsArticleJsonLd(params: {
  siteUrl: string;
  slug: string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  articleSection: string;
  siteName: string;
  articleBody: string;
}) {
  const url = `${params.siteUrl}/tech-news/${params.slug}`;
  const modified = params.dateModified ?? params.datePublished;
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: params.headline,
    description: params.description,
    datePublished: params.datePublished,
    dateModified: modified,
    articleSection: params.articleSection,
    articleBody: params.articleBody,
    author: { "@type": "Organization", name: params.siteName, url: params.siteUrl },
    publisher: {
      "@type": "Organization",
      name: params.siteName,
      url: params.siteUrl,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
  };
}

/** Tech news hub: CollectionPage + ItemList of NewsArticle linking to full article URLs. */
export function techNewsCollectionJsonLd(params: {
  siteUrl: string;
  siteName: string;
  pageName: string;
  pageDescription: string;
  articles: {
    headline: string;
    description: string;
    datePublished: string;
    articleSection: string;
    url: string;
  }[];
}) {
  const pageUrl = `${params.siteUrl}/tech-news`;
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: params.pageName,
    description: params.pageDescription,
    isPartOf: { "@type": "WebSite", name: params.siteName, url: params.siteUrl },
    publisher: { "@type": "Organization", name: params.siteName, url: params.siteUrl },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: params.articles.length,
      itemListElement: params.articles.map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "NewsArticle",
          headline: a.headline,
          description: a.description,
          datePublished: a.datePublished,
          dateModified: a.datePublished,
          articleSection: a.articleSection,
          url: a.url,
          mainEntityOfPage: { "@type": "WebPage", "@id": a.url },
          author: { "@type": "Organization", name: params.siteName, url: params.siteUrl },
          publisher: {
            "@type": "Organization",
            name: params.siteName,
            url: params.siteUrl,
          },
        },
      })),
    },
  };
}
