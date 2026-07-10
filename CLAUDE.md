# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Vite dev server (http://localhost:5173). Append `?dev` to the URL to show the `DevPanel` tuning UI.
- `npm run build` — type-check (`tsc -b`) then production build. Type errors fail the build.
- `npm run lint` — oxlint.
- `npm run preview` — serve the production build (verify `?dev` panel is absent here).

There is no test suite.

## What this is

A single-page gradient gallery showcase site (Vite + React 19 + TypeScript + framer-motion, plain CSS with tokens — no Tailwind). Serif type is Crimson Pro self-hosted via `@fontsource/crimson-pro`. Design source is the Figma file key `GTo9SJHjrLOJUFYVPwKmM1`; inspect it with the Figma MCP when changing visuals.

## Architecture

**`src/data/gradients.ts` is the single source of truth.** Each gradient is a `GradientSpec` (`src/types.ts`): ordered `stops`, `blur` radius, and a `noise` preset. To add a gradient, append one entry — the counter, gallery, screen render, and PNG export all derive from this array. Blur values are authored at the Figma design width of **402px** and scaled up elsewhere (see `DESIGN_WIDTH` in `exportImage.ts`).

**One page, no router.** `src/App.tsx` is a state machine over `mode ∈ {landing, gallery, save, info}` driving all transitions with framer-motion. Escape returns to `landing`.

**Render pipeline (screen).** `GradientLayers` stacks three absolute-filled layers: base CSS `linear-gradient`, a self-blurred copy (`blur(spec.blur * blurScale px)`), and `Noise`. `Noise` is procedural grayscale grain via inline SVG `feTurbulence` (desaturated with `feColorMatrix`), tunable per-gradient. `GradientCanvas` wraps this in a `motion.div` that carries a shared `layoutId` so the same component morphs between the full landing canvas and a gallery card. Gallery cards pass `blurScale={0.3}` because the 50px presets over-blur small cards.

**Export pipeline (download).** `src/lib/exportImage.ts` re-renders the gradient to an offscreen `<canvas>` from the spec (NOT a DOM screenshot — that mangles blend modes/blur), at 4K `3840×2160` or mobile `1080×1920`, then triggers a PNG download. Keep this visually in sync with `GradientLayers` when changing the render.

**Adaptive logo color.** `src/lib/luminance.ts` computes the gradient's color at the logo's vertical position and its relative luminance; `isDarkAt(spec, 0)` (threshold 0.32) decides white vs `--primary`. In gallery mode the logo is always dark (white background). The `Logo` component sets color via plain inline `style` + a CSS `transition` — do NOT animate color through framer-motion, which cannot interpolate the `var(--primary)` CSS variable.

**DevPanel** (`?dev` only) mutates the active spec in memory for live tuning; copy tuned values back into `gradients.ts` to persist them.

## Design tokens

`src/styles/tokens.css` holds all colors/spacing/easing as CSS custom properties (`--primary #14151a`, `--ease-soft`, etc.). Component styles live in `src/styles/components.css`. Use tokens rather than hardcoding values.

## Browser-automation gotcha

When verifying with the Claude-in-Chrome MCP: framer-motion animations freeze because rAF is paused while the automation tab is backgrounded, so mid-animation screenshots look "stuck/reverted." Verify DOM/state through `javascript_tool` (e.g. `getComputedStyle`, `.click()`) rather than trusting screenshots; element-`ref` clicks sometimes don't fire React `onClick`.
