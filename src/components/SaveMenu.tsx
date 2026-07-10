import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";

interface SaveMenuProps {
  active: boolean;
  onDesktop: () => void;
  onMobile: () => void;
  onClose: () => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;
const STAGGER = 0.06;
const DELAY_CHILDREN = 0.22;
const ENTER_DURATION = 0.4;
const ITEM_COUNT = 4;
// Matches the last item's show transition (delay + duration) — see itemVariants below.
const ENTER_MS = (DELAY_CHILDREN + (ITEM_COUNT - 1) * STAGGER + ENTER_DURATION) * 1000;
const hoverTransition = { duration: 0.2, ease: EASE };

/**
 * Each item's entry delay is hardcoded from its own index rather than derived
 * from framer's automatic staggerChildren orchestration (which orders
 * children by mount-registration order, not JSX order) — this guarantees the
 * left-to-right reveal is always Save → Desktop → Mobile → Close. Exit has no
 * delay, so all items fade out together instead of staggering.
 */
const itemVariants = (index: number): Variants => ({
  hidden: { opacity: 0, y: 12, transition: { duration: 0.25, ease: EASE } },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: ENTER_DURATION, ease: EASE, delay: DELAY_CHILDREN + index * STAGGER },
  },
});

/**
 * Save submenu: Save (label) · Desktop (4K) · Mobile (9:16) · Close.
 * Always mounted; `active` drives the left→right reveal.
 *
 * Interactivity (clicks + whileHover) is withheld until the entrance stagger
 * fully completes. Without this, pointer-events go "auto" the instant `active`
 * flips true, so a cursor already resting over e.g. "Mobile" triggers its
 * whileHover mid-animation and snaps that item to its hover opacity before its
 * own staggered fade-in has even started — reading as it appearing first.
 */
export default function SaveMenu({ active, onDesktop, onMobile, onClose }: SaveMenuProps) {
  const state = active ? "show" : "hidden";
  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    if (!active) {
      setInteractive(false);
      return;
    }
    const id = setTimeout(() => setInteractive(true), ENTER_MS);
    return () => clearTimeout(id);
  }, [active]);

  return (
    <div className="menu-row" style={{ pointerEvents: interactive ? "auto" : "none" }} aria-hidden={!active}>
      <motion.span
        className="menu-item"
        variants={itemVariants(0)}
        initial="hidden"
        animate={state}
        whileHover={interactive ? { opacity: 0.55, transition: hoverTransition } : undefined}
        style={{ color: "var(--tertiary)" }}
      >
        Save
      </motion.span>
      <motion.button
        className="menu-item"
        variants={itemVariants(1)}
        initial="hidden"
        animate={state}
        whileHover={interactive ? { opacity: 0.55, transition: hoverTransition } : undefined}
        onClick={onDesktop}
        tabIndex={interactive ? 0 : -1}
      >
        Desktop (4K)
      </motion.button>
      <motion.button
        className="menu-item"
        variants={itemVariants(2)}
        initial="hidden"
        animate={state}
        whileHover={interactive ? { opacity: 0.55, transition: hoverTransition } : undefined}
        onClick={onMobile}
        tabIndex={interactive ? 0 : -1}
      >
        Mobile (9:16)
      </motion.button>
      <motion.button
        className="menu-item"
        variants={itemVariants(3)}
        initial="hidden"
        animate={state}
        whileHover={interactive ? { opacity: 0.55, transition: hoverTransition } : undefined}
        onClick={onClose}
        tabIndex={interactive ? 0 : -1}
      >
        Close
      </motion.button>
    </div>
  );
}
