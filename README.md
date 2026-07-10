# Gradient Gallery

A single-page gradient showcase site. Browse a curated set of gradients, save one you like as a wallpaper, and export it as a high-res PNG.

Built with Vite, React 19, TypeScript, and Framer Motion — plain CSS with design tokens, no Tailwind. Serif type is Crimson Pro, self-hosted via `@fontsource/crimson-pro`.

## Getting started

```sh
npm install
npm run dev
```

Opens at `http://localhost:5173`. Append `?dev` to the URL (e.g. `http://localhost:5173/?dev`) to show the `DevPanel`, a live tuning UI for adjusting a gradient's blur and noise in the browser.

## Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check (`tsc -b`) then build for production — type errors fail the build |
| `npm run lint` | Lint with oxlint |
| `npm run preview` | Serve the production build locally |

There is no test suite.

## How it works

- **`src/data/gradients.ts`** is the single source of truth. Each gradient is a `GradientSpec` — ordered color stops, a blur radius, and a noise preset. Adding an entry here is enough to add a gradient everywhere: the counter, the gallery grid, the on-screen render, and the PNG export all derive from this array.
- **One page, no router.** `src/App.tsx` is a small state machine (`landing → gallery → save → info`) that drives all transitions with Framer Motion. Escape returns to the landing view.
- **On-screen rendering** (`GradientLayers`) stacks a base CSS gradient, a blurred copy of itself, and a procedural noise layer (an inline SVG `feTurbulence` filter) to avoid banding and add texture.
- **Exporting** (`src/lib/exportImage.ts`) re-renders the gradient to an offscreen `<canvas>` from the spec — not a screenshot of the DOM, since that would mangle blur and blend modes — at 4K (`3840×2160`) or mobile (`1080×1920`) resolution, then downloads it as a PNG.
- **Adaptive logo color** (`src/lib/luminance.ts`) samples the gradient's color and luminance at the logo's position to decide whether the logo renders white or dark.

## Design source

Design tokens (colors, spacing, easing) are defined as CSS custom properties in `src/styles/tokens.css`.
