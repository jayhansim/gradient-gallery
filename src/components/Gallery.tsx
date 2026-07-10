import { motion } from "framer-motion";
import type { GradientSpec } from "../types";
import GradientCanvas from "./GradientCanvas";

interface GalleryProps {
  gradients: GradientSpec[];
  onSelect: (index: number) => void;
  onClose: () => void;
}

const pad = (n: number) => String(n + 1).padStart(2, "0");

const TRANSITION = { duration: 0.5, ease: "easeInOut" } as const;

/**
 * Horizontally-scrolling row of gradient cards ("All"). The whole panel
 * fades in and slides up on entry, and fades out and slides down on exit
 * (closing, or picking a gradient) — see LandingCanvas for the fade that
 * follows once this panel has fully exited.
 */
export default function Gallery({ gradients, onSelect, onClose }: GalleryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0, transition: TRANSITION }}
      exit={{ opacity: 0, y: 40, transition: TRANSITION }}
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="gallery-scroll"
        style={{
          width: "100%",
          overflowX: "auto",
          overflowY: "hidden",
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 16,
            padding: "0 max(16px, calc((100vw - 900px) / 2))",
            alignItems: "center",
            margin: "0 auto",
          }}
        >
          {gradients.map((spec, i) => (
            <button
              key={spec.id}
              onClick={() => onSelect(i)}
              aria-label={`Gradient ${pad(i)}`}
              style={{
                flex: "0 0 auto",
                display: "block",
                cursor: "pointer",
              }}
            >
              <GradientCanvas
                spec={spec}
                blurScale={0.3}
                style={{
                  height: "min(64vh, 560px)",
                  aspectRatio: "1 / 1.9",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span className="card-number">{pad(i)}</span>
              </GradientCanvas>
            </button>
          ))}
        </div>
      </div>

      <button
        className="menu-item menu-item--static"
        onClick={onClose}
        style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)" }}
      >
        Close
      </button>
    </motion.div>
  );
}
