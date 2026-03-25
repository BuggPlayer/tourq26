export function generateBoxShadow(params: {
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
}): string {
  const { offsetX, offsetY, blur, spread, color } = params;
  return `${offsetX}px ${offsetY}px ${blur}px ${spread}px ${color}`;
}

/** Minimal brace-based prettify for small snippets. */
export function formatCSS(cssString: string): string {
  let s = cssString.replace(/\s+/g, " ").trim();
  s = s.replace(/\s*{\s*/g, " {\n  ");
  s = s.replace(/\s*}\s*/g, "\n}\n");
  s = s.replace(/\s*;\s*/g, ";\n  ");
  return s.trim();
}
