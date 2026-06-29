/* eslint-disable */

// Index matches RescueScreen's PHASES order: 0 first inhale, 1 second inhale, 2 exhale, 3 pause.
const EXHALE_STEP = {
  bodyY: 2, bodyScale: 0.965,
  bellyX: 0.975, bellyY: 0.985,
  shadowScale: 1.04, shadowOpacity: 0.17,
  puffA: { opacity: 0.5, x: 26, y: -46, scale: 1.2 },
  puffB: { opacity: 0.4, x: 18, y: -40, scale: 1.05 },
};

const CREATURE_STEPS = [
  {
    bodyY: -3, bodyScale: 1.025,
    bellyX: 1.03, bellyY: 1.015,
    shadowScale: 0.96, shadowOpacity: 0.13,
    puffA: { opacity: 0, x: 0, y: 0, scale: 0.4 },
    puffB: { opacity: 0, x: 0, y: 0, scale: 0.3 },
  },
  {
    bodyY: -5, bodyScale: 1.045,
    bellyX: 1.05, bellyY: 1.03,
    shadowScale: 0.9, shadowOpacity: 0.11,
    puffA: { opacity: 0, x: 0, y: 0, scale: 0.4 },
    puffB: { opacity: 0, x: 0, y: 0, scale: 0.3 },
  },
  EXHALE_STEP,
  // Pause holds the exact body/belly/shadow pose the exhale step ends on (same
  // object, not a copy, so they can't drift apart) — only the puffs fade out
  // in place rather than continuing to move.
  {
    ...EXHALE_STEP,
    puffA: { ...EXHALE_STEP.puffA, opacity: 0 },
    puffB: { ...EXHALE_STEP.puffB, opacity: 0 },
  },
];

