/* eslint-disable */

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

// ═══════════════════════════════════════════
// 情緒詞庫 — 100 個詞
// valence: -1 (負向) → 1 (正向)
// arousal: -1 (低能量) → 1 (高能量)
// ═══════════════════════════════════════════
export const EMOTION_WORDS = [

  // ── 高能量・感覺不好 (High Arousal / Negative) ──
  { id: 'panic',       word: '恐慌',    valence: -0.90, arousal: 0.90, def: '強烈的恐懼感，覺得危險迫近，心跳加速、腦袋空白，身體來不及反應。' },
  { id: 'rage',        word: '憤怒',    valence: -0.80, arousal: 0.85, def: '覺得被侵犯或不公平對待，想要反抗或爆發的強烈感受。' },
  { id: 'anxious',     word: '焦慮',    valence: -0.70, arousal: 0.75, def: '對還沒發生的事感到不安，停不下來地擔心，身體緊繃但又不知道怎麼辦。' },
  { id: 'tense',       word: '緊張',    valence: -0.55, arousal: 0.70, def: '面對重要或不確定的事情時，心跳加速、手心冒汗，高度戒備的狀態。' },
  { id: 'irritable',   word: '煩躁',    valence: -0.55, arousal: 0.60, def: '心裡有一種說不出的悶，對周圍的事很容易不耐煩，什麼都覺得刺眼。' },
  { id: 'frantic',     word: '抓狂',    valence: -0.75, arousal: 0.85, def: '壓力或刺激到了臨界點，理智快要斷線，想大叫或摔東西的衝動。' },
  { id: 'flustered',   word: '慌張',    valence: -0.60, arousal: 0.75, def: '遇到突發狀況時，不知道先做什麼，手忙腳亂、判斷力下降。' },
  { id: 'startled',    word: '驚嚇',    valence: -0.65, arousal: 0.88, def: '突然遇到意外的刺激，身體瞬間反應——心跳驟停、全身一震。' },
  { id: 'overwhelmed', word: '不知所措', valence: -0.70, arousal: 0.60, def: '面對太多選擇或太大的壓力，完全不知道從哪裡開始，腦袋打結。' },
  { id: 'frustrated',  word: '挫折',    valence: -0.60, arousal: 0.65, def: '努力了卻沒有達到預期，想繼續但又覺得沒有用，能量在原地空轉。' },
  { id: 'wronged',     word: '委屈',    valence: -0.72, arousal: 0.55, def: '明明沒有錯，卻被誤解或不公平對待，想哭又想解釋，心裡很不是滋味。' },
  { id: 'urgent',      word: '心急',    valence: -0.50, arousal: 0.70, def: '很想讓某件事趕快發生或解決，等待的每一秒都很煎熬。' },
  { id: 'angry',       word: '惱怒',    valence: -0.65, arousal: 0.65, def: '因為小事或重複發生的問題累積出來的怒，比憤怒更悶、更耗人。' },
  { id: 'scared',      word: '害怕',    valence: -0.70, arousal: 0.72, def: '感知到威脅或危險，想逃離但又不確定能不能逃掉，身體僵住。' },
  { id: 'agitated',    word: '激動',    valence: -0.60, arousal: 0.80, def: '情緒強烈到超出平時的範圍，身體也跟著顫抖，難以平靜。' },
  { id: 'stifled',     word: '憋悶',    valence: -0.65, arousal: 0.55, def: '有話說不出口，有情緒發不了，像有東西堵在胸口，喘不過氣。' },
  { id: 'reluctant',   word: '不甘心',  valence: -0.62, arousal: 0.58, def: '事情的結果不是自己想要的，但又還沒辦法放下，卡在中間的感受。' },
  { id: 'jealous',     word: '嫉妒',    valence: -0.60, arousal: 0.62, def: '看到別人擁有自己想要的東西，心裡酸酸的，夾雜著羨慕和不舒服。' },
  { id: 'resistant',   word: '抗拒',    valence: -0.55, arousal: 0.58, def: '內心不想接受某件事或某個安排，有一股想推開的力量。' },
  { id: 'stressed',    word: '壓力大',  valence: -0.65, arousal: 0.70, def: '外在要求超過了自己可以承受的範圍，身體和心理都在超載狀態。' },
  { id: 'teetering',   word: '忐忑',    valence: -0.55, arousal: 0.62, def: '對某件事的結果不確定，心情一下上一下下，無法安定，像心在打鼓。' },
  { id: 'envious',     word: '羨慕',    valence: -0.35, arousal: 0.55, def: '希望自己也能有對方擁有的，感受比嫉妒溫和，但還是有點說不清楚的悵然。' },
  { id: 'disgusted',   word: '反感',    valence: -0.72, arousal: 0.60, def: '遇到讓自己覺得不對勁或噁心的事，直覺性地想遠離。' },
  { id: 'pressured',   word: '緊迫',    valence: -0.58, arousal: 0.75, def: '時間或資源快要不夠，必須馬上行動，壓力從外部撲過來的感覺。' },
  { id: 'worried2',    word: '憂慮',    valence: -0.62, arousal: 0.58, def: '對某件事持續掛心，停不下來地在腦海中反覆想像壞的可能。' },

  // ── 高能量・感覺好 (High Arousal / Positive) ──
  { id: 'excited',     word: '興奮',    valence: 0.85, arousal: 0.85, def: '對即將發生的事充滿期待，能量很高，很難坐得住。' },
  { id: 'joyful',      word: '喜悅',    valence: 0.90, arousal: 0.70, def: '心裡有一種輕盈的快樂，比開心更純粹，是從裡面發光的感覺。' },
  { id: 'elated',      word: '雀躍',    valence: 0.85, arousal: 0.80, def: '高興到有點停不下來，像要跳起來一樣的活潑感受。' },
  { id: 'energized',   word: '充滿活力', valence: 0.80, arousal: 0.82, def: '身體和精神都在最佳狀態，覺得什麼都做得到。' },
  { id: 'passionate',  word: '熱情',    valence: 0.80, arousal: 0.78, def: '對某件事或某個人投入大量的能量，想靠近、想參與、想給予。' },
  { id: 'proud',       word: '驕傲',    valence: 0.75, arousal: 0.62, def: '對自己或在乎的人做到了某件事感到光榮，有一種挺起胸膛的感受。' },
  { id: 'hopeful',     word: '充滿希望', valence: 0.72, arousal: 0.62, def: '相信未來會比現在好，有一種前方有光的感覺，讓人想繼續走下去。' },
  { id: 'confident',   word: '自信',    valence: 0.78, arousal: 0.65, def: '相信自己有能力面對眼前的事，不需要太多外部確認。' },
  { id: 'motivated',   word: '鬥志',    valence: 0.75, arousal: 0.80, def: '面對挑戰時，有一股想要全力以赴的衝動，不怕困難。' },
  { id: 'happy',       word: '開心',    valence: 0.82, arousal: 0.65, def: '日常生活中輕快的快樂，可能因為一件小事，整個心情都亮起來。' },
  { id: 'surprised_p', word: '驚喜',    valence: 0.80, arousal: 0.78, def: '遇到超出預期的好事，喜悅和意外混在一起，讓人說不出話。' },
  { id: 'fascinated',  word: '著迷',    valence: 0.72, arousal: 0.70, def: '對某件事或某個人高度投入，思緒不自覺地一直繞回去。' },
  { id: 'brave',       word: '勇敢',    valence: 0.75, arousal: 0.72, def: '知道有風險，但還是決定往前走，明知道會怕但還是去做的感受。' },
  { id: 'liberated',   word: '解脫',    valence: 0.78, arousal: 0.68, def: '長期的壓力或困境突然結束，身體和心裡同時鬆開，帶著能量的感覺。' },
  { id: 'smitten',     word: '心動',    valence: 0.82, arousal: 0.72, def: '對某人或某事產生特別的感受，心跳快了一點，想靠近。' },
  { id: 'moved',       word: '感動',    valence: 0.82, arousal: 0.68, def: '被某件事、某個人觸動到心裡，有時候會想哭，但是好的那種。' },
  { id: 'inspired',    word: '振奮',    valence: 0.78, arousal: 0.78, def: '被某件事激勵到，能量突然上升，想要行動。' },
  { id: 'eager',       word: '躍躍欲試', valence: 0.72, arousal: 0.75, def: '看到一個新的機會或挑戰，忍不住想參與看看的感受。' },
  { id: 'cheerful',    word: '愉快',    valence: 0.80, arousal: 0.60, def: '心情輕鬆好，對周圍的事都比較容易接受，比開心更平靜一點。' },
  { id: 'curious',     word: '好奇',    valence: 0.65, arousal: 0.65, def: '對某件事或某個人有想了解更多的慾望，帶著開放和輕盈。' },
  { id: 'anticipate',  word: '期待',    valence: 0.75, arousal: 0.68, def: '對即將發生的事有正向的想像，等待的過程本身也是愉快的。' },
  { id: 'happy2',      word: '快樂',    valence: 0.88, arousal: 0.62, def: '整體感受是好的，對現在的狀態感到滿意，身體也輕鬆。' },
  { id: 'fulfilled',   word: '幸福',    valence: 0.92, arousal: 0.55, def: '不只是快樂，是一種深層的圓滿感，覺得現在這樣就很好。' },

  // ── 低能量・感覺不好 (Low Arousal / Negative) ──
  { id: 'sad',         word: '悲傷',    valence: -0.75, arousal: -0.50, def: '因為失去或受傷而感到難過，能量低，有時候連說話都累。' },
  { id: 'lonely',      word: '孤獨',    valence: -0.70, arousal: -0.60, def: '不是一個人，是那種即使在人群中也覺得沒人真的懂你的感受。' },
  { id: 'empty',       word: '空虛',    valence: -0.65, arousal: -0.70, def: '心裡有一個填不滿的地方，什麼都提不起勁，不知道自己要什麼。' },
  { id: 'dejected',    word: '消沉',    valence: -0.72, arousal: -0.65, def: '對很多事失去了興趣，能量很低，有點什麼都無所謂的狀態。' },
  { id: 'exhausted',   word: '心好累',  valence: -0.65, arousal: -0.65, def: '不是身體疲勞，是心理上承受太多，累到連感受都感受不太到。' },
  { id: 'numb',        word: '麻木',    valence: -0.55, arousal: -0.80, def: '情緒太強烈或持續太久之後，感覺開始遲鈍，什麼都感受不深。' },
  { id: 'disappointed',word: '失望',    valence: -0.65, arousal: -0.35, def: '對某個人或某件事有期待，但結果沒有如願，期待和現實之間的落差感。' },
  { id: 'guilty',      word: '內疚',    valence: -0.70, arousal: -0.25, def: '覺得自己做錯了什麼，讓別人受傷了，心裡一直過不去。' },
  { id: 'ashamed',     word: '羞愧',    valence: -0.75, arousal: -0.15, def: '比內疚更深，不只是做錯了事，而是覺得自己這個人有問題。' },
  { id: 'self_blame',  word: '自責',    valence: -0.72, arousal: -0.20, def: '把所有的錯都往自己身上攬，不停地在心裡批判自己。' },
  { id: 'regret',      word: '遺憾',    valence: -0.62, arousal: -0.40, def: '對過去某個沒有做到或說到的事，一直有種說不清楚的惋惜。' },
  { id: 'helpless',    word: '無助',    valence: -0.80, arousal: -0.55, def: '面對困境，試過了但沒有用，感覺自己沒有能力改變任何事。' },
  { id: 'hopeless',    word: '無望',    valence: -0.85, arousal: -0.60, def: '不只是現在不好，而是看不到未來會變好的可能，是更深層的絕望。' },
  { id: 'heartache',   word: '心疼',    valence: -0.60, arousal: -0.35, def: '看到在乎的人受苦，心裡跟著痛，想幫又幫不上忙的感受。' },
  { id: 'clinging',    word: '放不下',  valence: -0.60, arousal: -0.45, def: '知道應該要讓某件事或某個人過去，但就是無法停止想，割捨不了。' },
  { id: 'missing',     word: '想念',    valence: -0.40, arousal: -0.50, def: '對不在身邊的人或過去的某段時光，有一種柔軟的惦記。' },
  { id: 'lost',        word: '迷失',    valence: -0.58, arousal: -0.42, def: '不確定自己是誰、要往哪裡走，像在霧裡找不到方向。' },
  { id: 'dejected2',   word: '沮喪',    valence: -0.70, arousal: -0.40, def: '事情不如預期，整個人像洩了氣，提不起精神繼續。' },
  { id: 'depressed',   word: '憂鬱',    valence: -0.80, arousal: -0.65, def: '一種持續的低落，不是某件事造成的，就是覺得什麼都灰灰的。' },
  { id: 'embarrassed', word: '難為情',  valence: -0.55, arousal: -0.20, def: '做了某件覺得丟臉的事，很希望當下可以消失，臉紅耳熱。' },
  { id: 'listless',    word: '委靡',    valence: -0.62, arousal: -0.72, def: '身體和精神都沒有力氣，什麼都不想做，只想躺著。' },
  { id: 'unspeakable', word: '說不出口', valence: -0.55, arousal: -0.38, def: '有很多感受想表達，但話到嘴邊卻卡住了，不知道怎麼開始。' },
  { id: 'gloomy',      word: '鬱悶',    valence: -0.65, arousal: -0.45, def: '心情悶悶的，說不清楚是為什麼，就是有一團東西壓著。' },
  { id: 'grieving',    word: '哀傷',    valence: -0.78, arousal: -0.55, def: '比悲傷更深沉、更安靜，通常跟重大的失去有關。' },
  { id: 'dim',         word: '黯然',    valence: -0.65, arousal: -0.58, def: '心情暗下來，失去了光彩，帶著一種無聲的落寞。' },
  { id: 'worried',     word: '擔憂',    valence: -0.58, arousal: -0.25, def: '對在乎的人或事有一種持續的掛念，能量比焦慮更低、更安靜。' },

  // ── 低能量・感覺好 (Low Arousal / Positive) ──
  { id: 'calm',        word: '平靜',    valence: 0.72, arousal: -0.70, def: '心裡沒有波瀾，不特別高興也不特別難過，就是安定的狀態。' },
  { id: 'content',     word: '滿足',    valence: 0.82, arousal: -0.52, def: '覺得現在擁有的已經夠了，不需要更多，一種向內的圓滿。' },
  { id: 'grateful',    word: '感恩',    valence: 0.85, arousal: -0.22, def: '對生命中的人、事、物有一種深的珍惜，知道這一切不是理所當然。' },
  { id: 'serene',      word: '安詳',    valence: 0.75, arousal: -0.80, def: '像平靜更深一層，帶著一種從容，不被外界影響。' },
  { id: 'warm',        word: '溫暖',    valence: 0.80, arousal: -0.32, def: '被人關心或處在安全的環境中，心裡有一種柔軟的熱度。' },
  { id: 'relieved',    word: '鬆了一口氣', valence: 0.75, arousal: -0.12, def: '擔心或緊繃的事情過去了，身體和心同時放鬆下來。' },
  { id: 'accepted',    word: '被接納',  valence: 0.80, arousal: -0.42, def: '不用假裝，就這樣被對方看見並接受，有一種安全的感覺。' },
  { id: 'tender',      word: '柔軟',    valence: 0.72, arousal: -0.52, def: '心裡不設防，願意被感動，對周圍的事有一種溫柔的接受。' },
  { id: 'quiet',       word: '寧靜',    valence: 0.75, arousal: -0.82, def: '外在和內在都安靜，是一種難得的、不被打擾的狀態。' },
  { id: 'enough',      word: '知足',    valence: 0.78, arousal: -0.55, def: '對現有的一切感到夠了，不貪求，有一種樸素的快樂。' },
  { id: 'grounded',    word: '踏實',    valence: 0.78, arousal: -0.45, def: '做了應該做的事，或站在穩固的基礎上，有一種腳踩在地上的安心感。' },
  { id: 'safe',        word: '安心',    valence: 0.80, arousal: -0.48, def: '對某件事或某個人感到放心，不再需要擔心了。' },
  { id: 'lazy',        word: '慵懶',    valence: 0.65, arousal: -0.75, def: '身體放鬆，什麼都不想做，但這是好的，是充電的狀態。' },
  { id: 'cozy',        word: '舒適',    valence: 0.78, arousal: -0.62, def: '環境和感受都剛剛好，不太熱不太冷，一切都很合適。' },
  { id: 'cherish',     word: '珍惜',    valence: 0.80, arousal: -0.35, def: '意識到眼前的人或事是珍貴的，想要好好把握。' },
  { id: 'relaxed',     word: '放鬆',    valence: 0.72, arousal: -0.68, def: '卸下了緊張或壓力，身體和呼吸都慢下來。' },
  { id: 'immersed',    word: '陶醉',    valence: 0.80, arousal: -0.38, def: '完全沉浸在某個美好的體驗裡，忘記了時間。' },
  { id: 'relieved2',   word: '欣慰',    valence: 0.78, arousal: -0.30, def: '看到在乎的人做到了某件事，或事情往好的方向走，心裡的安慰。' },
  { id: 'stable',      word: '安穩',    valence: 0.78, arousal: -0.62, def: '生活有一定的秩序和基礎，不用擔心突然的改變，是長期的平靜。' },
  { id: 'letgo',       word: '釋懷',    valence: 0.75, arousal: -0.40, def: '對過去某件放不下的事，終於可以接受了，不再卡在那裡。' },
  { id: 'unhurried',   word: '從容',    valence: 0.75, arousal: -0.55, def: '不被時間或壓力追著跑，有餘裕地面對眼前的事。' },
  { id: 'detached',    word: '淡然',    valence: 0.65, arousal: -0.60, def: '對事情不特別執著，看得開，但不是冷漠，是一種成熟的接受。' },
  { id: 'epiphany',    word: '豁然',    valence: 0.80, arousal: -0.30, def: '突然想通了某件事，心裡打開了，帶著輕盈的頓悟感。' },
  { id: 'leisurely',   word: '悠然',    valence: 0.72, arousal: -0.72, def: '不被時間追，慢慢地、自在地存在著，有一種與世無爭的輕盈。' },
  { id: 'eased',       word: '寬心',    valence: 0.75, arousal: -0.38, def: '擔心的事有了好的進展，或被人安慰到了，心裡放寬了。' },
];

