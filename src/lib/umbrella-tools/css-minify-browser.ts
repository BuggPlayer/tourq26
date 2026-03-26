/** Browser-safe CSS minification (no Node fs). Good enough for dev-tool previews. */
export function minifyCssBrowser(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "")
    .replace(/\s*([{}:;,>+~])\s*/g, "$1")
    .replace(/\s+/g, " ")
    .replace(/;}/g, "}")
    .trim();
}
