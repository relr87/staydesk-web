import React from "react";
import { Composition } from "remotion";
import { StayDeskVideo, TOTAL } from "./StayDeskVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="StayDesk"
      component={StayDeskVideo}
      durationInFrames={TOTAL}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
