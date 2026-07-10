import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GRADIENTS } from "./data/gradients";
import type { GradientSpec } from "./types";
import { useMediaQuery } from "./lib/useMediaQuery";
import { exportGradient, SIZE_4K, SIZE_MOBILE } from "./lib/exportImage";
import LandingCanvas from "./components/LandingCanvas";
import Gallery from "./components/Gallery";
import Logo from "./components/Logo";
import Menu from "./components/Menu";
import SaveMenu from "./components/SaveMenu";
import Counter from "./components/Counter";
import InfoModal from "./components/InfoModal";
import DevPanel from "./components/DevPanel";

type Mode = "landing" | "gallery" | "save" | "info";

const CANVAS_LAYOUT_ID = "canvas";
const EASE = [0.22, 1, 0.36, 1] as const;
const CANVAS_FADE_DURATION = 1;

const isDev = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("dev");

export default function App() {
  const [specs, setSpecs] = useState<GradientSpec[]>(GRADIENTS);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mode, setMode] = useState<Mode>("landing");

  const isMobile = useMediaQuery("(max-width: 640px)");
  const activeSpec = specs[activeIndex];
  const total = specs.length;

  // Logo is white while viewing a single gradient; dark (primary) only over
  // the white gallery ("All") background.
  const logoLight = mode !== "gallery";

  const goPrev = useCallback(() => setActiveIndex((i) => (i - 1 + total) % total), [total]);
  const goNext = useCallback(() => setActiveIndex((i) => (i + 1) % total), [total]);

  const selectFromGallery = useCallback((i: number) => {
    // set active first so that card carries the shared layoutId, then morph back
    setActiveIndex(i);
    requestAnimationFrame(() => setMode("landing"));
  }, []);

  // Keyboard shortcuts: arrows navigate, a/s/i open gallery/save/info, esc closes
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;

      switch (e.key) {
        case "Escape":
          setMode("landing");
          break;
        case "ArrowLeft":
          if (mode !== "gallery") goPrev();
          break;
        case "ArrowRight":
          if (mode !== "gallery") goNext();
          break;
        case "a":
        case "A":
          setMode("gallery");
          break;
        case "s":
        case "S":
          setMode("save");
          break;
        case "i":
        case "I":
          setMode("info");
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, goPrev, goNext]);

  const patchActive = (patch: Partial<GradientSpec>) =>
    setSpecs((prev) => prev.map((s, i) => (i === activeIndex ? { ...s, ...patch } : s)));

  const resetActive = () =>
    setSpecs((prev) => prev.map((s, i) => (i === activeIndex ? GRADIENTS[i] : s)));

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", background: "var(--white)" }}>
      {/* Canvas: big landing canvas, or the gallery it morphs into.
          Wrapper fades in once on page load; it never remounts across mode
          switches, so the gallery/landing morph beneath it is unaffected.
          Logo and bottom strip are timed to start once this fade completes. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: CANVAS_FADE_DURATION, ease: EASE }}
      >
        {mode === "gallery" ? (
          <Gallery
            gradients={specs}
            activeIndex={activeIndex}
            onSelect={selectFromGallery}
            onClose={() => setMode("landing")}
            layoutId={CANVAS_LAYOUT_ID}
          />
        ) : (
          <LandingCanvas
            spec={activeSpec}
            activeKey={activeSpec.id}
            layoutId={CANVAS_LAYOUT_ID}
            style={{
              top: 16,
              left: 16,
              right: 16,
              bottom: 120,
              borderRadius: "var(--canvas-radius)",
            }}
          />
        )}
      </motion.div>

      {/* Logo — slides down once the canvas has finished fading in */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE, delay: CANVAS_FADE_DURATION }}
        style={{
          position: "absolute",
          top: 32,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <Logo light={logoLight} />
      </motion.div>

      {/* Bottom strip: counter + divider + menu (hidden in gallery, which has its own Close) */}
      {mode !== "gallery" && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: CANVAS_FADE_DURATION + 0.05 }}
          style={{
            position: "absolute",
            bottom: 32,
            left: 16,
            right: 16,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            zIndex: 10,
          }}
        >
          <Counter index={activeIndex} total={total} />
          <div className="divider" />
          {/* Both menus are stacked and cross-fade by mode — robust and lets
              the primary menu fade out before the Save menu staggers in. */}
          <div style={{ position: "relative", display: "flex", justifyContent: "center", width: "100%", height: 20 }}>
            <motion.div
              animate={{ opacity: mode === "save" ? 0 : 1 }}
              transition={{ duration: 0.25 }}
              style={{ position: "absolute", pointerEvents: mode === "save" ? "none" : "auto" }}
            >
              <Menu
                onPrev={goPrev}
                onNext={goNext}
                onAll={() => setMode("gallery")}
                onSave={() => setMode("save")}
                onInfo={() => setMode("info")}
              />
            </motion.div>
            <div style={{ position: "absolute", pointerEvents: mode === "save" ? "auto" : "none" }}>
              <SaveMenu
                active={mode === "save"}
                onDesktop={() => exportGradient(activeSpec, SIZE_4K)}
                onMobile={() => exportGradient(activeSpec, SIZE_MOBILE)}
                onClose={() => setMode("landing")}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Info modal / bottom-sheet */}
      <AnimatePresence>
        {mode === "info" && <InfoModal sheet={isMobile} onClose={() => setMode("landing")} />}
      </AnimatePresence>

      {isDev && (
        <DevPanel
          specs={specs}
          activeIndex={activeIndex}
          onSelectIndex={setActiveIndex}
          onChange={patchActive}
          onReset={resetActive}
        />
      )}
    </div>
  );
}
