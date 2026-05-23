/**
 * Curated stock photography (Unsplash — free to use under their license).
 * Swap `src` to a path under `/public/images/photos/` when you have your own shots.
 */
export type SitePhoto = { src: string; alt: string };

export const sitePhotos = {
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
} as const satisfies Record<string, SitePhoto>;
