import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, FONT } from "../ui";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* The logo and the name settle, the line is said, then the logo flies straight at the camera and is gone */
export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const fly = interpolate(frame, [140, 185], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  return (
    <AbsoluteFill style={{ fontFamily: FONT, color: C.ink, opacity: interpolate(frame, [0, 10], [0, 1], clamp) }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 36,
        }}
      >
        <Img
          src={staticFile("shots/logo.png")}
          style={{
            width: 240,
            height: 240,
            borderRadius: 56,
            boxShadow: "0 40px 120px -20px rgba(247,148,29,0.5)",
            opacity: interpolate(frame, [0, 12], [0, 1], clamp) * interpolate(fly, [0.55, 1], [1, 0], clamp),
            scale: String(
              interpolate(frame, [0, 26], [0.6, 1], { ...clamp, easing: Easing.bezier(0.34, 1.56, 0.64, 1) }) *
                interpolate(fly, [0, 1], [1, 16]),
            ),
            filter: `blur(${interpolate(fly, [0.4, 1], [0, 18], clamp)}px)`,
            zIndex: 2,
          }}
        />
        <div
          style={{
            fontSize: 140,
            fontWeight: 600,
            letterSpacing: "-0.05em",
            lineHeight: 1,
            opacity: interpolate(frame, [12, 28], [0, 1], clamp) * interpolate(fly, [0, 0.35], [1, 0], clamp),
          }}
        >
          StayDesk
        </div>
        <div
          style={{
            fontSize: 46,
            color: C.muted,
            opacity: interpolate(frame, [24, 40], [0, 1], clamp) * interpolate(fly, [0, 0.35], [1, 0], clamp),
          }}
        >
          Your whole hotel, in one app.
        </div>
      </div>
    </AbsoluteFill>
  );
};
