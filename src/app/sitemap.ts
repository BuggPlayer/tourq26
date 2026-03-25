import type { MetadataRoute } from "next";
import { readBlogPosts } from "@/lib/content";
import { freebies } from "@/data/freebies";
import { caseStudies } from "@/data/case-studies";
import { servicePages } from "@/data/services-content";
import { tools } from "@/data/tools";
import { techNewsDemoItems } from "@/data/tech-news-demo";
import { getSiteUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = await getSiteUrl();
  const blogPosts = await readBlogPosts();
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/tech-news`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.82 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/case-studies`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/freebies`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/tools`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.82 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const toolUrls: MetadataRoute.Sitemap = tools.map((t) => ({
    url: `${baseUrl}/tools/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: t.status === "live" ? 0.78 : 0.55,
  }));

  const freebieUrls: MetadataRoute.Sitemap = freebies.map((f) => ({
    url: `${baseUrl}/freebies/${f.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const blogUrls: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const serviceUrls: MetadataRoute.Sitemap = servicePages.map((p) => ({
    url: `${baseUrl}/services/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  const caseStudyUrls: MetadataRoute.Sitemap = caseStudies.map((c) => ({
    url: `${baseUrl}/case-studies/${c.slug}`,
    lastModified: new Date(c.date),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const techNewsUrls: MetadataRoute.Sitemap = techNewsDemoItems.map((item) => ({
    url: `${baseUrl}/tech-news/${item.slug}`,
    lastModified: new Date(item.datePublished),
    changeFrequency: "weekly" as const,
    priority: 0.72,
  }));

  return [
    ...staticPages,
    ...serviceUrls,
    ...caseStudyUrls,
    ...toolUrls,
    ...freebieUrls,
    ...blogUrls,
    ...techNewsUrls,
  ];
}
