export type DividerPreset = "wave" | "curve" | "tilt" | "zigzag";

/** Normalize hex for SVG fill (#rgb or #rrggbb). */
export function normalizeSvgFill(hex: string): string {
  const s = hex.trim();
  if (/^#[0-9A-Fa-f]{3}$/.test(s) || /^#[0-9A-Fa-f]{6}$/.test(s)) return s;
  if (/^[0-9A-Fa-f]{6}$/.test(s)) return `#${s}`;
  return "#6366f1";
}

function zigzagPath(w: number, h: number): string {
  const steps = 10;
  const step = w / steps;
  let path = `M0,${h} L0,${h * 0.32}`;
  for (let i = 1; i <= steps; i++) {
    const x = Math.min(step * i, w);
    const y = i % 2 === 0 ? h * 0.32 : h * 0.68;
    path += ` L${x},${y}`;
  }
  path += ` L${w},${h} Z`;
  return path;
}

/**
 * Section-style SVG divider (filled region); use above/below content with matching background color.
 */
export function buildShapeDividerSvg(
  preset: DividerPreset,
  fill: string,
  width = 1200,
  height = 120,
  flip = false,
): string {
  const w = Math.max(100, Math.min(4000, width));
  const h = Math.max(40, Math.min(600, height));
  const color = normalizeSvgFill(fill);

  let d = "";
  switch (preset) {
    case "wave":
      d = `M0,${h} L0,${h * 0.38} C${w * 0.2},${h * 0.05} ${w * 0.35},${h * 0.95} ${w * 0.5},${h * 0.45} S${w * 0.8},${h * 0.08} ${w},${h * 0.38} L${w},${h} Z`;
      break;
    case "curve":
      d = `M0,${h} L0,${h * 0.52} Q${w * 0.5},${h * 0.02} ${w},${h * 0.52} L${w},${h} Z`;
      break;
    case "tilt":
      d = `M0,${h} L0,${h * 0.12} L${w},${h * 0.88} L${w},${h} Z`;
      break;
    case "zigzag":
      d = zigzagPath(w, h);
      break;
    default:
      d = `M0,${h} L0,${h * 0.38} C${w * 0.2},${h * 0.05} ${w * 0.35},${h * 0.95} ${w * 0.5},${h * 0.45} S${w * 0.8},${h * 0.08} ${w},${h * 0.38} L${w},${h} Z`;
  }

  const flipAttr = flip ? ` transform="translate(${w},0) scale(-1,1)"` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"${flipAttr}><path d="${d}" fill="${color}"/></svg>`;
}
