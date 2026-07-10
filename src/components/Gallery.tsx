import { motion } from "framer-motion";
import type { GradientSpec } from "../types";
import GradientCanvas from "./GradientCanvas";

interface GalleryProps {
  gradients: GradientSpec[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onClose: () => void;
  /** shared layout id for the active card (morphs to/from landing canvas) */
  layoutId: string;
}

const pad = (n: number) => String(n + 1).padStart(2, "0");

/**
 * Horizontally-scrolling row of gradient cards. The active card carries the
 * shared layoutId so it morphs from the big landing canvas; the rest fade/rise
 * in. Clicking a card selects it and returns to the landing view.
 */
export default function Gallery({ gradients, activeIndex, onSelect, onClose, layoutId }: GalleryProps) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
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
          {gradients.map((spec, i) => {
            const isActive = i === activeIndex;
            const card = (
              <button
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
                  layoutId={isActive ? layoutId : undefined}
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
            );

            if (isActive) {
              // active card position is driven by the shared layout morph
              return <div key={spec.id}>{card}</div>;
            }
            return (
              <motion.div
                key={spec.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
              >
                {card}
              </motion.div>
            );
          })}
        </div>
      </div>

      <motion.button
        className="menu-item"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        Close
      </motion.button>
    </div>
  );
}
