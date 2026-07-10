import type { GradientSpec } from "../types";

/** Design width the blur presets were authored at (Figma artboard). */
const DESIGN_WIDTH = 402;

export interface ExportSize {
  width: number;
  height: number;
  label: string; // used in the filename
}

export const SIZE_4K: ExportSize = { width: 3840, height: 2160, label: "4k" };
export const SIZE_MOBILE: ExportSize = { width: 1080, height: 1920, label: "mobile-9x16" };

/** Build a small grayscale noise tile as a repeatable pattern. */
function makeNoiseTile(size = 256): HTMLCanvasElement {
  const tile = document.createElement("canvas");
  tile.width = size;
  tile.height = size;
  const tctx = tile.getContext("2d")!;
  const img = tctx.createImageData(size, size);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const v = (Math.random() * 255) | 0;
    d[i] = v;
    d[i + 1] = v;
    d[i + 2] = v;
    d[i + 3] = 255;
  }
  tctx.putImageData(img, 0, 0);
  return tile;
}

/**
 * Render a gradient (base + blur smoothing + grain) to an offscreen canvas at
 * the target resolution. Mirrors GradientCanvas so the download matches screen.
 */
export function renderGradientToCanvas(spec: GradientSpec, size: ExportSize): HTMLCanvasElement {
  const { width, height } = size;

  // 1. gradient onto an offscreen buffer
  const base = document.createElement("canvas");
  base.width = width;
  base.height = height;
  const bctx = base.getContext("2d")!;
  const grad = bctx.createLinearGradient(0, 0, 0, height); // 180deg = top→bottom
  for (const s of spec.stops) {
    grad.addColorStop(Math.max(0, Math.min(1, s.pos / 100)), s.color);
  }
  bctx.fillStyle = grad;
  bctx.fillRect(0, 0, width, height);

  // 2. compose onto the output canvas, blurred to smooth banding
  const out = document.createElement("canvas");
  out.width = width;
  out.height = height;
  const ctx = out.getContext("2d")!;
  const blurPx = spec.blur * (width / DESIGN_WIDTH);
  if (blurPx > 0) {
    ctx.filter = `blur(${blurPx}px)`;
    // extend slightly beyond edges so the blur doesn't darken the border
    const pad = Math.ceil(blurPx);
    ctx.drawImage(base, -pad, -pad, width + pad * 2, height + pad * 2);
    ctx.filter = "none";
  } else {
    ctx.drawImage(base, 0, 0);
  }

  // 3. grain layer
  const tile = makeNoiseTile();
  const pattern = ctx.createPattern(tile, "repeat")!;
  ctx.save();
  ctx.globalCompositeOperation = spec.noise.blendMode as GlobalCompositeOperation;
  ctx.globalAlpha = spec.noise.opacity;
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  return out;
}

/** Trigger a browser download of a canvas as PNG. */
function downloadCanvas(canvas: HTMLCanvasElement, filename: string): Promise<void> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        resolve();
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      resolve();
    }, "image/png");
  });
}

/** Render + download a gradient at the given size. */
export async function exportGradient(spec: GradientSpec, size: ExportSize): Promise<void> {
  const canvas = renderGradientToCanvas(spec, size);
  await downloadCanvas(canvas, `gradient-${spec.id}-${size.label}.png`);
}
