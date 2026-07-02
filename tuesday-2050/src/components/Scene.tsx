import { AbsoluteFill } from "remotion";
import { Cut } from "../config";
import { KenBurnsImage } from "./KenBurnsImage";
import { Caption } from "./Caption";

/** One cut: Ken Burns image (or black card for the title) + optional caption. */
export const Scene: React.FC<{ cut: Cut }> = ({ cut }) => {
  const isTitle = cut.caption?.kind === "title";

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {!isTitle && (
        <KenBurnsImage cut={cut} durationInFrames={cut.durationInFrames} />
      )}
      {cut.caption && (
        <Caption caption={cut.caption} durationInFrames={cut.durationInFrames} />
      )}
    </AbsoluteFill>
  );
};
