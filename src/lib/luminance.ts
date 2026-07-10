import type { GradientSpec } from "../types";

export interface RGB {
  r: number;
  g: number;
  b: number;
}

/** Parse a #rrggbb (or #rgb) hex string to RGB (0–255). */
export function hexToRgb(hex: string): RGB {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) {
    h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  }
  const n = parseInt(h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

/** Linear-interpolate two RGB colors. t in [0,1]. */
export function lerpRgb(a: RGB, b: RGB, t: number): RGB {
  return {
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t,
  };
}

/**
 * Sample the gradient's color at a vertical position (0 = top, 1 = bottom)
 * by interpolating between the surrounding stops.
 */
export function colorAt(spec: GradientSpec, position: number): RGB {
  const p = Math.max(0, Math.min(1, position)) * 100;
  const stops = spec.stops;
  if (p <= stops[0].pos) return hexToRgb(stops[0].color);
  const last = stops[stops.length - 1];
  if (p >= last.pos) return hexToRgb(last.color);
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i];
    const b = stops[i + 1];
    if (p >= a.pos && p <= b.pos) {
      const t = b.pos === a.pos ? 0 : (p - a.pos) / (b.pos - a.pos);
      return lerpRgb(hexToRgb(a.color), hexToRgb(b.color), t);
    }
  }
  return hexToRgb(last.color);
}

/** WCAG relative luminance (0 = black, 1 = white). */
export function relativeLuminance({ r, g, b }: RGB): number {
  const chan = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * chan(r) + 0.7152 * chan(g) + 0.0722 * chan(b);
}

/**
 * Decide whether content overlaying the gradient at `position` should be light.
 * Returns true when the background is dark enough to warrant a white foreground.
 */
export function isDarkAt(spec: GradientSpec, position: number, threshold = 0.32): boolean {
  return relativeLuminance(colorAt(spec, position)) < threshold;
}
