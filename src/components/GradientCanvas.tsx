import type { CSSProperties, ReactNode } from "react";
import { motion, type MotionProps } from "framer-motion";
import type { GradientSpec } from "../types";
import GradientLayers from "./GradientLayers";

interface GradientCanvasProps extends MotionProps {
  spec: GradientSpec;
  className?: string;
  style?: CSSProperties;
  /** blur multiplier passed to GradientLayers (cards render crisper) */
  blurScale?: number;
  /** overlay content, e.g. a card number */
  children?: ReactNode;
}

/**
 * A single gradient in a motion box — used for gallery cards. The box carries
 * an optional shared layoutId so a card can morph to/from the landing canvas.
 */
export default function GradientCanvas({ spec, className, style, blurScale, children, ...motionProps }: GradientCanvasProps) {
  return (
    <motion.div className={className} style={{ position: "relative", overflow: "hidden", ...style }} {...motionProps}>
      <GradientLayers spec={spec} blurScale={blurScale} />
      {children}
    </motion.div>
  );
}
