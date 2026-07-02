// Builds a per-cut contact sheet (3 candidates side by side) by screenshotting
// an HTML layout with the pre-installed headless Chromium. Output: candidates/contact_<cut>.png
import { execFileSync } from "node:child_process";
import { writeFileSync, existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const SHELL =
  "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";

const titles = {
  cut1: "컷1 · 새벽 5시 러닝",
  cut2: "컷2 · 현관/부엌",
  cut3: "컷3 · 뉴스 화면",
  cut4: "컷4 · 회사 로비",
  cut5: "컷5 · 병원 복도",
  cut6: "컷6 · 저녁 식탁",
  cut7: "컷7 · 서재, 밤",
};

const b64 = (p) => "data:image/png;base64," + readFileSync(p).toString("base64");

for (const cut of Object.keys(titles)) {
  const imgs = [1, 2, 3]
    .map((n) => join(root, "candidates", cut, `candidate_${n}.png`))
    .filter(existsSync);
  if (imgs.length === 0) {
    console.log(`skip ${cut} (no candidates)`);
    continue;
  }
  const cells = imgs
    .map(
      (p, i) =>
        `<div class="cell"><div class="lbl">후보 ${i + 1}</div><img src="${b64(p)}"/></div>`,
    )
    .join("");
  const html = `<!doctype html><meta charset="utf-8"><body style="margin:0;background:#0b0d12;font-family:sans-serif">
  <div style="color:#fff;font-size:26px;padding:14px 20px 6px">${titles[cut]}</div>
  <div style="display:flex;gap:10px;padding:0 20px 20px">${cells}</div>
  <style>.cell{flex:1}.cell img{width:100%;display:block;border-radius:6px}
  .lbl{color:#cbd5e1;font-size:18px;margin:0 0 6px 2px}</style></body>`;
  const htmlPath = join(root, "candidates", `_${cut}.html`);
  writeFileSync(htmlPath, html);
  const out = join(root, "candidates", `contact_${cut}.png`);
  execFileSync(SHELL, [
    "--headless",
    "--no-sandbox",
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    `--screenshot=${out}`,
    "--window-size=1650,400",
    `file://${htmlPath}`,
  ]);
  console.log("wrote", out);
}
