interface LogoProps {
  /** true → white (over dark gradient); false → primary (over light gradient) */
  light: boolean;
}

/**
 * The "gradient" wordmark. Letter-pairs are vertically offset to form a subtle
 * arc, matching the Figma logo. Color crossfades (plain CSS transition) between
 * white and --primary depending on the gradient behind it.
 */
export default function Logo({ light }: LogoProps) {
  const parts: Array<{ text: string; dy: number }> = [
    { text: "g", dy: 9 },
    { text: "ra", dy: 5 },
    { text: "di", dy: 0 },
    { text: "ent", dy: 5 },
  ];

  return (
    <div
      aria-label="gradient"
      style={{
        display: "inline-flex",
        alignItems: "flex-start",
        fontSize: 24,
        lineHeight: 1,
        letterSpacing: "-0.72px",
        fontWeight: 400,
        userSelect: "none",
        height: 40,
        color: light ? "#ffffff" : "var(--primary)",
        transition: "color 0.5s ease",
      }}
    >
      {parts.map((p, i) => (
        <span key={i} style={{ display: "inline-block", transform: `translateY(${p.dy}px)` }}>
          {p.text}
        </span>
      ))}
    </div>
  );
}
