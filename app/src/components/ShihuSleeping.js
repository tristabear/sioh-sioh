/* eslint-disable */

// Curled-up sleeping shihu for the sleep section. Same palette and style as
// ShihuBreathing; the flank rises and falls via .shihu-sleep-body (index.css)
// and the Zzz motes drift with .shihu-zzz.
export default function ShihuSleeping({ style }) {
  return (
    <svg viewBox="0 0 460 300" width="100%" height="100%" style={{ display: 'block', overflow: 'visible', ...style }}>
      {/* ground shadow */}
      <ellipse cx="235" cy="280" rx="165" ry="17" fill="#000" opacity=".28" />

      {/* body (breathing) */}
      <g className="shihu-sleep-body">
        <ellipse cx="262" cy="192" rx="132" ry="86" fill="#d7a263" />
        {/* rosette spots */}
        <ellipse cx="270" cy="140" rx="13" ry="10" fill="#5c4329" opacity=".45" />
        <ellipse cx="322" cy="164" rx="12" ry="9" fill="#5c4329" opacity=".45" />
        <ellipse cx="348" cy="210" rx="12" ry="9" fill="#5c4329" opacity=".45" />
        <ellipse cx="300" cy="230" rx="12" ry="9" fill="#5c4329" opacity=".45" />
        <ellipse cx="240" cy="128" rx="11" ry="8" fill="#5c4329" opacity=".45" />
        {/* cream flank patch */}
        <ellipse cx="240" cy="248" rx="95" ry="34" fill="#f6ead2" opacity=".9" />
      </g>

      {/* tail curled around the front */}
      <g>
        <path d="M378 226 Q 402 268 330 280 Q 240 292 158 268" fill="none" stroke="#d7a263" strokeWidth="30" strokeLinecap="round" />
        <path d="M378 226 Q 402 268 330 280 Q 240 292 158 268" fill="none" stroke="#5c4329" strokeWidth="30" strokeLinecap="butt" strokeDasharray="13 40" opacity=".75" />
        <circle cx="158" cy="268" r="12" fill="#4f3a23" />
      </g>

      {/* head resting on paws */}
      <g>
        {/* ears */}
        <path d="M108 132 Q 102 86 122 74 Q 138 86 154 116 Q 130 132 108 132 Z" fill="#d7a263" />
        <path d="M120 120 Q 120 94 127 86 Q 136 96 142 114 Q 130 122 120 120 Z" fill="#e9b9a8" />
        <path d="M108 132 Q 102 86 122 74 Q 128 82 132 92 Q 116 108 108 132 Z" fill="#4f3a23" opacity=".55" />
        <path d="M160 112 Q 170 76 192 72 Q 200 90 196 122 Q 176 122 160 112 Z" fill="#d7a263" />
        <path d="M170 106 Q 176 88 186 84 Q 190 96 188 112 Q 178 110 170 106 Z" fill="#e9b9a8" />

        <circle cx="148" cy="172" r="60" fill="#d7a263" />

        {/* forehead stripes */}
        <path d="M146 118 Q 143 134 146 148 Q 149 134 146 118 Z" fill="#5c4329" opacity=".7" />
        <path d="M130 122 Q 125 136 129 150 Q 134 136 132 124 Z" fill="#5c4329" opacity=".6" />
        <path d="M162 122 Q 167 136 163 150 Q 158 136 160 124 Z" fill="#5c4329" opacity=".6" />

        {/* muzzle */}
        <ellipse cx="134" cy="204" rx="26" ry="19" fill="#f8efdc" />
        <ellipse cx="164" cy="204" rx="26" ry="19" fill="#f8efdc" />

        {/* closed eyes — content ︶ curves */}
        <g stroke="#4a3526" strokeWidth="4.5" strokeLinecap="round" fill="none">
          <path d="M108 178 Q 118 188 128 178" />
          <path d="M164 178 Q 174 188 184 178" />
        </g>

        {/* nose + mouth */}
        <path d="M141 192 Q 148 188 155 192 Q 152 202 148 204 Q 144 202 141 192 Z" fill="#e6928f" />
        <path d="M148 204 Q 148 212 139 214" fill="none" stroke="#5c4329" strokeWidth="2.6" strokeLinecap="round" />

        {/* whiskers */}
        <g stroke="#fff7ea" strokeWidth="2" strokeLinecap="round" opacity=".7" fill="none">
          <path d="M112 200 Q 88 196 68 192" />
          <path d="M112 208 Q 86 210 66 212" />
          <path d="M186 200 Q 208 196 226 194" />
        </g>

        {/* front paw tucked under the chin */}
        <ellipse cx="176" cy="234" rx="34" ry="16" fill="#ecdcbf" />
        <g stroke="#cdb792" strokeWidth="2" strokeLinecap="round" fill="none">
          <path d="M168 228 L 167 240" />
          <path d="M182 228 L 183 240" />
        </g>
      </g>

      {/* Zzz */}
      <g fill="#C8A579" fontFamily="Noto Serif TC, serif" fontWeight="900">
        <text x="196" y="100" fontSize="30" className="shihu-zzz" style={{ animationDelay: '0s' }}>z</text>
        <text x="224" y="72" fontSize="22" className="shihu-zzz" style={{ animationDelay: '-1.5s' }}>z</text>
        <text x="248" y="50" fontSize="16" className="shihu-zzz" style={{ animationDelay: '-3s' }}>z</text>
      </g>
    </svg>
  );
}
