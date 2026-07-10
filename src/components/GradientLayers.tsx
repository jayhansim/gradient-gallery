import { gradientCss } from "../data/gradients";
import type { GradientSpec } from "../types";
import Noise from "./Noise";

interface GradientLayersProps {
  spec: GradientSpec;
  /** multiplier on the blur radius — cards use a smaller value so thumbnails
   *  don't wash out (the presets are tuned for the full-screen canvas) */
  blurScale?: number;
}

/**
 * The visual guts of a gradient — a self-contained absolutely-filled stack:
 * base gradient, a blurred copy to smooth banding, and the grain layer.
 * Rendered inside GradientCanvas (cards) and LandingCanvas (with crossfade).
 */
export default function GradientLayers({ spec, blurScale = 1 }: GradientLayersProps) {
  const css = gradientCss(spec);
  const blur = spec.blur * blurScale;
  return (
    <div style={{ position: "absolute", inset: 0, background: css }}>
      {blur > 0 && (
        <div
          aria-hidden="true"
          style={{ position: "absolute", inset: 0, background: css, filter: `blur(${blur}px)` }}
        />
      )}
      <Noise preset={spec.noise} />
    </div>
  );
}
