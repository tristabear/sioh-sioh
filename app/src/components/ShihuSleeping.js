/* eslint-disable */
import { motion, useReducedMotion } from 'framer-motion';
import shihuBodyImg from '../assets/shihu-body-layer.png';
import shihuHeadImg from '../assets/shihu-head-layer.png';
import shihuPawsImg from '../assets/shihu-paws-layer.png';

// Container coordinate system == the body layer's native pixel box, so every
// other layer can be positioned/sized against it with plain percentages.
const BODY_W = 658;
const BODY_H = 470;
const pct = (px, axis) => `${(px / (axis === 'x' ? BODY_W : BODY_H)) * 100}%`;

// Ambient (no phase prop) fallback: the ombre glow + body/chest breathe on a
// slow 6s loop, same cadence the previous PNG version shipped with.
const AMBIENT_DURATION = 6;
const softBreath = [0.45, 0, 0.55, 1]; // custom easeInOutSine-ish curve

// Phase-driven mode (RescueScreen-style Inhale/Hold/Exhale contract, matching
// ShihuBreathing's phaseIndex/durationMs props): 0/1 inhale, 2 exhale, 3 hold.
const PHASE_TARGETS = [
  { bodyScale: 1.02, headRotate: -0.8, headY: 1 },
  { bodyScale: 1.04, headRotate: -1.5, headY: 2 },
  { bodyScale: 1.0, headRotate: 0, headY: 0 },
  { bodyScale: 1.0, headRotate: 0, headY: 0 },
];

// Drift paths for the three "Zzz"s, floating up from near the top ear.
// Sizes shrink and durations lengthen going outward, so they read as one
// symbol dissolving upward rather than three synced clones. dx/dy are in the
// same BODY_W/BODY_H coordinate space as every other layer (via pct()) so the
// drift scales with the rendered size instead of overshooting a small
// container on narrow screens.
const Z_ITEMS = [
  { size: 22, dx: 14, dy: -34, duration: 3.2, delay: 0 },
  { size: 16, dx: 22, dy: -46, duration: 3.7, delay: 1.1 },
  { size: 12, dx: 30, dy: -58, duration: 4.1, delay: 2.15 },
];
const Z_START = { x: 300, y: 50 };

