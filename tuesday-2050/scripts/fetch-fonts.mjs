// Downloads the Korean fonts used by the captions as LOCAL, self-contained
// woff2 files into public/fonts/, subset to exactly the glyphs we render.
// This makes rendering fully offline/deterministic (no gstatic at render time,
// which the sandboxed render browser can't TLS-verify).
//
// If you change any caption text in src/config.ts, add the new characters to
// CAPTION_TEXT below and re-run:  node scripts/fetch-fonts.mjs
import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "fonts");
mkdirSync(outDir, { recursive: true });

// Every string rendered by a caption, plus latin/digits/punctuation for safety.
const CAPTION_TEXT = [
  "속보",
  "치료 접근 비용, 10년 새 95% 하락",
  "인류가 우리 종을 자랑스러워할 회사 하나가 세상에 나오게 한다",
  "판정을 처음 받은 날",
  "그 화요일은, 2026년 7월의 어느 목요일에서 시작됐다.",
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  " .,%·—:()",
].join("");
// Deduplicate characters to keep the subset request small.
const text = Array.from(new Set(Array.from(CAPTION_TEXT))).join("");

const CA = "/root/.ccr/ca-bundle.crt";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

const fonts = [
  { css: "Noto Sans KR", weight: "500", out: "NotoSansKR-500", useWght: true },
  { css: "Noto Sans KR", weight: "700", out: "NotoSansKR-700", useWght: true },
  { css: "Noto Serif KR", weight: "300", out: "NotoSerifKR-300", useWght: true },
  { css: "Nanum Pen Script", weight: "400", out: "NanumPenScript-400", useWght: false },
  { css: "Black Han Sans", weight: "400", out: "BlackHanSans-400", useWght: false },
];

const curl = (url) =>
  execSync(
    `curl -sS --cacert ${CA} -A ${JSON.stringify(UA)} ${JSON.stringify(url)}`,
    { maxBuffer: 64 * 1024 * 1024 },
  );

for (const f of fonts) {
  const fam = encodeURIComponent(f.css).replace(/%20/g, "+");
  const spec = f.useWght ? `${fam}:wght@${f.weight}` : fam;
  const cssUrl = `https://fonts.googleapis.com/css2?family=${spec}&display=block&text=${encodeURIComponent(
    text,
  )}`;
  const css = curl(cssUrl).toString("utf8");
  const m = css.match(/src:\s*url\(([^)]+)\)\s*format\('([^']+)'\)/);
  if (!m) {
    console.error(`✗ ${f.out}: could not parse @font-face from CSS:\n${css.slice(0, 200)}`);
    continue;
  }
  const [, fontUrl, fmt] = m;
  const bin = curl(fontUrl);
  const ext = fmt === "woff2" ? "woff2" : fmt === "woff" ? "woff" : "ttf";
  writeFileSync(join(outDir, `${f.out}.${ext}`), bin);
  console.log(`✓ ${f.out}.${ext}  (${(bin.length / 1024).toFixed(1)} KB, format ${fmt})`);
}
console.log("\nFonts written to public/fonts/. They are loaded locally in src/fonts.ts.");
