// Korean fonts loaded from LOCAL files in public/fonts/ (see scripts/fetch-fonts.mjs).
// Loading locally avoids fetching gstatic at render time, which the sandboxed
// render browser can't TLS-verify. loadFont() registers its own delayRender,
// so the render waits until each font is ready.
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const sansKR = "Noto Sans KR";
export const serifKR = "Noto Serif KR";
export const penKR = "Nanum Pen Script";
export const displayKR = "Black Han Sans";

loadFont({ family: sansKR, url: staticFile("fonts/NotoSansKR-500.woff2"), weight: "500", format: "woff2" });
loadFont({ family: sansKR, url: staticFile("fonts/NotoSansKR-700.woff2"), weight: "700", format: "woff2" });
loadFont({ family: serifKR, url: staticFile("fonts/NotoSerifKR-300.woff2"), weight: "300", format: "woff2" });
loadFont({ family: penKR, url: staticFile("fonts/NanumPenScript-400.woff2"), weight: "400", format: "woff2" });
loadFont({ family: displayKR, url: staticFile("fonts/BlackHanSans-400.woff2"), weight: "400", format: "woff2" });
