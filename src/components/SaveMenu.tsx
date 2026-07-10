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
    transition: { duration: 0.4, ease: EASE, delay: DELAY_CHILDREN + index * STAGGER },
  },
});

/**
 * Save submenu: Save (label) · Desktop (4K) · Mobile (9:16) · Close.
 * Always mounted; `active` drives the left→right reveal.
 */
export default function SaveMenu({ active, onDesktop, onMobile, onClose }: SaveMenuProps) {
  const state = active ? "show" : "hidden";

  return (
    <div className="menu-row" style={{ pointerEvents: active ? "auto" : "none" }} aria-hidden={!active}>
      <motion.span
        className="menu-item"
        variants={itemVariants(0)}
        initial="hidden"
        animate={state}
        whileHover={{ opacity: 0.55, transition: hoverTransition }}
        style={{ color: "var(--tertiary)" }}
      >
        Save
      </motion.span>
      <motion.button
        className="menu-item"
        variants={itemVariants(1)}
        initial="hidden"
        animate={state}
        whileHover={{ opacity: 0.55, transition: hoverTransition }}
        onClick={onDesktop}
        tabIndex={active ? 0 : -1}
      >
        Desktop (4K)
      </motion.button>
      <motion.button
        className="menu-item"
        variants={itemVariants(2)}
        initial="hidden"
        animate={state}
        whileHover={{ opacity: 0.55, transition: hoverTransition }}
        onClick={onMobile}
        tabIndex={active ? 0 : -1}
      >
        Mobile (9:16)
      </motion.button>
      <motion.button
        className="menu-item"
        variants={itemVariants(3)}
        initial="hidden"
        animate={state}
        whileHover={{ opacity: 0.55, transition: hoverTransition }}
        onClick={onClose}
        tabIndex={active ? 0 : -1}
      >
        Close
      </motion.button>
    </div>
  );
}
