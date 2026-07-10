export type BlendMode = "multiply" | "soft-light" | "overlay" | "screen" | "normal";

export interface ColorStop {
  /** CSS hex color, e.g. "#8ea3d0" */
  color: string;
  /** stop position 0–100 (%) */
  pos: number;
}

export interface NoisePreset {
  /** SVG feTurbulence baseFrequency — larger = finer grain */
  baseFrequency: number;
  /** SVG feTurbulence numOctaves */
  numOctaves: number;
  /** layer opacity 0–1 */
  opacity: number;
  /** CSS mix-blend-mode / canvas globalCompositeOperation */
  blendMode: BlendMode;
}

export interface GradientSpec {
  /** stable id, also used as layout/animation key */
  id: string;
  /** human label (unused in UI but handy for dev) */
  name: string;
  /** gradient angle in degrees (all 180 for now) */
  angle: number;
  /** ordered color stops top → bottom */
  stops: ColorStop[];
  /** blur radius in px applied to the gradient layer at design size (402px wide) */
  blur: number;
  /** grain preset */
  noise: NoisePreset;
}
