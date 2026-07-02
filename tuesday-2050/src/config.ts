// ---------------------------------------------------------------------------
// 「2050년 6월의 어느 화요일」 — single source of truth for the composition.
//
// Timing math (30fps, 180s = 5400 frames):
//   6 crossfades between cuts 1..7 of 1.5s (45f) each = 270f of overlap.
//   Cut 7 -> Cut 8 is a HARD CUT (no overlap).
//   sum(sequence durations) - 270 = 5400  =>  sum = 5670.
// ---------------------------------------------------------------------------

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// After you pick the winning candidate for a cut, copy it to
// public/finals/<id>.jpg (e.g. public/finals/cut1.jpg) and add its id here.
// Ids NOT listed here fall back to the generated placeholder card.
export const FINALS: string[] = [];

// Set to true only once assets/music.mp3 (-> public/music.mp3) exists.
export const HAS_MUSIC = false;

/** Crossfade length between cuts 1..7 (1.5 seconds). */
export const CROSSFADE = Math.round(1.5 * FPS); // 45

export type Pan = { x: number; y: number }; // percent translate (of the frame)

export type Caption = {
  kind: "chyron" | "wall" | "framed" | "title";
  /** lines of Korean text */
  text: string[];
  /** small kicker/eyebrow (e.g. handwriting label, "LIVE") */
  eyebrow?: string;
};

export type Cut = {
  id: string;
  /** short human note shown on the placeholder card */
  label: string;
  /** the Nano Banana / Gemini prompt used to generate this cut (also used by scripts/generate-cuts.mjs) */
  prompt: string;
  durationInFrames: number;
  /** Ken Burns: slow zoom (3-5%). Both >= 1 so pan never reveals an edge. */
  scaleFrom: number;
  scaleTo: number;
  panFrom: Pan;
  panTo: Pan;
  /** optional on-screen Korean text overlay (rendered crisply by Remotion) */
  caption?: Caption;
};

// Shared identity + realism spec appended to every image prompt.
export const IDENTITY_SPEC =
  "same person as the reference photos, aged 48: subtle gray at the temples, " +
  "deeper smile lines, identical bone structure, tall frame (189cm).";
export const REALISM_SPEC =
  "photorealistic, shot on Sony A7III, 85mm f/1.4, natural skin texture, " +
  "cinematic color grading. Real photograph only — no illustration, no anime, " +
  "no 3D render, no painting.";

