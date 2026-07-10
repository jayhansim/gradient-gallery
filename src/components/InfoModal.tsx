import { motion } from "framer-motion";

interface InfoModalProps {
  onClose: () => void;
  /** true → bottom-sheet (mobile), false → centred card (desktop) */
  sheet: boolean;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/** "Site info" — centred modal on desktop, bottom-sheet on mobile. */
export default function InfoModal({ onClose, sheet }: InfoModalProps) {
  return (
    <motion.div
      // scrim
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(20, 21, 26, 0.12)",
        display: "flex",
        alignItems: sheet ? "flex-end" : "center",
        justifyContent: "center",
      }}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Site info"
        onClick={(e) => e.stopPropagation()}
        initial={sheet ? { y: "100%" } : { opacity: 0, scale: 0.96, y: 8 }}
        animate={sheet ? { y: 0 } : { opacity: 1, scale: 1, y: 0 }}
        exit={sheet ? { y: "100%" } : { opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.4, ease: EASE }}
        style={{
          background: "var(--white)",
          width: sheet ? "100%" : 440,
          maxWidth: "100%",
          borderRadius: sheet ? "16px 16px 0 0" : 12,
          padding: sheet ? "28px 24px calc(28px + env(safe-area-inset-bottom))" : 32,
          boxShadow: "0 24px 60px rgba(20,21,26,0.18)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 500, letterSpacing: "-0.2px" }}>Site info</h2>
          <button className="menu-item" onClick={onClose} aria-label="Close" style={{ fontSize: 20 }}>
            ✕
          </button>
        </div>

        <p style={{ fontSize: 18, lineHeight: 1.45, color: "var(--primary)" }}>
          Hi friends! I'm Junhan, a product designer from Malaysia who loves to build. This is a gallery to showcase
          beautiful gradients and express my love for gradients.
        </p>

        <p style={{ fontSize: 15, color: "var(--tertiary)", margin: "22px 0 8px" }}>Tools used</p>
        <ul style={{ fontSize: 18, lineHeight: 1.4, color: "var(--primary)", paddingLeft: 20 }}>
          <li>Claude Code, Cursor, Figma.</li>
          <li>Fonts used: Crimson Pro</li>
          <li>Gradient inspiration from Unsplash and pretty much everywhere!</li>
        </ul>

        <p style={{ fontSize: 15, color: "var(--tertiary)", margin: "22px 0 8px" }}>Contact</p>
        <p style={{ fontSize: 18, lineHeight: 1.45, color: "var(--primary)" }}>
          For any suggestions and feedback, email me: hello@jay-han.com.
        </p>

        <div style={{ marginTop: 28 }}>
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