// ═══════════════════════════════════════════
// 情緒象限（保留與原檔相容）
// ═══════════════════════════════════════════
export const QUADRANTS = [
  { id: 'HA_NEG', label: '高能量・感覺不好', valence: -0.7, arousal: 0.7, color: '#c97d50' },
  { id: 'HA_POS', label: '高能量・感覺好',   valence:  0.7, arousal: 0.7, color: '#7aae8e' },
  { id: 'LA_NEG', label: '低能量・感覺不好', valence: -0.7, arousal: -0.7, color: '#8a7a6a' },
  { id: 'LA_POS', label: '低能量・感覺好',   valence:  0.7, arousal: -0.7, color: '#1c2b24' },
];

// ═══════════════════════════════════════════
// SRWNE 評估（5題）
// 注意：同時 export SRWNE_PROMPTS（舊名）和 SRWNE_QUESTIONS（新名）保持相容
// ═══════════════════════════════════════════
export const SRWNE_QUESTIONS = [
  {
    id: 'q1',
    question: '你選擇不說出這個感受，主要是因為？',
    options: [
      { id: 'a', label: '說了對方可能會生氣或失望，我不敢', type: 'controlled' },
      { id: 'b', label: '我在乎這段關係，不想在這個時機傷害對方', type: 'autonomous' },
      { id: 'c', label: '說了也沒用，反正不會有人真的理解', type: 'controlled' },
      { id: 'd', label: '我選擇等一個更好的時機再說', type: 'autonomous' },
    ],
  },
  {
    id: 'q2',
    question: '當你壓下這個感受時，身體的感覺是？',
    options: [
      { id: 'a', label: '更沉重、更緊，像有東西堵在胸口', type: 'controlled' },
      { id: 'b', label: '稍微輕鬆，覺得自己做了對的決定', type: 'autonomous' },
      { id: 'c', label: '感覺越來越麻木，什麼都感受不到', type: 'controlled' },
      { id: 'd', label: '複雜，有點釋懷，但也有點可惜', type: 'neutral' },
    ],
  },
  {
    id: 'q3',
    question: '這個不說的選擇，是你自己做的，還是被迫的？',
    options: [
      { id: 'a', label: '是我自己選的，我覺得這樣對大家比較好', type: 'autonomous' },
      { id: 'b', label: '我沒有選擇，說了只會讓情況更糟', type: 'controlled' },
      { id: 'c', label: '說不清楚，有一部分是選的，有一部分是逼的', type: 'neutral' },
      { id: 'd', label: '我不知道，只是本能地沉默了', type: 'controlled' },
    ],
  },
  {
    id: 'q4',
    question: '不說這件事，對你和對方的關係來說？',
    options: [
      { id: 'a', label: '是保護，讓關係不受傷', type: 'autonomous' },
      { id: 'b', label: '是犧牲，但我不得不這樣做', type: 'controlled' },
      { id: 'c', label: '讓我和對方之間有了一道牆', type: 'controlled' },
      { id: 'd', label: '是我對這段關係的一種珍惜', type: 'autonomous' },
    ],
  },
  {
    id: 'q5',
    question: '如果你的好朋友跟你說了一樣的狀況，你會怎麼跟他說？',
    options: [
      { id: 'a', label: '你要學會為自己說話，不能一直壓著', type: 'controlled_insight' },
      { id: 'b', label: '你選擇不說是因為你在乎，這是你的溫柔', type: 'autonomous_insight' },
      { id: 'c', label: '你先喘口氣，等準備好了再決定要不要說', type: 'neutral_insight' },
      { id: 'd', label: '你的感受是真實的，不管說不說都值得被看見', type: 'universal' },
    ],
  },
];

