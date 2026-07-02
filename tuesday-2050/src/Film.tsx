import { AbsoluteFill, interpolate, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import {
  CROSSFADE,
  CUTS,
  HAS_MUSIC,
  MUSIC_KEYS,
  MUSIC_VOLS,
} from "./config";
import { Scene } from "./components/Scene";

/**
 * The full film. Cuts 1..7 are joined by 1.5s crossfades; cut 7 -> 8 is a
 * hard cut (no transition element between them). A single music track spans
 * the whole piece with volume automation (duck at cut 3, peak at cut 6,
 * fade out at cut 8).
 */
export const Film: React.FC = () => {
  // Build a flat list of TransitionSeries children (Sequence / Transition).
  const children: React.ReactNode[] = [];
  CUTS.forEach((cut, i) => {
    // A crossfade precedes every cut except the first and cut 8 (hard cut).
    const isTitleCut = i === CUTS.length - 1;
    if (i > 0 && !isTitleCut) {
      children.push(
        <TransitionSeries.Transition
          key={`t-${cut.id}`}
          presentation={fade()}
          timing={linearTiming({ durationInFrames: CROSSFADE })}
        />,
      );
    }
    children.push(
      <TransitionSeries.Sequence
        key={cut.id}
        durationInFrames={cut.durationInFrames}
      >
        <Scene cut={cut} />
      </TransitionSeries.Sequence>,
    );
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <TransitionSeries>{children}</TransitionSeries>

      {HAS_MUSIC ? (
        <Audio
          src={staticFile("music.mp3")}
          volume={(f) =>
            interpolate(f, MUSIC_KEYS, MUSIC_VOLS, {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          }
        />
      ) : null}
    </AbsoluteFill>
  );
};
