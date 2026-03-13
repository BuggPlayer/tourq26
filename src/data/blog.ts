export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-choose-mobile-app-development-partner",
    title: "How to Choose the Right Mobile App Development Partner",
    description:
      "What to look for when hiring a mobile app development company: experience, process, and how to avoid common pitfalls.",
    date: "2025-03-10",
    readTime: "5 min read",
  },
  {
    slug: "ai-solutions-for-business-when-to-invest",
    title: "AI Solutions for Business: When and How to Invest",
    description:
      "Practical guide to integrating AI into your product or operations—use cases, ROI, and finding the right partner.",
    date: "2025-03-05",
    readTime: "6 min read",
  },
  {
    slug: "benefits-of-remote-it-teams-for-startups",
    title: "Benefits of Remote IT Teams for Startups and Scale-ups",
    description:
      "Why more companies are turning to remote development teams: cost, talent, and how to make it work.",
    date: "2025-02-28",
    readTime: "4 min read",
  },
];
