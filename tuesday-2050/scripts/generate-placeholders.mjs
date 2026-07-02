// Generates cinematic SVG placeholder cards for each cut so the composition
// renders before the real images exist. Replace with public/finals/<id>.jpg
// (and list the id in FINALS in src/config.ts) once you pick real candidates.
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "placeholders");
mkdirSync(outDir, { recursive: true });

// [id, number label, english title, korean title, gradient stops (mood)]
const cuts = [
  ["cut1", "01", "5AM RUN — BLUE HOUR", "새벽 5시 러닝", ["#0b1622", "#1c3350", "#2e5a7a"]],
  ["cut2", "02", "KITCHEN — WARM LIGHT", "현관 / 부엌", ["#1a0f07", "#3a2410", "#6b4420"]],
  ["cut3", "03", "NEWS SCREEN", "뉴스 화면", ["#0a0d12", "#141b26", "#242f40"]],
  ["cut4", "04", "COMPANY LOBBY", "회사 로비", ["#141414", "#2b2b2b", "#565656"]],
  ["cut5", "05", "HOSPITAL CORRIDOR", "병원 복도", ["#101418", "#2a3238", "#5a6b73"]],
  ["cut6", "06", "DINNER TABLE — PEAK", "저녁 식탁", ["#1a0d06", "#40200d", "#7d4a1e"]],
  ["cut7", "07", "STUDY, NIGHT", "서재, 밤", ["#0a0806", "#1e1710", "#3c2d1c"]],
  ["cut8", "08", "BLACK — TITLE CARD", "암전 + 자막", ["#000000", "#000000", "#000000"]],
];

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

for (const [id, num, en, ko, [c0, c1, c2]] of cuts) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c0}"/>
      <stop offset="0.55" stop-color="${c1}"/>
      <stop offset="1" stop-color="${c2}"/>
    </linearGradient>
    <radialGradient id="v" cx="0.5" cy="0.5" r="0.75">
      <stop offset="0.55" stop-color="#000000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0.65"/>
    </radialGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#g)"/>
  <rect width="1920" height="1080" fill="url(#v)"/>
  <text x="120" y="230" font-family="Arial, sans-serif" font-size="220" font-weight="800" fill="#ffffff" fill-opacity="0.10">${num}</text>
  <text x="120" y="900" font-family="Arial, sans-serif" font-size="46" font-weight="700" fill="#ffffff" fill-opacity="0.92" letter-spacing="4">${esc(en)}</text>
  <text x="120" y="960" font-family="Arial, sans-serif" font-size="40" fill="#ffffff" fill-opacity="0.7">${esc(ko)}</text>
  <text x="120" y="1010" font-family="Arial, sans-serif" font-size="26" fill="#ffffff" fill-opacity="0.45">PLACEHOLDER — needs refs/ photos + GEMINI_API_KEY, then public/finals/${id}.jpg</text>
</svg>`;
  writeFileSync(join(outDir, `${id}.svg`), svg);
  console.log("wrote", `${id}.svg`);
}
