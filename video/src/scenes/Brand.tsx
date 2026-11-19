import React from "react";
import { Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, Scene } from "../ui";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);

export const Brand: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Scene>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
        }}
      >
        <Img
          src={staticFile("shots/logo.png")}
          style={{
            width: 220,
            height: 220,
            borderRadius: 52,
            boxShadow: "0 40px 120px -20px rgba(247,148,29,0.45)",
            scale: interpolate(frame, [0, 26], [0.6, 1], { ...clamp, easing: Easing.bezier(0.34, 1.56, 0.64, 1) }),
            opacity: interpolate(frame, [0, 10], [0, 1], clamp),
          }}
        />
        <div
          style={{
            fontSize: 150,
            fontWeight: 600,
            letterSpacing: "-0.05em",
            lineHeight: 1,
            opacity: interpolate(frame, [10, 26], [0, 1], clamp),
            translate: interpolate(frame, [10, 34], ["0px 30px", "0px 0px"], { ...clamp, easing: ease }),
          }}
        >
          StayDesk
        </div>
        <div
          style={{
            fontSize: 48,
            color: C.muted,
            letterSpacing: "-0.01em",
            opacity: interpolate(frame, [22, 38], [0, 1], clamp),
          }}
        >
          Your whole hotel, in one app.
        </div>
      </div>
    </Scene>
  );
};
