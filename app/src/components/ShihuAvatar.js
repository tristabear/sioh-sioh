/* eslint-disable */

// Face-only shihu (no background), tightly cropped for use as a small
// avatar/badge — e.g. the home screen header. Same path data as
// ShihuBreathing's head, sized via viewBox rather than duplicating art.
export default function ShihuAvatar({ size = 56, style }) {
  return (
    <svg viewBox="100 26 268 236" width={size} height={size} style={{ display: 'block', overflow: 'visible', ...style }}>
      <path d="M150 110 Q 150 50 169 32 Q 184 45 214 98 Q 186 118 150 110 Z" fill="#d7a263" />
      <path d="M167 102 Q 170 62 180 50 Q 190 62 201 100 Q 184 110 167 102 Z" fill="#e9b9a8" />
      <path d="M150 110 Q 150 50 169 32 Q 176 42 182 56 Q 165 78 150 110 Z" fill="#4f3a23" opacity=".55" />
      <path d="M320 110 Q 320 50 301 32 Q 286 45 256 98 Q 284 118 320 110 Z" fill="#d7a263" />
      <path d="M303 102 Q 300 62 290 50 Q 280 62 269 100 Q 286 110 303 102 Z" fill="#e9b9a8" />
      <path d="M320 110 Q 320 50 301 32 Q 294 42 288 56 Q 305 78 320 110 Z" fill="#4f3a23" opacity=".55" />
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
      <ellipse cx="193" cy="178" rx="23" ry="27" fill="#4a3526" />
      <ellipse cx="277" cy="178" rx="23" ry="27" fill="#4a3526" />
      <circle cx="186" cy="169" r="7.5" fill="#fffaf2" />
      <circle cx="270" cy="169" r="7.5" fill="#fffaf2" />
      <circle cx="199" cy="187" r="3.4" fill="#fffaf2" opacity=".8" />
      <circle cx="283" cy="187" r="3.4" fill="#fffaf2" opacity=".8" />
      <path d="M224 200 Q 235 195 246 200 Q 241 214 235 217 Q 229 214 224 200 Z" fill="#e6928f" />
      <path d="M235 217 Q 235 228 222 230" fill="none" stroke="#5c4329" strokeWidth="3" strokeLinecap="round" />
      <path d="M235 217 Q 235 228 248 230" fill="none" stroke="#5c4329" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
