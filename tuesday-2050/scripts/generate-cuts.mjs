// Step 1 of the pipeline: generate 3 candidate images per cut with
// Nano Banana (Gemini 2.5 Flash Image), conditioned on the reference photos so
// the subject's identity is preserved. Saves to candidates/<cutId>/candidate_N.png.
//
// Requires:
//   - GEMINI_API_KEY in the environment
//   - reference photos in ../refs (jpg/png) — the same person in every cut
//
// Run:  node scripts/generate-cuts.mjs           (all cuts)
//       node scripts/generate-cuts.mjs cut3 cut6 (specific cuts)
//
// The prompts mirror src/config.ts (kept in sync by hand). Cut 8 is a pure
// black title card and is intentionally NOT generated here.
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, extname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const refsDir = join(root, "refs");
const MODEL = "gemini-2.5-flash-image";
const CANDIDATES_PER_CUT = 3;

const IDENTITY =
  "same person as the reference photos, aged 48: subtle gray at the temples, " +
  "deeper smile lines, identical bone structure, tall frame (189cm).";
const REALISM =
  "photorealistic, shot on Sony A7III, 85mm f/1.4, natural skin texture, " +
  "cinematic color grading. Real photograph only — no illustration, no anime, " +
  "no 3D render, no painting.";

const CUTS = [
  ["cut1", `Wide long shot at 5am blue hour: the man (${IDENTITY}) running along an elevated path with a near-future city skyline behind him, an old dog trotting beside him. Cool blue pre-dawn light, breath visible, motion, cinematic wide framing. ${REALISM}`],
  ["cut2", `Interior, early morning: the man (${IDENTITY}) just back from a run, standing in a warm-lit kitchen doorway; steamed-up window, a spouse seen only from behind (face not identifiable). Warm tungsten glow, intimate, shallow depth of field. ${REALISM}`],
  ["cut3", `Interior living room: a large wall screen dominates the frame; the man (${IDENTITY}) stands small in the corner of the frame holding a coffee mug, watching. Soft morning interior light. Keep the wall screen visually clean. ${REALISM}`],
  ["cut4", `Bright modern company lobby, young employees walking past in motion blur; a large clean feature wall. Camera locked on the wall. Airy daylight, glass and pale concrete. ${REALISM}`],
  ["cut5", `Hospital corridor bathed in natural light: an ordinary elderly Korean person in plain clothes walking out smiling after finishing treatment. Hopeful, calm, documentary feel. The main character is NOT in this shot. ${REALISM}`],
  ["cut6", `Evening dinner table, lively and crowded with family and old friends; the man (${IDENTITY}) laughing in the middle. Warm tungsten lighting, shallow depth of field, candid warmth. ${REALISM}`],
  ["cut7", `Study at night: the man (${IDENTITY}) looking at a framed picture on the wall containing a crude old web-app screenshot. Warm desk lamp, quiet, contemplative, shallow depth of field. ${REALISM}`],
];

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("✗ GEMINI_API_KEY is not set. Export it and re-run.");
  process.exit(1);
}
if (!existsSync(refsDir)) {
  console.error(`✗ Missing refs/ folder at ${refsDir}. Add the reference photos first.`);
  process.exit(1);
}

const mimeFor = (f) =>
  ({ ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" })[
    extname(f).toLowerCase()
  ];

const refFiles = readdirSync(refsDir).filter((f) => mimeFor(f));
if (refFiles.length === 0) {
  console.error("✗ No reference images (jpg/png/webp) found in refs/.");
  process.exit(1);
}
// Cap references to keep the request payload reasonable.
const refParts = refFiles.slice(0, 6).map((f) => ({
  inlineData: {
    mimeType: mimeFor(f),
    data: readFileSync(join(refsDir, f)).toString("base64"),
  },
}));
console.log(`Using ${refParts.length} reference photo(s): ${refFiles.slice(0, 6).join(", ")}`);

const only = process.argv.slice(2);
const selected = only.length ? CUTS.filter(([id]) => only.includes(id)) : CUTS;

const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;

async function generateOne(prompt) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [...refParts, { text: prompt }] }],
    }),
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }
  const json = await res.json();
  const parts = json?.candidates?.[0]?.content?.parts ?? [];
  const img = parts.find((p) => p.inlineData?.data);
  if (!img) throw new Error("no image in response");
  return Buffer.from(img.inlineData.data, "base64");
}

for (const [id, prompt] of selected) {
  const dir = join(root, "candidates", id);
  mkdirSync(dir, { recursive: true });
  for (let n = 1; n <= CANDIDATES_PER_CUT; n++) {
    try {
      const buf = await generateOne(prompt);
      const out = join(dir, `candidate_${n}.png`);
      writeFileSync(out, buf);
      console.log(`✓ ${id} candidate ${n} -> ${out}`);
    } catch (e) {
      console.error(`✗ ${id} candidate ${n}: ${e.message}`);
    }
  }
}
console.log("\nDone. Review candidates/, pick a winner, copy it to public/finals/<cutId>.jpg, and add the id to FINALS in src/config.ts.");