// 向下相容舊版 import 名稱
export const SRWNE_PROMPTS = SRWNE_QUESTIONS;

// ═══════════════════════════════════════════
// CBT 認知重建路徑
// ═══════════════════════════════════════════
export const CBT_PATHS = {
  controlled: {
    label: '你正在承受一種沉默的重量',
    color: '#c97d50',
    icon: '🫂',
    phases: [
      {
        id: 'acknowledge', type: 'reflection',
        title: '先看見這個重量',
        content: '你選擇沉默，不是因為你不重要，而是因為環境沒有給你足夠安全的空間說出口。\n\n這份重量是真實的。你不需要假裝它不存在。',
        prompt: '現在，給這份重量一個大小——它有多重？',
        options: ['像一顆石頭', '像一座山', '像一層薄薄的霧', '說不清楚'],
      },
      {
        id: 'body_check', type: 'somatic',
        title: '它住在身體哪裡？',
        content: '被迫壓抑的情緒通常會留在身體裡。不是消失，是換了個地方待著。',
        prompt: '這個感受現在在你身體的哪個部位？',
        options: ['胸口', '喉嚨', '肩膀', '胃', '全身', '不確定'],
      },
      {
        id: 'dialectical', type: 'reframe',
        title: '道家的視角',
        content: '老子說：「曲則全，枉則直。」\n\n彎曲不是失敗，是在等待最好的時機舒展。\n\n你現在的沉默，可能是你在用自己的方式，保護你在乎的東西。',
        prompt: '這個想法對你有沒有一點點共鳴？',
        options: ['有，讓我感覺好一點', '有一點，但還是很難受', '沒有，我還是覺得很委屈', '需要時間想'],
      },
      {
        id: 'small_step', type: 'action',
        title: '一個只為自己的小動作',
        content: '不需要現在就決定「要不要說」。\n\n但你可以為自己做一件小事——哪怕只是讓身體放鬆一點點。',
        prompt: '現在，你可以為自己做什麼？',
        options: ['深呼吸三次', '喝一杯水', '讓肩膀放下來', '什麼都不做，就讓自己在這裡一分鐘'],
      },
    ],
  },
  autonomous: {
    label: '你用沉默在照顧你在乎的關係',
    color: '#7aae8e',
    icon: '🪷',
    phases: [
      {
        id: 'affirm', type: 'reflection',
        title: '看見你的選擇',
        content: '你選擇不說，是因為你在乎。\n\n這不是軟弱——這是一種成熟的溫柔。你在用自己的方式保護這段關係。',
        prompt: '你選擇沉默，最主要是在保護什麼？',
        options: ['對方的感受', '這段關係的和諧', '一個還不成熟的時機', '我自己的內心'],
      },
      {
        id: 'boundary', type: 'reframe',
        title: '自主選擇 vs 自我消失',
        content: '儒家說仁義——「仁」是對他人的愛，「義」是對自己的誠實。\n\n真正的自主選擇，是既照顧關係，也不讓自己消失。\n\n問自己：這個沉默，是我「選擇給出去的」，還是「被拿走的」？',
        prompt: '這個沉默，現在感覺更像？',
        options: ['我給出去的禮物', '被拿走的東西', '兩者都有', '還在想'],
      },
      {
        id: 'future', type: 'action',
        title: '為未來的自己留一扇門',
        content: '選擇不說，不代表永遠不說。\n\n你可以現在先好好照顧自己，等時機成熟，再用你自己選擇的方式表達。',
        prompt: '如果有一天你準備好了，你最想讓對方知道什麼？',
        options: ['我有多在乎這段關係', '我當時有多不容易', '我希望我們都能更輕鬆', '不確定，先放著'],
      },
    ],
  },
  positive: {
    label: '你現在有一個值得留住的感受',
    color: '#7aae8e',
    icon: '✨',
    phases: [
      {
        id: 'notice', type: 'reflection',
        title: '慢下來，感受這一刻',
        content: '好的感受很容易就流走了。\n\n不是因為它不真實，而是我們太習慣讓注意力移向下一件事。',
        prompt: '這個感受，你覺得它從哪裡來的？',
        options: ['某個人', '某件完成的事', '意外的小驚喜', '說不清楚，就是突然有'],
      },
      {
        id: 'deepen', type: 'somatic',
        title: '讓它在身體裡再深一點',
        content: '閉上眼睛，深吸一口氣。\n\n想像這個感受是一種光，從你的胸口慢慢擴散到全身。\n\n停留 10 秒。',
        prompt: '做完了嗎？身體有什麼變化？',
        options: ['有，感覺更溫暖了', '有一點點', '沒什麼感覺，但還好', '我試試看'],
      },
    ],
  },
  neutral: {
    label: '情緒是複雜的，不需要分類清楚',
    color: '#c9a082',
    icon: '☯️',
    phases: [
      {
        id: 'accept', type: 'reflection',
        title: '接受複雜',
        content: '你的感受不需要被完全分析清楚。\n\n有時候，能說出「我不確定」就已經是一種誠實。\n\n情緒本來就不是非黑即白的。',
        prompt: '現在，你對這個感受的態度是？',
        options: ['想繼續了解它', '想先放著，不去想', '接受它就是這樣', '還沒有想法'],
      },
      {
        id: 'ground', type: 'somatic',
        title: '回到當下的身體',
        content: '不管情緒有多複雜，身體永遠在當下。\n\n試著感受：你的腳踩在地板上嗎？\n椅子支撐著你的重量嗎？\n現在的溫度是？',
        prompt: '做完這個練習，身體感覺怎麼樣？',
        options: ['稍微安定了一點', '差不多', '還是有點飄', '感覺不到什麼'],
      },
    ],
  },
};

