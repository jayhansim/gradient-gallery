import { AnimatePresence, motion } from "framer-motion";
import type { CSSProperties } from "react";
import type { GradientSpec } from "../types";
import GradientLayers from "./GradientLayers";

interface LandingCanvasProps {
  spec: GradientSpec;
  /** key that changes on prev/next to drive the crossfade */
  activeKey: string;
  layoutId: string;
  style?: CSSProperties;
}

/**
 * The big landing canvas: a persistent motion frame (shared layoutId, morphs
 * to/from the gallery) whose gradient content crossfades on prev/next.
 * `initial={false}` means the first gradient appears instantly (no entrance),
 * per the brief; only subsequent changes crossfade.
 */
export default function LandingCanvas({ spec, activeKey, layoutId, style }: LandingCanvasProps) {
  return (
    <motion.div
      id="gradient-canvas"
      layoutId={layoutId}
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
