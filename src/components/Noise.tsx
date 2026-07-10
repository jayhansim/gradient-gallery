import { useId } from "react";
import type { NoisePreset } from "../types";

interface NoiseProps {
  preset: NoisePreset;
}

/**
 * Procedural grain layer using an SVG feTurbulence filter, desaturated to
 * black/white dots. baseFrequency controls grain size, opacity/blendMode the
 * richness. The same params feed the export renderer (lib/exportImage.ts) so
 * screen and download match.
 */
export default function Noise({ preset }: NoiseProps) {
  const id = useId().replace(/:/g, "");
  const filterId = `noise-${id}`;

  return (
    <svg
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity: preset.opacity,
        mixBlendMode: preset.blendMode,
      }}
    >
      <filter id={filterId}>
        <feTurbulence
          type="fractalNoise"
          baseFrequency={preset.baseFrequency}
          numOctaves={preset.numOctaves}
          stitchTiles="stitch"
        />
        {/* desaturate turbulence to grayscale grain */}
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${filterId})`} />
    </svg>
  );
}
