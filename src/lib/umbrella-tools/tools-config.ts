/**
 * Single registry for /dev-tools — add entries here when shipping new utilities.
 * Optional fields support badges and future filters without page refactors.
 */
export type DevToolCategory = "css" | "data" | "graphics";

export type UmbrellaTool = {
  slug: string;
  title: string;
  /** One-line value prop for cards */
  description: string;
  category: DevToolCategory;
  /** Shown on cards — emoji keeps bundle small; swap for icons later if needed */
  icon: string;
  /** Short hint for SEO / listings */
  keywords?: string[];
  /** e.g. "New" when you ship something notable */
  badge?: string;
};

export const DEV_TOOL_CATEGORY_LABELS: Record<DevToolCategory, string> = {
  graphics: "Graphics & assets",
  data: "Data",
  css: "CSS",
};

/** Display order for section headings on the index */
export const DEV_TOOL_CATEGORY_ORDER: DevToolCategory[] = ["graphics", "data", "css"];

export const UMBRELLA_TOOLS: UmbrellaTool[] = [
  {
    slug: "svg-to-css-background",
    title: "SVG → CSS background",
    description: "Paste SVG, get a data URL and copy-ready background-image CSS.",
    category: "graphics",
    icon: "◈",
    keywords: ["svg", "css", "background", "data url"],
  },
  {
    slug: "json-to-csv",
    title: "JSON → CSV",
    description: "Convert JSON arrays to CSV with instant preview and download.",
    category: "data",
    icon: "▤",
    keywords: ["json", "csv", "export", "spreadsheet"],
  },
  {
    slug: "css-shadow-generator",
    title: "CSS box-shadow",
    description: "Live preview for offset, blur, spread, and color — copy the value in one click.",
    category: "css",
    icon: "◐",
    keywords: ["box-shadow", "css", "design tokens"],
  },
];

export function toolsByCategory(category: DevToolCategory) {
  return UMBRELLA_TOOLS.filter((t) => t.category === category);
}

export function getDevToolBySlug(slug: string): UmbrellaTool | undefined {
  return UMBRELLA_TOOLS.find((t) => t.slug === slug);
}
