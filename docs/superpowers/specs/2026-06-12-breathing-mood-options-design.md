# Breathing mood options — design

**Date:** 2026-06-12
**Status:** Approved by user (via visual companion mockups)

## Goal

Give the mood-selection UI the organic, alive quality of the "How We Feel" app, adapted to sioh-sioh's calm aesthetic. The chosen style is **breathing circles**: shapes stay circular and gently scale with a pulsing colored halo — not the full How-We-Feel blob morphing (options for morphing blobs were shown and declined).

## Scope

Two screens:

1. `app/src/screens/AffectGridScreen.js` — the 2×2 quadrant picker (你的感受比較接近哪一種？)
2. `app/src/screens/EmotionScreen.js` — the fog canvas of emotion words (這個感受有名字嗎？)

No new dependencies. Pure CSS keyframes added to `app/src/index.css`, parameterized per element with CSS variables (`--dur`, `--del`, `--halo`, `--glow`).

## Design

### Quadrant picker (AffectGridScreen)

- The four rounded-rectangle buttons become **filled colored circles** (each quadrant's color from `QUADRANTS` in `data/emotions.js`, white label text), still laid out in the existing 2×2 grid with the existing axis labels (能量高/能量低/感覺好/感覺不好).
- Each circle breathes continuously: scale 1 → 1.05 plus a soft glow in its own color, ~4s ease-in-out infinite, with staggered animation delays (0 / -1s / -2s / -3s) so the four never pulse in sync.
- **Selection state** (replaces the old white-vs-filled cue, since all circles are now filled):
  - Selected: white ring border, stronger glow, slightly larger breathing.
  - Unselected (when something is selected): dimmed to ~50% opacity.
- Unchanged: the 重置 button, the disabled-until-selected continue button, and the HA_NEG → `/rescue` routing.

### Fog canvas (EmotionScreen)

- **Every word breathes**, visibly: scale 1 → ~1.09, with a soft colored halo that pulses in and out with the breath.
  - The halo is a `::before` pseudo-element with a radial gradient, animated on **opacity only** (0.25 → 0.85) — GPU-cheap with ~50 words.
  - Per-word randomized duration (3.5–5.5s) and negative delay, assigned once in `buildWordLayout()` so the fog shimmers organically rather than pulsing in unison.
- **Selected words** (max 2) get a stronger treatment: bold (existing), bigger breathing (~1.07 at a larger base size), and an animated colored `box-shadow` glow. Animating box-shadow is acceptable here because at most 2 elements have it.
- Unchanged: fog opacity falloff, drag-to-pan, tap-vs-drag threshold, two-word selection limit, definition card, 跳過 flow.

### Accessibility

- All breathing animations are disabled under `@media (prefers-reduced-motion: reduce)`, consistent with the existing `.fade-up` handling in `index.css`.

## Implementation notes

- Keyframes to add in `index.css`: a word-breathe scale animation, a halo opacity pulse, a selected-glow breathe, and a quadrant-circle breathe. Names should follow the existing lowercase camelCase keyframe convention (`breatheIn`, `fadeUp`, …).
- Inline styles are the established pattern in this codebase's screens; per-element animation parameters are passed as CSS variables in the `style` prop, while shared keyframes/classes live in `index.css`.
- The fog-word `div`s currently have no `transform`; the breathing scale transform composes with their absolute `left/top` positioning without layout changes. The existing `transition: font-size` on selection remains.

## Testing

Manual verification (no test infrastructure in this project):

1. Quadrant picker: circles breathe out of sync; selecting shows white ring + glow and dims others; 重置 and routing still work.
2. Fog canvas: all words visibly breathe at different paces; selecting 1–2 words shows glow; pan/drag and the definition card still work; performance stays smooth while panning on a phone-sized viewport.
3. With "Reduce Motion" enabled in OS settings, nothing pulses.

## Approval trail

- Motion style: option C "breathing circles" chosen over full How-We-Feel blob personalities (A) and uniform morph (B).
- Quadrant picker: option B "convert to breathing circles" chosen over keeping rectangles.
- Fog canvas: v2 approved — all words breathe ~9% with pulsing halos; selected word keeps the strongest glow.
