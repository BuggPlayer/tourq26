export type UmbrellaTool = {
  slug: string;
  title: string;
  description: string;
};

export const UMBRELLA_TOOLS: UmbrellaTool[] = [
  {
    slug: "svg-to-css-background",
    title: "SVG → CSS background",
    description: "Turn inline SVG into a data URL and copy-ready background-image CSS.",
  },
  {
    slug: "json-to-csv",
    title: "JSON → CSV",
    description: "Convert a JSON array of objects to CSV with a download option.",
  },
  {
    slug: "css-shadow-generator",
    title: "CSS box-shadow",
    description: "Tweak offset, blur, spread, and color; preview and copy the shadow value.",
  },
];
