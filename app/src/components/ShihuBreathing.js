/* eslint-disable */
import { motion } from 'framer-motion';
import shihuBodyImg from '../assets/shihu-body-layer.png';
import shihuHeadImg from '../assets/shihu-head-layer.png';
import shihuPawsImg from '../assets/shihu-paws-layer.png';

// Same layered-PNG technique as ShihuSleeping (which already exposes a
// phaseDriven mode built for exactly this contract — see its own comment on
// PHASE_TARGETS) instead of a hand-drawn SVG: body/head/paws breathe via
// Framer Motion, positioned with plain percentages of the body layer's own
// pixel box so every layer scales together at any rendered size.
const BODY_W = 658;
const BODY_H = 470;
const pct = (px, axis) => `${(px / (axis === 'x' ? BODY_W : BODY_H)) * 100}%`;

const softBreath = [0.45, 0, 0.55, 1]; // custom easeInOutSine-ish curve

// Index matches RescueScreen's PHASES order: 0 first inhale, 1 second inhale, 2 exhale, 3 pause.
const PHASE_TARGETS = [
  { bodyScale: 1.02, headRotate: -0.8, headY: 1 },
  { bodyScale: 1.04, headRotate: -1.5, headY: 2 },
  { bodyScale: 1.0, headRotate: 0, headY: 0 },
  { bodyScale: 1.0, headRotate: 0, headY: 0 },
];

// Breathing "auras" near the muzzle — same drift-and-fade technique as
// ShihuSleeping's Zzz (staggered items, Framer Motion animate/transition),
// with the glyph replaced by a soft glow and the free-running loop replaced
// by phase-driven timing: each transition's duration is the exact durationMs
// RescueScreen passes in, the same number the on-screen countdown counts
// from, so the auras finish drawing in / releasing exactly on the beat.
const AURA_ITEMS = [
  { size: 34, dx: 46, dy: 26, delay: 0 },
  { size: 24, dx: 62, dy: 40, delay: 0.05 },
  { size: 17, dx: 30, dy: 52, delay: 0.1 },
];
const AURA_START = { x: 172, y: 280 };

// Per-phase extent (0 = drawn all the way in toward the nose, 1 = fully
// released — clear of the face, out into the open background) and opacity.
// Inhale pulls the auras in and fades them down; exhale sends them out to
// full extent; pause holds that position and fades to nothing, mirroring how
// the pause phase holds the exhale pose below.
const AURA_PHASE = [
  { extent: 0.3, opacity: 0.4 },
  { extent: 0.1, opacity: 0.15 },
  { extent: 1, opacity: 0.8 },
  { extent: 1, opacity: 0 },
];

export default function ShihuBreathing({ phaseIndex, durationMs, style }) {
  const target = PHASE_TARGETS[phaseIndex] || PHASE_TARGETS[0];
  const aura = AURA_PHASE[phaseIndex] || AURA_PHASE[0];
  const durationSec = (durationMs || 4000) / 1000;

  const bodyAnimate = { scale: target.bodyScale };
  const bodyTransition = { duration: durationSec, ease: softBreath };

  // Head lags a beat behind the body's breath so the tilt reads as a
  // followthrough, not a synchronized twin motion.
  const headAnimate = { rotate: target.headRotate, y: target.headY };
  const headTransition = { duration: durationSec, ease: 'easeInOut', delay: 0.12 };

  const pawsAnimate = { scale: 1 + (target.bodyScale - 1) * 0.5, y: -(target.bodyScale - 1) * 40 };
  const pawsTransition = { duration: durationSec, ease: 'easeInOut' };

  // Ground-contact shadow: flattens + darkens as the body settles back down
  // (exhale/contract), stretches + fades as it lifts on the inhale — the
  // inverse of the body's own scale curve, on the same clock so they never
  // drift out of sync.
  const shadowStretch = Math.min(1, Math.max(0, (target.bodyScale - 1) / 0.04));
  const shadowAnimate = { width: `${60 + 9 * shadowStretch}%`, opacity: 1 - 0.5 * shadowStretch };
  const shadowTransition = { duration: durationSec, ease: softBreath };

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

      {/* Head — nested in the chest notch, tilt + bob lagging the body */}
      <motion.img
        src={shihuHeadImg}
        alt="惜惜正在練習深呼吸"
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

      {/* Breathing auras — drawn in toward the nose on inhale, released outward on exhale */}
      {AURA_ITEMS.map((a, i) => (
        <motion.div
          key={i}
          aria-hidden="true"
          initial={false}
          animate={{
            opacity: aura.opacity,
            left: pct(AURA_START.x + a.dx * aura.extent, 'x'),
            top: pct(AURA_START.y + a.dy * aura.extent, 'y'),
            scale: 0.3 + aura.extent * 0.7,
          }}
          transition={{ duration: durationSec, ease: 'easeInOut', delay: a.delay }}
          style={{
            position: 'absolute',
            left: pct(AURA_START.x, 'x'),
            top: pct(AURA_START.y, 'y'),
            width: a.size,
            height: a.size,
            marginLeft: -a.size / 2,
            marginTop: -a.size / 2,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 25%, rgba(255,244,220,0.55) 55%, rgba(255,244,220,0) 100%)',
            filter: 'blur(0.5px)',
            zIndex: 11,
            pointerEvents: 'none',
          }}
        />
      ))}
    </div>
  );
}