export const CUTS: Cut[] = [
  {
    id: "cut1",
    label: "새벽 5시 러닝 · 블루아워 롱샷",
    prompt:
      `Wide long shot at 5am blue hour: the man (${IDENTITY_SPEC}) running along an ` +
      `elevated path with a near-future city skyline behind him, an old dog trotting beside him. ` +
      `Cool blue pre-dawn light, breath visible, motion, cinematic wide framing. ${REALISM_SPEC}`,
    durationInFrames: 780,
    scaleFrom: 1.06,
    scaleTo: 1.11,
    panFrom: { x: -2, y: 0 },
    panTo: { x: 2, y: -1 },
  },
  {
    id: "cut2",
    label: "현관/부엌 · 김 서린 창, 배우자 뒷모습",
    prompt:
      `Interior, early morning: the man (${IDENTITY_SPEC}) just back from a run, standing in a ` +
      `warm-lit kitchen doorway; steamed-up window, a spouse seen only from behind (face not identifiable). ` +
      `Warm tungsten glow, intimate, shallow depth of field. ${REALISM_SPEC}`,
    durationInFrames: 750,
    scaleFrom: 1.07,
    scaleTo: 1.11,
    panFrom: { x: 1, y: 1 },
    panTo: { x: -1, y: -1 },
  },
  {
    id: "cut3",
    label: "뉴스 화면 · 주인공 프레임 구석에 작게",
    prompt:
      `Interior living room: a large wall screen dominates the frame; the man (${IDENTITY_SPEC}) ` +
      `stands small in the corner of the frame holding a coffee mug, watching. Soft morning interior light. ` +
      `Leave the wall screen visually clean (headline added in post). ${REALISM_SPEC}`,
    durationInFrames: 780,
    scaleFrom: 1.05,
    scaleTo: 1.09,
    panFrom: { x: 0, y: 0 },
    panTo: { x: 1, y: 0 },
    caption: {
      kind: "chyron",
      eyebrow: "속보",
      text: ["치료 접근 비용, 10년 새 95% 하락"],
    },
  },
  {
    id: "cut4",
    label: "회사 로비 · 벽 문구에 카메라 고정",
    prompt:
      `Bright modern company lobby, young employees walking past in motion blur; a large clean feature ` +
      `wall (lettering added in post). Camera locked on the wall. Airy daylight, glass and pale concrete. ${REALISM_SPEC}`,
    durationInFrames: 780,
    scaleFrom: 1.04,
    scaleTo: 1.075,
    panFrom: { x: 0, y: 0 },
    panTo: { x: 0, y: 0 },
    caption: {
      kind: "wall",
      text: [
        "인류가 우리 종을 자랑스러워할",
        "회사 하나가 세상에 나오게 한다",
      ],
    },
  },
  {
    id: "cut5",
    label: "병원 복도 · 노인, 자연광 (주인공 없음)",
    prompt:
      `Hospital corridor bathed in natural light: an ordinary elderly Korean person in plain clothes ` +
      `walking out smiling after finishing treatment. Hopeful, calm, documentary feel. ` +
      `The main character is NOT in this shot. ${REALISM_SPEC}`,
    durationInFrames: 750,
    scaleFrom: 1.06,
    scaleTo: 1.10,
    panFrom: { x: 2, y: 0 },
    panTo: { x: -1, y: 0 },
  },
  {
    id: "cut6",
    label: "저녁 식탁 · 가족·친구, 얕은 심도 (피크)",
    prompt:
      `Evening dinner table, lively and crowded with family and old friends; the man (${IDENTITY_SPEC}) ` +
      `laughing in the middle. Warm tungsten lighting, shallow depth of field, candid warmth, glasses raised. ${REALISM_SPEC}`,
    durationInFrames: 840,
    scaleFrom: 1.07,
    scaleTo: 1.12,
    panFrom: { x: -2, y: 1 },
    panTo: { x: 1, y: -1 },
  },
  {
    id: "cut7",
    label: "서재, 밤 · 벽의 액자를 바라본다",
    prompt:
      `Study at night: the man (${IDENTITY_SPEC}) looking at a framed picture on the wall. ` +
      `Inside the frame is a crude old web-app screenshot. Warm desk lamp, quiet, contemplative, ` +
      `shallow depth of field. Leave room under the frame for a handwritten caption (added in post). ${REALISM_SPEC}`,
    durationInFrames: 810,
    scaleFrom: 1.05,
    scaleTo: 1.09,
    panFrom: { x: 1, y: -1 },
    panTo: { x: -1, y: 1 },
    caption: {
      kind: "framed",
      text: ["판정을 처음 받은 날"],
    },
  },
  {
    id: "cut8",
    label: "암전 + 자막",
    prompt: "", // pure black title card — no image generated
    durationInFrames: 180, // ~6s: 1s in, 3s hold, 2s out
    scaleFrom: 1,
    scaleTo: 1,
    panFrom: { x: 0, y: 0 },
    panTo: { x: 0, y: 0 },
    caption: {
      kind: "title",
      text: ["그 화요일은, 2026년 7월의", "어느 목요일에서 시작됐다."],
    },
  },
];

// Absolute start frame of each cut, accounting for crossfade overlap.
// Cuts 1..7 overlap by CROSSFADE; cut 7->8 is a hard cut (no overlap).
export const cutStarts: number[] = (() => {
  const starts: number[] = [];
  let f = 0;
  for (let i = 0; i < CUTS.length; i++) {
    starts.push(f);
    const isHardCutNext = i === CUTS.length - 2; // 7 -> 8
    f += CUTS[i].durationInFrames - (isHardCutNext ? 0 : CROSSFADE);
  }
  return starts;
})();

export const TOTAL_FRAMES =
  cutStarts[CUTS.length - 1] + CUTS[CUTS.length - 1].durationInFrames; // 5400

// ---------------------------------------------------------------------------
// Music volume automation (absolute composition frames -> 0..1).
//   cut1: piano single notes fade in
//   cut3: DUCK + ~1s of near-silence (the scripted "1초 무음" beat)
//   cut4: theme melody first appears
//   cut6: PEAK (warmest, richest part)
//   cut7: return to the single piano note (same as cut1)
//   cut8: fade out
// Derived from cutStarts so it stays correct if durations change.
// ---------------------------------------------------------------------------
const s = cutStarts;
export const MUSIC_KEYS: number[] = [
  0,
  90, // cut1 fade-in done
  s[2] + 30, // cut3 begins ducking
  s[2] + 300, // near-silence beat
  s[2] + 360,
  s[2] + 420, // music returns
  s[3], // cut4 theme in
  s[4], // cut5
  s[5], // cut6 begins
  s[5] + 420, // cut6 PEAK
  s[6], // cut7 return to piano
  s[7], // cut8 begins (hard cut)
  s[7] + 120, // faded out
  TOTAL_FRAMES,
];
export const MUSIC_VOLS: number[] = [
  0, 0.7, 0.7, 0.25, 0.05, 0.3, 0.62, 0.68, 0.8, 1.0, 0.58, 0.45, 0.0, 0.0,
];
