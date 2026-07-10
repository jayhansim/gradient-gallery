import type { CSSProperties } from "react";
import type { BlendMode, GradientSpec } from "../types";

interface DevPanelProps {
  spec: GradientSpec;
  onChange: (patch: Partial<GradientSpec>) => void;
}

const BLENDS: BlendMode[] = ["multiply", "soft-light", "overlay", "screen", "normal"];

const row: CSSProperties = { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 8 };
const label: CSSProperties = { fontFamily: "system-ui, sans-serif", fontSize: 11, color: "#cfd2dd" };

/**
 * Dev-only tuning panel (gated behind ?dev). Adjusts the active gradient's blur
 * and grain live; copy the printed values back into data/gradients.ts.
 */
export default function DevPanel({ spec, onChange }: DevPanelProps) {
  const n = spec.noise;
  const setNoise = (patch: Partial<typeof n>) => onChange({ noise: { ...n, ...patch } });

  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 100,
        width: 240,
        padding: 14,
        borderRadius: 10,
        background: "rgba(20,21,26,0.86)",
        backdropFilter: "blur(8px)",
        color: "#fff",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 10 }}>
        dev · {spec.name} ({spec.id})
      </div>

      <div style={row}>
        <span style={label}>blur {spec.blur}px</span>
      </div>
      <input type="range" min={0} max={80} step={1} value={spec.blur} onChange={(e) => onChange({ blur: +e.target.value })} style={{ width: "100%" }} />

      <div style={{ ...row, marginTop: 10 }}>
        <span style={label}>grain (baseFreq) {n.baseFrequency.toFixed(2)}</span>
      </div>
      <input type="range" min={0.1} max={2} step={0.05} value={n.baseFrequency} onChange={(e) => setNoise({ baseFrequency: +e.target.value })} style={{ width: "100%" }} />

      <div style={{ ...row, marginTop: 10 }}>
        <span style={label}>octaves {n.numOctaves}</span>
      </div>
      <input type="range" min={1} max={5} step={1} value={n.numOctaves} onChange={(e) => setNoise({ numOctaves: +e.target.value })} style={{ width: "100%" }} />

      <div style={{ ...row, marginTop: 10 }}>
        <span style={label}>opacity {n.opacity.toFixed(2)}</span>
      </div>
      <input type="range" min={0} max={1} step={0.02} value={n.opacity} onChange={(e) => setNoise({ opacity: +e.target.value })} style={{ width: "100%" }} />

      <div style={{ ...row, marginTop: 10 }}>
        <span style={label}>blend</span>
        <select value={n.blendMode} onChange={(e) => setNoise({ blendMode: e.target.value as BlendMode })} style={{ fontSize: 11 }}>
          {BLENDS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={() => console.log(JSON.stringify(spec, null, 2))}
        style={{ marginTop: 12, width: "100%", padding: "6px 0", fontSize: 11, background: "#fff", color: "#14151a", borderRadius: 6 }}
      >
        log spec to console
      </button>
    </div>
  );
}
