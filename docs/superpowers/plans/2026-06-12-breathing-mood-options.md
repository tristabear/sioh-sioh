# Breathing Mood Options Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the mood-selection UI breathe like the "How We Feel" app — the quadrant picker becomes four breathing colored circles, and every fog-canvas emotion word gently breathes with a pulsing halo.

**Architecture:** Pure CSS keyframe animations added to `app/src/index.css`, parameterized per element with CSS variables (`--dur`, `--del`, `--halo`, `--glow`) set from inline `style` props (the established pattern in this codebase). Two screens are modified: `AffectGridScreen.js` (buttons → circles) and `EmotionScreen.js` (per-word randomized breathing assigned once in `buildWordLayout()`). No new dependencies.

**Tech Stack:** React 18 (CRA / react-scripts 5), vanilla CSS. No test infrastructure exists in this project — verification is `npm run build` plus the manual checklist in the spec (`docs/superpowers/specs/2026-06-12-breathing-mood-options-design.md`).

---

### Task 1: CSS keyframes and classes

**Files:**
- Modify: `app/src/index.css` (animations section, around line 152-184)

- [ ] **Step 1: Add the breathing keyframes and classes**

In `app/src/index.css`, find the `/* ── Animations ── */` section. After the existing `shimmer` keyframes (line ~172) and before `.fade-up`, add:

```css
/* Breathing mood options (see docs/superpowers/specs/2026-06-12-breathing-mood-options-design.md) */
@keyframes circleBreathe {
  0%   { transform: scale(1); box-shadow: 0 0 0 0 transparent; }
  50%  { transform: scale(1.05); box-shadow: 0 0 22px 4px var(--glow, transparent); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 transparent; }
}
@keyframes wordBreathe {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.09); }
  100% { transform: scale(1); }
}
@keyframes haloPulse {
  0%   { opacity: 0.25; }
  50%  { opacity: 0.85; }
  100% { opacity: 0.25; }
}
@keyframes selectedBreathe {
  0%   { transform: scale(1); box-shadow: 0 0 6px 0 var(--glow, transparent); }
  50%  { transform: scale(1.07); box-shadow: 0 0 28px 8px var(--glow, transparent); }
  100% { transform: scale(1); box-shadow: 0 0 6px 0 var(--glow, transparent); }
}

.quad-breathe {
  animation: circleBreathe 4s ease-in-out var(--del, 0s) infinite;
}

.fog-breathe {
  animation: wordBreathe var(--dur, 4.5s) ease-in-out var(--del, 0s) infinite;
}
/* Pulsing halo behind every fog word — animates opacity only (GPU-cheap with ~50 words) */
.fog-breathe::before {
  content: '';
  position: absolute;
  inset: -14%;
  border-radius: 50%;
  background: radial-gradient(circle, var(--halo, transparent) 0%, transparent 70%);
  animation: haloPulse var(--dur, 4.5s) ease-in-out var(--del, 0s) infinite;
  z-index: -1;
  pointer-events: none;
}
.fog-breathe.sel {
  animation: selectedBreathe var(--dur, 4.5s) ease-in-out var(--del, 0s) infinite;
}
```

- [ ] **Step 2: Extend the reduced-motion block**

In the same file, replace:

```css
@media (prefers-reduced-motion: reduce) {
  .fade-up { animation: none; opacity: 1; }
}
```

with:

```css
@media (prefers-reduced-motion: reduce) {
  .fade-up { animation: none; opacity: 1; }
  .quad-breathe,
  .fog-breathe,
  .fog-breathe::before,
  .fog-breathe.sel { animation: none; }
}
```

- [ ] **Step 3: Verify the build compiles**

Run: `cd /Users/johanhsiung/sioh-sioh/app && npm run build`
Expected: "Compiled successfully."

- [ ] **Step 4: Commit**

```bash
git add app/src/index.css
git commit -m "Add breathing animation keyframes for mood options"
```

---

### Task 2: Quadrant picker — buttons become breathing circles

**Files:**
- Modify: `app/src/screens/AffectGridScreen.js:39-62` (the quadrant button grid)

- [ ] **Step 1: Replace the quadrant button rendering**

In `app/src/screens/AffectGridScreen.js`, replace the `QUADRANTS.map` block (currently lines 40-62):

```jsx
{QUADRANTS.map((q, i) => {
  const isSel = selected?.id === q.id;
  const dimmed = selected && !isSel;
  const [line1, line2] = q.label.split('・');
  return (
    <button
      key={q.id}
      onClick={() => setSelected(q)}
      className="quad-breathe"
      style={{
        '--del': `${-i}s`,
        '--glow': `${q.color}${isSel ? '88' : '59'}`,
        aspectRatio: '1 / 1',
        borderRadius: '50%',
        border: isSel ? '3px solid #fff' : '3px solid transparent',
        background: q.color,
        color: '#fff',
        fontSize: 15,
        fontWeight: 700,
        fontFamily: 'var(--font-sans)',
        lineHeight: 1.5,
        cursor: 'pointer',
        opacity: dimmed ? 0.5 : 1,
        transition: 'opacity 0.25s, border-color 0.25s',
      }}
    >
      {line1}<br />{line2}
    </button>
  );
})}
```

Notes for the implementer:
- `'--del'` and `'--glow'` are CSS custom properties — React passes them through in the `style` object as-is.
- `q.label` values are like `高能量・感覺不好` — splitting on `・` gives the two display lines.
- The hex-alpha suffixes: `59` ≈ 35% glow when idle, `88` ≈ 53% glow when selected.
- The white ring is a `border` so it doesn't fight the animated `box-shadow` glow; `3px solid transparent` when unselected keeps the circle size stable.
- The breathing stagger comes from `--del: 0s / -1s / -2s / -3s` via the map index.
- Everything else in the file (axis labels, 重置 button, `needsRescue` routing, continue button) stays untouched.

