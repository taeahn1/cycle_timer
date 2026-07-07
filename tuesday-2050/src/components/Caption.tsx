import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Caption as CaptionType } from "../config";
import { displayKR, penKR, sansKR, serifKR } from "../fonts";

/**
 * Crisp Korean on-screen text, rendered by Remotion (not baked into the image),
 * so it stays sharp and editable. Four styles matched to the scenario.
 * When you generate images that already contain the lettering, set the cut's
 * caption to undefined in config.ts to avoid doubling up.
 */
export const Caption: React.FC<{
  caption: CaptionType;
  durationInFrames: number;
}> = ({ caption, durationInFrames }) => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [10, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  if (caption.kind === "chyron") {
    // Lower-third broadcast headline for the wall-screen news cut.
    const rise = interpolate(frame, [10, 40], [24, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
    return (
      <AbsoluteFill
        style={{ justifyContent: "flex-end", alignItems: "flex-start" }}
      >
        <div
          style={{
            opacity: fadeIn,
            translate: `0 ${rise}px`,
            margin: "0 0 96px 96px",
            display: "flex",
            alignItems: "stretch",
            boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
          }}
        >
          {caption.eyebrow ? (
            <div
              style={{
                background: "#c81e1e",
                color: "#fff",
                fontFamily: sansKR,
                fontWeight: 700,
                fontSize: 34,
                letterSpacing: 4,
                padding: "0 26px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {caption.eyebrow}
            </div>
          ) : null}
          <div
            style={{
              background: "rgba(12,14,20,0.92)",
              color: "#fff",
              fontFamily: sansKR,
              fontWeight: 500,
              fontSize: 46,
              padding: "22px 40px",
            }}
          >
            {caption.text.join(" ")}
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  if (caption.kind === "wall") {
    // Architectural lettering on the lobby feature wall.
    return (
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", padding: 140 }}
      >
        <div
          style={{
            opacity: fadeIn,
            fontFamily: displayKR,
            color: "rgba(28,30,36,0.92)",
            fontSize: 92,
            lineHeight: 1.35,
            textAlign: "center",
            textShadow: "0 1px 0 rgba(255,255,255,0.4)",
          }}
        >
          {caption.text.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      </AbsoluteFill>
    );
  }

  if (caption.kind === "framed") {
    // Handwritten note under the framed screenshot in the study.
    return (
      <AbsoluteFill
        style={{ justifyContent: "flex-end", alignItems: "center" }}
      >
        <div
          style={{
            opacity: fadeIn,
            fontFamily: penKR,
            color: "rgba(240,235,225,0.95)",
            fontSize: 72,
            marginBottom: 150,
            textShadow: "0 2px 12px rgba(0,0,0,0.6)",
          }}
        >
          {caption.text.join(" ")}
        </div>
      </AbsoluteFill>
    );
  }

  // kind === "title": black card, white centered text, fade in / hold / fade out.
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 60, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const titleIn = interpolate(frame, [20, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          opacity: titleIn * fadeOut,
          fontFamily: serifKR,
          fontWeight: 300,
          color: "#f4f1ea",
          fontSize: 64,
          lineHeight: 1.6,
          textAlign: "center",
          letterSpacing: 1,
        }}
      >
        {caption.text.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