// ═══════════════════════════════════════════
// Savoring 10 種策略
// ═══════════════════════════════════════════
export const SAVORING_STRATEGIES = [
  { id: 'share',      label: '告訴一個人',       desc: '生成惜惜卡片，分享給你在乎的人', icon: '💬', type: 'action' },
  { id: 'memory',     label: '拍下這一刻',       desc: '用照片記錄現在的環境或感受',     icon: '📸', type: 'action' },
  { id: 'breathe_in', label: '把這個感覺吸進來', desc: '深呼吸，讓好感受充滿身體',       icon: '🫁', type: 'breath' },
  { id: 'gratitude',  label: '感謝讓這件事發生的人', desc: '寫下你想感謝的人或事',      icon: '🙏', type: 'write', prompt: '寫下你想感謝的人或事...' },
  { id: 'present',    label: '就在這裡一分鐘',   desc: '不做別的，只是感受現在',         icon: '⏱️', type: 'timer' },
  { id: 'reminisce',  label: '想一個類似的美好記憶', desc: '讓今天的感受連結到過去的幸福', icon: '🎞️', type: 'reflect', prompt: '上一次有類似的感覺，是什麼時候？那時候發生了什麼？' },
  { id: 'sensory',    label: '用感官記住這一刻', desc: '現在的氣味、光線、溫度是什麼？',  icon: '👁️', type: 'reflect', prompt: '描述現在的光線、氣味和溫度——用這三個感官把這一刻留下來。' },
  { id: 'temporal',   label: '提醒自己這一刻的珍貴', desc: '想像一年後的你回頭看今天', icon: '🕰️', type: 'reflect', prompt: '一年後的你，會怎麼記得今天這個感受？' },
  { id: 'count',      label: '數三件讓你感恩的事', desc: '把今天的好，一件一件說出來',   icon: '🌸', type: 'count' },
  { id: 'selfcompass',label: '給自己一句惜惜的話', desc: '用對待好朋友的方式跟自己說一句話', icon: '💌', type: 'write', prompt: '如果你最在乎的朋友今天有這個感受，你會跟他說什麼？現在把那句話說給自己聽。' },
];