- [ ] **Step 2: Verify the build compiles**

Run: `cd /Users/johanhsiung/sioh-sioh/app && npm run build`
Expected: "Compiled successfully."

- [ ] **Step 3: Manual check**

Run: `cd /Users/johanhsiung/sioh-sioh/app && npm start`, open the 練習 flow to the quadrant screen (`/check/affect` route — navigate from home → 開始).
Verify:
- Four colored circles breathe gently, out of sync.
- Tapping one shows a white ring + stronger glow; the other three dim to 50%.
- 重置 clears selection; all circles return to full opacity.
- Selecting 高能量・感覺不好 and continuing routes to `/rescue`; others route to `/check/emotion`.

- [ ] **Step 4: Commit**

```bash
git add app/src/screens/AffectGridScreen.js
git commit -m "Quadrant picker: breathing colored circles"
```

---

### Task 3: Fog canvas — every word breathes

**Files:**
- Modify: `app/src/screens/EmotionScreen.js` (in `buildWordLayout()` ~line 66-77, and the word rendering ~line 287-327)

- [ ] **Step 1: Assign per-word breathing parameters in buildWordLayout()**

In `buildWordLayout()`, the `nodes.push({...})` call currently is:

```js
nodes.push({
  word: w,
  color: getQuadrantInfo(w).color,
  size,
  r: size / 2,
  x: cell.xMin + CELL_PADDING + tx * innerW,
  y: cell.yMin + CELL_PADDING + (1 - ty) * innerH,
});
```

Add two fields — randomized once at layout time so the fog shimmers organically instead of pulsing in unison:

```js
nodes.push({
  word: w,
  color: getQuadrantInfo(w).color,
  size,
  r: size / 2,
  x: cell.xMin + CELL_PADDING + tx * innerW,
  y: cell.yMin + CELL_PADDING + (1 - ty) * innerH,
  breatheDur: 3.5 + Math.random() * 2,   // 3.5–5.5s
  breatheDel: -Math.random() * 5,        // negative: start mid-cycle
});
```

- [ ] **Step 2: Apply breathing classes and variables to the word divs**

In the render, the word map currently destructures `({ word: w, color, size, x, y })`. Change it to also take the new fields, add the `className`, and add the CSS variables to the style. Replace the existing word `<div>` (the whole `words.map` body, ~lines 287-327) with:

```jsx
{words.map(({ word: w, color, size, x, y, breatheDur, breatheDel }) => {
  const isSel = selected.some(s => s.id === w.id);
  const disabled = selected.length >= 2 && !isSel;
  const dist = Math.hypot(x - focus.x, y - focus.y);
  const opacity = disabled ? 0.06 : fogOpacity(dist);
  const centerAlpha = isSel ? 0.40 : 0.25;

  return (
    <div
      key={w.id}
      onClick={() => !disabled && toggleWord(w)}
      className={`fog-breathe${isSel ? ' sel' : ''}`}
      style={{
        '--dur': `${breatheDur}s`,
        '--del': `${breatheDel}s`,
        '--halo': withAlpha(color, 0.35),
        '--glow': withAlpha(color, 0.4),
        position: 'absolute',
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${withAlpha(color, centerAlpha)} 0%, ${withAlpha(color, 0.08)} 55%, transparent 100%)`,
        color,
        fontSize: isSel ? 17 : 15,
        fontWeight: isSel ? 700 : 400,
        fontFamily: 'var(--font-serif)',
        textAlign: 'center',
        lineHeight: 1.2,
        border: 'none',
        outline: 'none',
        opacity,
        pointerEvents: disabled ? 'none' : 'auto',
        cursor: disabled ? 'default' : 'pointer',
        userSelect: 'none',
        transition: 'opacity 0.25s, font-size 0.15s, background 0.2s',
      }}
    >
      {w.word}
    </div>
  );
})}
```

Notes for the implementer:
- The only changes from the current code are: the two new destructured fields, the `className`, and the four `--*` variables. Everything else is identical — do not drop the fog `opacity`, pan-disable logic, or the font-size transition.
- `withAlpha` already exists at the top of this file.
- The `.fog-breathe` transform composes with the absolute `left/top` positioning; no layout change.
- Selected words switch to the `selectedBreathe` keyframe (scale + box-shadow glow) via the `.sel` class — at most 2 elements ever animate box-shadow, which is why this stays cheap.

- [ ] **Step 3: Verify the build compiles**

Run: `cd /Users/johanhsiung/sioh-sioh/app && npm run build`
Expected: "Compiled successfully."

- [ ] **Step 4: Manual check**

Run: `cd /Users/johanhsiung/sioh-sioh/app && npm start`, navigate to the fog canvas (home → 開始 → through somatic → quadrant → 這個感受有名字嗎？).
Verify:
- All words visibly breathe (~9% scale) at different paces with soft pulsing halos.
- Tapping a word selects it: bold, larger, animated colored glow. Max 2 selectable; definition card appears.
- Drag-to-pan still works and stays smooth; tap-vs-drag threshold unaffected.
- 跳過 still works.
- With OS "Reduce Motion" on (macOS: System Settings → Accessibility → Display), nothing pulses on either screen.

- [ ] **Step 5: Commit**

```bash
git add app/src/screens/EmotionScreen.js
git commit -m "Fog canvas: every emotion word breathes with a pulsing halo"
```