export default function ShihuBreathing({ phaseIndex, durationMs, style }) {
  const step = CREATURE_STEPS[phaseIndex] || CREATURE_STEPS[0];
  const ease = `${durationMs}ms ease-in-out`;
  // Pause (index 3) is the one moment the creature should hold fully still —
  // freeze the idle flourishes too, not just the body/belly/shadow pose.
  const idleStyle = { animationPlayState: phaseIndex === 3 ? 'paused' : 'running' };

  const bodyStyle = {
    transformBox: 'fill-box',
    transformOrigin: '50% 100%',
    transform: `translateY(${step.bodyY}px) scale(${step.bodyScale})`,
    transition: `transform ${ease}`,
  };

  const bellyStyle = {
    transformBox: 'fill-box',
    transformOrigin: '50% 58%',
    transform: `scale(${step.bellyX}, ${step.bellyY})`,
    transition: `transform ${ease}`,
  };

  const shadowStyle = {
    transformBox: 'fill-box',
    transformOrigin: '50% 50%',
    transform: `scale(${step.shadowScale})`,
    opacity: step.shadowOpacity,
    transition: `transform ${ease}, opacity ${ease}`,
  };

  const puffStyle = (p) => ({
    transformBox: 'fill-box',
    transformOrigin: '50% 50%',
    opacity: p.opacity,
    transform: `translate(${p.x}px, ${p.y}px) scale(${p.scale})`,
    transition: `transform ${ease}, opacity ${ease}`,
  });

  return (
    <svg viewBox="0 0 460 460" width="100%" height="100%" style={{ display: 'block', overflow: 'visible', ...style }}>
      <defs>
        <filter id="shihu-soft" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
      </defs>

      <ellipse cx="235" cy="432" rx="134" ry="24" fill="#6b4a2f" style={shadowStyle} />

      <g className="shihu-tail" style={idleStyle}>
        <path d="M335 398 Q 426 374 414 290 Q 408 246 374 240" fill="none" stroke="#d7a263" strokeWidth="36" strokeLinecap="round" />
        <path d="M335 398 Q 426 374 414 290 Q 408 246 374 240" fill="none" stroke="#5c4329" strokeWidth="36" strokeLinecap="butt" strokeDasharray="15 46" opacity=".8" />
        <circle cx="374" cy="240" r="13" fill="#4f3a23" />
      </g>

      <g style={bodyStyle}>
        <g style={bellyStyle}>
          <ellipse cx="235" cy="324" rx="123" ry="116" fill="#d7a263" />
          <ellipse cx="235" cy="350" rx="73" ry="90" fill="#f6ead2" />
          <ellipse cx="152" cy="298" rx="12" ry="9" fill="#5c4329" opacity=".5" />
          <ellipse cx="142" cy="356" rx="11" ry="9" fill="#5c4329" opacity=".5" />
          <ellipse cx="167" cy="406" rx="11" ry="9" fill="#5c4329" opacity=".5" />
          <ellipse cx="181" cy="252" rx="11" ry="9" fill="#5c4329" opacity=".5" />
          <ellipse cx="320" cy="298" rx="12" ry="9" fill="#5c4329" opacity=".5" />
          <ellipse cx="330" cy="356" rx="11" ry="9" fill="#5c4329" opacity=".5" />
          <ellipse cx="305" cy="406" rx="11" ry="9" fill="#5c4329" opacity=".5" />
          <ellipse cx="291" cy="252" rx="11" ry="9" fill="#5c4329" opacity=".5" />
        </g>

        <g>
          <g className="shihu-ear-l" style={idleStyle}>
            <path d="M150 110 Q 150 50 169 32 Q 184 45 214 98 Q 186 118 150 110 Z" fill="#d7a263" />
            <path d="M167 102 Q 170 62 180 50 Q 190 62 201 100 Q 184 110 167 102 Z" fill="#e9b9a8" />
            <path d="M150 110 Q 150 50 169 32 Q 176 42 182 56 Q 165 78 150 110 Z" fill="#4f3a23" opacity=".55" />
          </g>
          <g className="shihu-ear-r" style={idleStyle}>
            <path d="M320 110 Q 320 50 301 32 Q 286 45 256 98 Q 284 118 320 110 Z" fill="#d7a263" />
            <path d="M303 102 Q 300 62 290 50 Q 280 62 269 100 Q 286 110 303 102 Z" fill="#e9b9a8" />
            <path d="M320 110 Q 320 50 301 32 Q 294 42 288 56 Q 305 78 320 110 Z" fill="#4f3a23" opacity=".55" />
          </g>

          <circle cx="235" cy="172" r="99" fill="#d7a263" />

          <path d="M235 96 Q 230 122 235 146 Q 240 122 235 96 Z" fill="#5c4329" opacity=".7" />
          <path d="M212 102 Q 205 126 211 148 Q 219 126 218 104 Z" fill="#5c4329" opacity=".6" />
          <path d="M258 102 Q 265 126 259 148 Q 251 126 252 104 Z" fill="#5c4329" opacity=".6" />

          <ellipse cx="210" cy="222" rx="40" ry="34" fill="#f8efdc" />
          <ellipse cx="260" cy="222" rx="40" ry="34" fill="#f8efdc" />

          <ellipse cx="160" cy="204" rx="20" ry="12" fill="#ef9f86" opacity=".4" />
          <ellipse cx="310" cy="204" rx="20" ry="12" fill="#ef9f86" opacity=".4" />

          <g stroke="#fff7ea" strokeWidth="2.4" strokeLinecap="round" opacity=".75" fill="none">
            <path d="M178 208 Q 140 202 110 196" />
            <path d="M178 216 Q 138 216 106 214" />
            <path d="M178 224 Q 140 230 112 234" />
            <path d="M292 208 Q 330 202 360 196" />
            <path d="M292 216 Q 332 216 364 214" />
            <path d="M292 224 Q 330 230 358 234" />
          </g>

          <g className="shihu-eyes" style={idleStyle}>
            <ellipse cx="193" cy="178" rx="23" ry="27" fill="#4a3526" />
            <ellipse cx="277" cy="178" rx="23" ry="27" fill="#4a3526" />
            <circle cx="186" cy="169" r="7.5" fill="#fffaf2" />
            <circle cx="270" cy="169" r="7.5" fill="#fffaf2" />
            <circle cx="199" cy="187" r="3.4" fill="#fffaf2" opacity=".8" />
            <circle cx="283" cy="187" r="3.4" fill="#fffaf2" opacity=".8" />
          </g>

          <path d="M224 200 Q 235 195 246 200 Q 241 214 235 217 Q 229 214 224 200 Z" fill="#e6928f" />
          <path d="M235 217 Q 235 228 222 230" fill="none" stroke="#5c4329" strokeWidth="3" strokeLinecap="round" />
          <path d="M235 217 Q 235 228 248 230" fill="none" stroke="#5c4329" strokeWidth="3" strokeLinecap="round" />
        </g>
      </g>

      <g>
        <ellipse cx="196" cy="434" rx="31" ry="20" fill="#ecdcbf" />
        <ellipse cx="274" cy="434" rx="31" ry="20" fill="#ecdcbf" />
        <g stroke="#cdb792" strokeWidth="2.2" strokeLinecap="round" fill="none">
          <path d="M190 426 L 189 440" />
          <path d="M202 426 L 203 440" />
          <path d="M268 426 L 267 440" />
          <path d="M280 426 L 281 440" />
        </g>
      </g>

      <g filter="url(#shihu-soft)">
        <circle cx="252" cy="206" r="9" fill="#fffaf2" style={puffStyle(step.puffA)} />
        <circle cx="258" cy="210" r="6" fill="#fffaf2" style={puffStyle(step.puffB)} />
      </g>

      <g filter="url(#shihu-soft)" fill="#fff4dc">
        <circle cx="116" cy="404" r="5" className="shihu-mote" style={{ animationDuration: '12s' }} />
        <circle cx="344" cy="420" r="4" className="shihu-mote" style={{ animationDuration: '14s', animationDelay: '-4s' }} />
        <circle cx="74" cy="320" r="3.5" className="shihu-mote" style={{ animationDuration: '10s', animationDelay: '-7s' }} />
        <circle cx="386" cy="330" r="4.5" className="shihu-mote" style={{ animationDuration: '13s', animationDelay: '-2s' }} />
        <circle cx="210" cy="440" r="3.5" className="shihu-mote" style={{ animationDuration: '11s', animationDelay: '-9s' }} />
      </g>
    </svg>
  );
}
