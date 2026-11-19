import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  OffthreadVideo,
  Sequence,
  Series,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Backdrop, Fonts } from "./ui";
import { Intro } from "./scenes/Intro";
import { Brand } from "./scenes/Brand";
import { Alcohol, Dashboard, Housekeeping, Install, Maintenance, Requests, Room } from "./scenes/Features";

/* Each body scene is its voice line plus a little air; the voice starts 15 frames in */
export const SCENES = [
  { id: "Intro", c: Intro, d: 240, vo: "v1" },
  { id: "Brand", c: Brand, d: 126, vo: "v2" },
  { id: "Dashboard", c: Dashboard, d: 300, vo: "v3" },
  { id: "Housekeeping", c: Housekeeping, d: 342, vo: "v4" },
  { id: "Requests", c: Requests, d: 246, vo: "v5" },
  { id: "Maintenance", c: Maintenance, d: 189, vo: "v6" },
  { id: "Room", c: Room, d: 207, vo: "v7" },
  { id: "Alcohol", c: Alcohol, d: 192, vo: "v8" },
  { id: "Install", c: Install, d: 198, vo: "v9" },
] as const;

export const BODY = SCENES.reduce((s, x) => s + x.d, 0); // 2040 frames = 68 s
export const ENDING = 492; // the original ending, 16.4 s
export const TOTAL = BODY + ENDING;

/* the original ending's pictures, faded in over 15 frames; its own audio is muted (it carries the old narrator) */
const Ending: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <OffthreadVideo
      style={{ opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }) }}
      src={staticFile("ending.mp4")}
      muted
    />
  );
};

export const StayDeskVideo: React.FC = () => {
  let at = 0;
  const voices = SCENES.map((s) => {
    const from = at + (s.id === "Intro" ? 18 : 12);
    at += s.d;
    return { from, vo: s.vo };
  });
  return (
    <AbsoluteFill style={{ backgroundColor: "#081226" }}>
      <Fonts />
      <Sequence durationInFrames={BODY} layout="none">
        <Backdrop />
      </Sequence>
      <Series>
        {SCENES.map((s) => (
          <Series.Sequence key={s.id} name={s.id} durationInFrames={s.d}>
            <s.c />
          </Series.Sequence>
        ))}
        <Series.Sequence name="Original ending" durationInFrames={ENDING}>
          <Ending />
        </Series.Sequence>
      </Series>
      {voices.map((v) => (
        <Sequence key={v.vo} from={v.from} layout="none">
          <Audio src={staticFile(`vo/${v.vo}.wav`)} volume={1} />
        </Sequence>
      ))}
      {/* the closing line, in the same voice, where the old narrator said it */}
      <Sequence from={BODY + 72} layout="none">
        <Audio src={staticFile("vo/v10.wav")} volume={1} />
      </Sequence>
    </AbsoluteFill>
  );
};
