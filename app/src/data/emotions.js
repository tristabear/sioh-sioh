// 身體症狀
export const SOMATIC_SYMPTOMS = [
  { id: 'chest', label: '胸悶', icon: '🫀', zone: 'chest' },
  { id: 'fatigue', label: '疲倦', icon: '😮‍💨', zone: 'body' },
  { id: 'heart', label: '心跳加速', icon: '💓', zone: 'chest' },
  { id: 'stomach', label: '胃部緊繃', icon: '🫃', zone: 'stomach' },
  { id: 'headache', label: '頭痛', icon: '🤯', zone: 'head' },
  { id: 'throat', label: '喉嚨緊縮', icon: '😶', zone: 'throat' },
  { id: 'muscle', label: '肌肉緊繃', icon: '💪', zone: 'body' },
  { id: 'breath', label: '呼吸不順', icon: '🌬️', zone: 'chest' },
  { id: 'dizzy', label: '頭暈', icon: '😵', zone: 'head' },
  { id: 'nausea', label: '噁心', icon: '🤢', zone: 'stomach' },
  { id: 'sweat', label: '手心冒汗', icon: '🤲', zone: 'body' },
  { id: 'none', label: '身體還好', icon: '✨', zone: 'none' },
];

// 情緒詞庫 — 依喚起度(arousal)和愉悅度(valence)排列
// valence: -1 (負向) → 1 (正向)
// arousal: -1 (低喚起) → 1 (高喚起)
export const EMOTION_WORDS = [
  // 高喚起 + 負向 (High Arousal Negative)
  { id: 'panic', word: '恐慌', valence: -0.9, arousal: 0.9 },
  { id: 'rage', word: '憤怒', valence: -0.8, arousal: 0.85 },
  { id: 'anxious', word: '焦慮', valence: -0.7, arousal: 0.75 },
  { id: 'stress', word: '壓力大', valence: -0.65, arousal: 0.7 },
  { id: 'frustrated', word: '挫折', valence: -0.6, arousal: 0.65 },
  { id: 'overwhelmed', word: '不知所措', valence: -0.7, arousal: 0.6 },
  { id: 'irritable', word: '煩躁', valence: -0.55, arousal: 0.6 },
  { id: 'tense', word: '緊繃', valence: -0.5, arousal: 0.7 },

  // 高喚起 + 正向 (High Arousal Positive)
  { id: 'excited', word: '興奮', valence: 0.85, arousal: 0.85 },
  { id: 'joyful', word: '喜悅', valence: 0.9, arousal: 0.7 },
  { id: 'energized', word: '充滿活力', valence: 0.8, arousal: 0.8 },
  { id: 'motivated', word: '充滿動力', valence: 0.75, arousal: 0.75 },
  { id: 'hopeful', word: '充滿希望', valence: 0.7, arousal: 0.6 },
  { id: 'proud', word: '驕傲', valence: 0.75, arousal: 0.6 },

  // 低喚起 + 負向 (Low Arousal Negative)
  { id: 'sad', word: '悲傷', valence: -0.75, arousal: -0.5 },
  { id: 'lonely', word: '孤獨', valence: -0.7, arousal: -0.6 },
  { id: 'empty', word: '空虛', valence: -0.65, arousal: -0.7 },
  { id: 'hopeless', word: '無望', valence: -0.85, arousal: -0.6 },
  { id: 'depressed', word: '消沉', valence: -0.8, arousal: -0.7 },
  { id: 'numb', word: '麻木', valence: -0.5, arousal: -0.8 },
  { id: 'tired_soul', word: '心好累', valence: -0.6, arousal: -0.65 },
  { id: 'disappointed', word: '失望', valence: -0.65, arousal: -0.3 },
  { id: 'guilty', word: '內疚', valence: -0.7, arousal: -0.2 },
  { id: 'ashamed', word: '羞愧', valence: -0.75, arousal: -0.1 },
  { id: 'worried', word: '擔憂', valence: -0.6, arousal: 0.2 },
  { id: 'lost', word: '迷失', valence: -0.55, arousal: -0.4 },

  // 低喚起 + 正向 (Low Arousal Positive)
  { id: 'calm', word: '平靜', valence: 0.7, arousal: -0.7 },
  { id: 'content', word: '滿足', valence: 0.8, arousal: -0.5 },
  { id: 'grateful', word: '感恩', valence: 0.85, arousal: -0.2 },
  { id: 'peaceful', word: '安詳', valence: 0.75, arousal: -0.8 },
  { id: 'warm', word: '溫暖', valence: 0.8, arousal: -0.3 },
  { id: 'relieved', word: '鬆了一口氣', valence: 0.75, arousal: -0.1 },
  { id: 'accepted', word: '被接納', valence: 0.8, arousal: -0.4 },
  { id: 'tender', word: '柔軟', valence: 0.7, arousal: -0.5 },
];

// SRWNE 評估問題
export const SRWNE_PROMPTS = [
  {
    id: 'q1',
    question: '你選擇不說出這個感受，是因為...',
    options: [
      { id: 'controlled', label: '害怕對方的反應', type: 'controlled' },
      { id: 'autonomous', label: '我在乎這段關係，不想傷害對方', type: 'autonomous' },
      { id: 'controlled2', label: '說了也沒用，不想麻煩別人', type: 'controlled' },
      { id: 'autonomous2', label: '現在不是好時機，之後會找機會說', type: 'autonomous' },
    ],
  },
  {
    id: 'q2',
    question: '當你壓下這個情緒時，身體的感覺是...',
    options: [
      { id: 'heavy', label: '更沉重、更緊繃', type: 'controlled' },
      { id: 'light', label: '稍微輕鬆，覺得做了對的決定', type: 'autonomous' },
      { id: 'mixed', label: '複雜，說不清楚', type: 'neutral' },
      { id: 'numb2', label: '感覺變得麻木', type: 'controlled' },
    ],
  },
];

// 情緒象限 — Russell's circumplex: valence 為 x 軸（左負/右正），arousal 為 y 軸（上激動/下平靜）
export const QUADRANTS = [
  { id: 'HA_NEG', label: '強烈負面', valence: -0.7, arousal: 0.7, color: '#C86F59' },
  { id: 'HA_POS', label: '強烈正面', valence: 0.7, arousal: 0.7, color: '#5a8fa3' },
  { id: 'LA_NEG', label: '平靜負面', valence: -0.7, arousal: -0.7, color: '#7a8e95' },
  { id: 'LA_POS', label: '平靜正面', valence: 0.7, arousal: -0.7, color: '#3A6B7E' },
];

// Savoring 策略
export const SAVORING_STRATEGIES = [
  { id: 'share', label: '告訴一個人', desc: '把這個好感受分享給你在乎的人', icon: '💬' },
  { id: 'memory', label: '拍下這一刻', desc: '用照片或文字記錄，以後回味', icon: '📸' },
  { id: 'breathe_in', label: '深呼吸，吸進這個感覺', desc: '閉眼深吸一口氣，讓這個感受充滿身體', icon: '🫁' },
  { id: 'gratitude', label: '感謝讓這件事發生的人或事', desc: '心裡默默感謝', icon: '🙏' },
  { id: 'present', label: '就待在這裡一分鐘', desc: '不做別的事，只是感受現在', icon: '⏱️' },
];
