import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, Series, staticFile } from "remotion";
import { Backdrop, Fonts } from "./ui";
import { Chaos } from "./scenes/Chaos";
import { Connect } from "./scenes/Connect";
import { Outro } from "./scenes/Outro";
import { Alcohol, Dashboard, Housekeeping, Install, Maintenance, Requests, Room } from "./scenes/Features";

/* Each scene, its length and the narration lines it carries ([file, frame inside the scene]) */
export const SCENES = [
  { id: "Chaos", c: Chaos, d: 600, vo: [["a1", 18], ["a2", 400]] },
  { id: "Connect", c: Connect, d: 360, vo: [["b1", 15]] },
  { id: "Dashboard", c: Dashboard, d: 300, vo: [["v3", 12]] },
  { id: "Housekeeping", c: Housekeeping, d: 342, vo: [["v4", 12]] },
  { id: "Requests", c: Requests, d: 246, vo: [["v5", 12]] },
  { id: "Maintenance", c: Maintenance, d: 189, vo: [["v6", 12]] },
  { id: "Room", c: Room, d: 207, vo: [["v7", 12]] },
  { id: "Alcohol", c: Alcohol, d: 192, vo: [["v8", 12]] },
  { id: "Install", c: Install, d: 198, vo: [["v9", 12]] },
  { id: "Outro", c: Outro, d: 200, vo: [["c1", 20]] },
] as const;

export const TOTAL = SCENES.reduce((s, x) => s + x.d, 0); // 2834 frames, about 94 s

export const StayDeskVideo: React.FC = () => {
  let at = 0;
  const voices = SCENES.flatMap((s) => {
    const start = at;
    at += s.d;
    return s.vo.map(([file, f]) => ({ file, from: start + f }));
  });
  return (
    <AbsoluteFill style={{ backgroundColor: "#081226" }}>
      <Fonts />
      <Backdrop />
      <Series>
        {SCENES.map((s) => (
          <Series.Sequence key={s.id} name={s.id} durationInFrames={s.d}>
            <s.c />
          </Series.Sequence>
        ))}
      </Series>
      {/* the original video's music with its narrator taken out, low under the new voice */}
      <Audio
        src={staticFile("music-bed.m4a")}
        volume={(f) => interpolate(f, [0, 20, TOTAL - 60, TOTAL], [0, 0.28, 0.28, 0], { extrapolateRight: "clamp" })}
      />
      {voices.map((v) => (
        <Sequence key={v.file} from={v.from} layout="none">
          <Audio src={staticFile(`vo/${v.file}.wav`)} volume={1} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