export default function ShihuSleeping({ style, phaseIndex, durationMs }) {
  const reduceMotion = useReducedMotion();
  const phaseDriven = phaseIndex != null;
  const target = PHASE_TARGETS[phaseIndex] || PHASE_TARGETS[0];

  const bodyAnimate = reduceMotion
    ? undefined
    : phaseDriven
    ? { scale: target.bodyScale }
    : { scale: [1, 1.04, 1] };
  const bodyTransition = phaseDriven
    ? { duration: (durationMs || 4000) / 1000, ease: softBreath }
    : { duration: AMBIENT_DURATION, repeat: Infinity, repeatType: 'loop', ease: softBreath };

  // Head lags a beat behind the body's breath so the drowsy tilt reads as a
  // followthrough, not a synchronized twin motion.
  const headAnimate = reduceMotion
    ? undefined
    : phaseDriven
    ? { rotate: target.headRotate, y: target.headY }
    : { rotate: [0, -1.5, 0], y: [0, 2, 0] };
  const headTransition = phaseDriven
    ? { duration: (durationMs || 4000) / 1000, ease: 'easeInOut', delay: 0.12 }
    : { duration: AMBIENT_DURATION, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut', delay: 0.35 };

  const pawsAnimate = reduceMotion
    ? undefined
    : phaseDriven
    ? { scale: 1 + (target.bodyScale - 1) * 0.5, y: -(target.bodyScale - 1) * 40 }
    : { scale: [1, 1.02, 1], y: [0, -1, 0] };
  const pawsTransition = phaseDriven
    ? { duration: (durationMs || 4000) / 1000, ease: 'easeInOut' }
    : { duration: AMBIENT_DURATION, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' };

  // Ground-contact shadow: flattens + darkens as the body settles back down
  // (exhale/contract), stretches + fades as it lifts on the inhale — the
  // inverse of the body's own scale curve, on the same clock so they never
  // drift out of sync.
  const shadowStretch = phaseDriven ? Math.min(1, Math.max(0, (target.bodyScale - 1) / 0.04)) : null;
  const shadowAnimate = reduceMotion
    ? undefined
    : phaseDriven
    ? { width: `${60 + 9 * shadowStretch}%`, opacity: 1 - 0.5 * shadowStretch }
    : { width: ['60%', '69%', '60%'], opacity: [1, 0.5, 1] };
  const shadowTransition = phaseDriven
    ? { duration: (durationMs || 4000) / 1000, ease: softBreath }
    : { duration: AMBIENT_DURATION, repeat: Infinity, repeatType: 'loop', ease: softBreath };

  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: `${BODY_W} / ${BODY_H}`, ...style }}>
      {/* Ground shadow — sits directly beneath the cat's base, breathing in sync with the body */}
      <motion.div
        aria-hidden="true"
        animate={shadowAnimate}
        transition={shadowTransition}
        style={{
          position: 'absolute',
          left: '50%',
          top: pct(368, 'y'),
          width: '60%',
          height: pct(38, 'y'),
          transform: 'translateX(-50%)',
          borderRadius: '50%',
          background: 'rgba(0, 0, 0, 0.08)',
          filter: 'blur(8px)',
          zIndex: 0,
        }}
      />

      {/* Body — the curled chest/back, breathes with the main scale loop */}
      <motion.img
        src={shihuBodyImg}
        alt=""
        animate={bodyAnimate}
        transition={bodyTransition}
        style={{
          position: 'absolute',
          left: pct(78, 'x'),
          top: pct(62, 'y'),
          width: pct(436, 'x'),
          height: 'auto',
          transformOrigin: '50% 65%',
          zIndex: 1,
        }}
      />

      {/* Head — nested in the chest notch, drowsy tilt + bob lagging the body */}
      <motion.img
        src={shihuHeadImg}
        alt="惜惜安穩地睡著了"
        animate={headAnimate}
        transition={headTransition}
        style={{
          position: 'absolute',
          left: pct(0, 'x'),
          top: pct(35, 'y'),
          width: pct(339, 'x'),
          height: 'auto',
          transformOrigin: '50% 85%',
          zIndex: 2,
        }}
      />

      {/* Paws — topmost foreground layer, resting over the chin/chest boundary */}
      <motion.img
        src={shihuPawsImg}
        alt=""
        animate={pawsAnimate}
        transition={pawsTransition}
        style={{
          position: 'absolute',
          left: pct(88, 'x'),
          top: pct(295, 'y'),
          width: pct(216, 'x'),
          height: 'auto',
          transformOrigin: '50% 30%',
          zIndex: 10,
        }}
      />

      {/* Drifting "Zzz"s — rise from near the top ear in a gentle, staggered loop */}
      {Z_ITEMS.map((z, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          animate={reduceMotion ? undefined : {
            opacity: [0, 0.85, 0],
            left: [pct(Z_START.x, 'x'), pct(Z_START.x + z.dx * 0.6, 'x'), pct(Z_START.x + z.dx, 'x')],
            top: [pct(Z_START.y, 'y'), pct(Z_START.y + z.dy * 0.6, 'y'), pct(Z_START.y + z.dy, 'y')],
          }}
          transition={reduceMotion ? undefined : {
            duration: z.duration,
            delay: z.delay,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            left: pct(Z_START.x, 'x'),
            top: pct(Z_START.y, 'y'),
            fontSize: z.size,
            fontWeight: 900,
            color: '#f6ead2',
            textShadow: '0 1px 3px rgba(76, 53, 30, 0.35)',
            opacity: reduceMotion ? 0.5 : 0,
            zIndex: 11,
            pointerEvents: 'none',
          }}
        >
          Z
        </motion.span>
      ))}
    </div>
  );
}
