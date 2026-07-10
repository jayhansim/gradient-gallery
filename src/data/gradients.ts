import type { GradientSpec, NoisePreset } from "../types";

/**
 * Default grain preset, tuned close to the Figma noise layers
 * (multiply @ 40% + soft-light @ 40%). We collapse both into one
 * procedural feTurbulence layer. Per-gradient overrides go on the spec.
 */
const DEFAULT_NOISE: NoisePreset = {
  baseFrequency: 0.9,
  numOctaves: 2,
  opacity: 0.4,
  blendMode: "soft-light",
};

/**
 * The curated gradients — the single source of truth for both on-screen
 * rendering and 4K / 9:16 export. Add a new gradient by appending one entry.
 * Color stops extracted from Figma file GTo9SJHjrLOJUFYVPwKmM1.
 */
export const GRADIENTS: GradientSpec[] = [
  {
    id: "g01",
    name: "Dawn Haze",
    angle: 180,
    blur: 15,
    noise: { baseFrequency: 0.9, numOctaves: 2, opacity: 0.5, blendMode: "overlay" },
    stops: [
      { color: "#8ea3d0", pos: 0 },
      { color: "#abbadb", pos: 36 },
      { color: "#c2cbdd", pos: 63 },
      { color: "#cdcdd3", pos: 76 },
      { color: "#e2d4c7", pos: 86 },
      { color: "#d4bcb2", pos: 90 },
      { color: "#b1b1bd", pos: 92 },
      { color: "#5f7896", pos: 98 },
    ],
  },
  {
    id: "g02",
    name: "Deep Blue Rise",
    angle: 180,
    blur: 50,
    noise: { baseFrequency: 0.7, numOctaves: 2, opacity: 0.6, blendMode: "overlay" },
    stops: [
      { color: "#000813", pos: 0 },
      { color: "#000b1f", pos: 10 },
      { color: "#031c4b", pos: 21 },
      { color: "#003070", pos: 30 },
      { color: "#014e9b", pos: 39 },
      { color: "#75a9dd", pos: 65 },
      { color: "#c6d7e9", pos: 82 },
      { color: "#edeeef", pos: 94 },
      { color: "#fbf6f2", pos: 100 },
    ],
  },
  {
    id: "g03",
    name: "Sky to Dusk",
    angle: 180,
    blur: 20,
    noise: { baseFrequency: 0.8, numOctaves: 2, opacity: 0.4, blendMode: "overlay" },
    stops: [
      { color: "#6da5e2", pos: 0 },
      { color: "#85acd6", pos: 14 },
      { color: "#9aaec5", pos: 29 },
      { color: "#a8abb4", pos: 44 },
      { color: "#a79c9a", pos: 59 },
      { color: "#a28685", pos: 70 },
      { color: "#86647a", pos: 83 },
      { color: "#6c5276", pos: 90 },
      { color: "#334374", pos: 100 },
    ],
  },
  {
    id: "g04",
    name: "Navy Sunset",
    angle: 180,
    blur: 20,
    noise: { baseFrequency: 0.8, numOctaves: 2, opacity: 0.4, blendMode: "overlay" },
    stops: [
      { color: "#092046", pos: 0 },
      { color: "#2e487b", pos: 19 },
      { color: "#716f96", pos: 34 },
      { color: "#c5a6ac", pos: 53 },
      { color: "#e2c1b8", pos: 66 },
      { color: "#e9c8b6", pos: 77 },
      { color: "#f3be9a", pos: 92 },
      { color: "#fac07f", pos: 100 },
    ],
  },
  {
    id: "g05",
    name: "Ember Night",
    angle: 180,
    blur: 20,
    noise: { baseFrequency: 0.8, numOctaves: 2, opacity: 0.4, blendMode: "overlay" },
    stops: [
      { color: "#050e18", pos: 0 },
      { color: "#081c33", pos: 30 },
      { color: "#1e2f49", pos: 49 },
      { color: "#414659", pos: 61 },
      { color: "#675b5f", pos: 69 },
      { color: "#ab725e", pos: 78 },
      { color: "#f58650", pos: 87 },
      { color: "#ff8a44", pos: 90 },
      { color: "#ff721f", pos: 94 },
      { color: "#e75805", pos: 98 },
      { color: "#d13d03", pos: 100 },
    ],
  },
];

/** Build the CSS `linear-gradient(...)` string for a spec. */
export function gradientCss(spec: GradientSpec): string {
  const stops = spec.stops.map((s) => `${s.color} ${s.pos}%`).join(", ");
  return `linear-gradient(${spec.angle}deg, ${stops})`;
}
