export type FreebieType = "checklist" | "template" | "guide";

export type Freebie = {
  slug: string;
  title: string;
  description: string;
  type: FreebieType;
};

export const freebies: Freebie[] = [
  {
    slug: "mobile-app-partner-checklist",
    title: "Mobile App Development Partner Checklist",
    description: "What to ask and what to look for when hiring a mobile app development company. Avoid costly mistakes.",
    type: "checklist",
  },
  {
    slug: "project-brief-template",
    title: "Project Brief Template",
    description: "A one-page brief to align your team and your development partner before kicking off a project.",
    type: "template",
  },
  {
    slug: "app-pre-launch-checklist",
    title: "Pre-Launch Checklist for Your App",
    description: "Testing, store listings, privacy, and launch-day essentials so you ship with confidence.",
    type: "checklist",
  },
  {
    slug: "build-vs-buy-vs-partner-guide",
    title: "Build vs Buy vs Partner: A Short Guide",
    description: "When to build in-house, buy off-the-shelf, or work with a technology partner.",
    type: "guide",
  },
];
