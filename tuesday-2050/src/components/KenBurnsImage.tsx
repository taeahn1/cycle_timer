import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Cut, FINALS } from "../config";

/**
 * Slow Ken Burns zoom + pan over a single cut's image.
 * Uses the picked final (public/finals/<id>.jpg) if the id is listed in
 * FINALS, otherwise the generated placeholder card (public/placeholders/<id>.svg).
 */
export const KenBurnsImage: React.FC<{ cut: Cut; durationInFrames: number }> = ({
  cut,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();

  const src = FINALS.includes(cut.id)
    ? staticFile(`finals/${cut.id}.png`)
    : staticFile(`placeholders/${cut.id}.svg`);

  const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scale = interpolate(progress, [0, 1], [cut.scaleFrom, cut.scaleTo]);
  const x = interpolate(progress, [0, 1], [cut.panFrom.x, cut.panTo.x]);
  const y = interpolate(progress, [0, 1], [cut.panFrom.y, cut.panTo.y]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          scale,
          translate: `${x}% ${y}%`,
        }}
      />
    </AbsoluteFill>
  );
};
