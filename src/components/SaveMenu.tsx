import { motion, type Variants } from "framer-motion";

interface SaveMenuProps {
  active: boolean;
  onDesktop: () => void;
  onMobile: () => void;
  onClose: () => void;
}

const container: Variants = {
  hidden: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.22 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 12, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

/**
 * Save submenu: Save (label) · Desktop (4K) · Mobile (9:16) · Close.
 * Always mounted; `active` drives the staggered left→right reveal. Delaying the
 * children (delayChildren) lets the primary menu fade out first.
 */
export default function SaveMenu({ active, onDesktop, onMobile, onClose }: SaveMenuProps) {
  return (
    <motion.div
      className="menu-row"
      variants={container}
      initial="hidden"
      animate={active ? "show" : "hidden"}
      style={{ pointerEvents: active ? "auto" : "none" }}
      aria-hidden={!active}
    >
      <motion.span className="menu-item" variants={item} style={{ color: "var(--tertiary)" }}>
        Save
      </motion.span>
      <motion.button className="menu-item" variants={item} onClick={onDesktop} tabIndex={active ? 0 : -1}>
        Desktop (4K)
      </motion.button>
      <motion.button className="menu-item" variants={item} onClick={onMobile} tabIndex={active ? 0 : -1}>
        Mobile (9:16)
      </motion.button>
      <motion.button className="menu-item" variants={item} onClick={onClose} tabIndex={active ? 0 : -1}>
        Close
      </motion.button>
    </motion.div>
  );
}
