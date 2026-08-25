// Shared design tokens for the Shihu character components (ShihuBreathing,
// ShihuSleeping) — one gradient/color/spring palette so both screens stay
// visually and physically consistent.

export const shihuColors = {
  cream: '#f6ead2',
  tawny: '#d7a263',
  tawnyDeep: '#a9713c',
  cocoa: '#5c4329',
  cocoaDark: '#4a3526',
  blush: '#e6928f',
  glow: '#e0a768',
};

// Sine-shaped easing so a looped spring (from -> to -> from) reads as one
// continuous smooth cycle rather than two eased-then-snap halves.
export const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;

export const shihuSprings = {
  // Slow, continuous loops (flank breathing, glow) — not tied to any
  // external clock, so a plain duration + sine easing reads as "physical"
  // without needing tension/friction tuning.
  sleepLoop: { duration: 6000, easing: easeInOutSine },
  glowLoop: { duration: 4500, easing: easeInOutSine },
  // Punctuated, physically-driven accents (zzz drift settle).
  zzzDrift: { tension: 40, friction: 14, mass: 1 },
};
