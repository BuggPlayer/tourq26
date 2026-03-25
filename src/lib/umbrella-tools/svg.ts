/** Encode SVG for use in a CSS data URL (UTF-8). */
export function svgToDataURL(svgString: string): string {
  const trimmed = svgString.trim();
  const encoded = encodeURIComponent(trimmed)
    .replace(/'/g, "%27")
    .replace(/"/g, "%22");
  return `url("data:image/svg+xml,${encoded}")`;
}

export function validateSVG(svgString: string): { valid: boolean; error: string } {
  const s = svgString.trim();
  if (!s) {
    return { valid: false, error: "SVG content is empty." };
  }
  if (!/<svg[\s>]/i.test(s)) {
    return { valid: false, error: "Content does not look like SVG (missing <svg> root)." };
  }
  return { valid: true, error: "" };
}
