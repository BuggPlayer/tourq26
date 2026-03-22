/**
 * Curated stock photography (Unsplash — free to use under their license).
 * Swap `src` to a path under `/public/images/photos/` when you have your own shots.
 */
export type SitePhoto = { src: string; alt: string };

export const sitePhotos = {
  hero: {
    src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1400&q=85&auto=format&fit=crop",
    alt: "Laptop on a desk with programming work on screen",
  },
  galleryTeam: {
    src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=960&q=85&auto=format&fit=crop",
    alt: "Engineering team collaborating around laptops",
  },
  galleryMobile: {
    src: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=960&q=85&auto=format&fit=crop",
    alt: "Person using a mobile app on a smartphone",
  },
  galleryCode: {
    src: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=960&q=85&auto=format&fit=crop",
    alt: "Software code on a monitor",
  },
  servicesBanner: {
    src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1800&q=85&auto=format&fit=crop",
    alt: "Developers collaborating in a modern office",
  },
  aboutMission: {
    src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1000&q=85&auto=format&fit=crop",
    alt: "Team reviewing plans together at a table",
  },
  contactAside: {
    src: "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=900&q=85&auto=format&fit=crop",
    alt: "Desk with notebook and coffee, ready to plan a project",
  },
} as const satisfies Record<string, SitePhoto>;
