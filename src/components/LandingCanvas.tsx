import { AnimatePresence, motion } from "framer-motion";
import type { CSSProperties } from "react";
import type { GradientSpec } from "../types";
import GradientLayers from "./GradientLayers";

interface LandingCanvasProps {
  spec: GradientSpec;
  /** key that changes on prev/next to drive the crossfade */
  activeKey: string;
  /** duration of the fade-in when this canvas (re)appears, e.g. from the gallery */
  fadeDuration: number;
  style?: CSSProperties;
}

const EXIT_DURATION = 0.3;

/**
 * The big landing canvas. Fades in on mount (page load, or returning from the
 * gallery) and fades out on unmount (going to the gallery); its gradient
 * content separately crossfades on prev/next.
 */
export default function LandingCanvas({ spec, activeKey, fadeDuration, style }: LandingCanvasProps) {
  return (
    <motion.div
      id="gradient-canvas"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: fadeDuration, ease: "easeOut" } }}
      exit={{ opacity: 0, transition: { duration: EXIT_DURATION, ease: "easeInOut" } }}
      style={{ position: "absolute", overflow: "hidden", ...style }}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={activeKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{ position: "absolute", inset: 0 }}
        >
          <GradientLayers spec={spec} />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
