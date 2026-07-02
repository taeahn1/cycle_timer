import "./index.css";
import { Composition } from "remotion";
import { Film } from "./Film";
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from "./config";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Tuesday2050"
        component={Film}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
