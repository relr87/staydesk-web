import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { C, Scene } from "../ui";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* The morning before StayDesk: notifications pile up from every side */
const NOTES = [
  { app: "Housekeeping chat", msg: "Who has room 305??", x: 150, y: 150, at: 14, tone: "#2F9E6E" },
  { app: "Front desk line", msg: "Line 2 on hold", x: 1350, y: 120, at: 26, tone: "#3B6FD8" },
  { app: "Maintenance", msg: "A/C broken, room 724", x: 220, y: 700, at: 38, tone: "#D8553B" },
  { app: "Guest calls", msg: "Room 412 is calling", x: 1300, y: 690, at: 50, tone: "#2F9E6E" },
  { app: "Printed room list", msg: "Old by 6:30 AM", x: 640, y: 80, at: 62, tone: "#C9A227" },
  { app: "Lost & found", msg: "3 missed calls", x: 1420, y: 410, at: 74, tone: "#D88A3B" },
  { app: "Team radio", msg: "Who's on the 3rd floor?", x: 110, y: 430, at: 86, tone: "#3B6FD8" },
  { app: "Sticky note", msg: "Call back 1187", x: 760, y: 820, at: 98, tone: "#C9A227" },
];

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Scene>
      {NOTES.map((n, i) => {
        const t = frame - n.at;
        return (
          <div
            key={n.app}
            style={{
              position: "absolute",
              left: n.x,
              top: n.y,
              width: 400,
              padding: "22px 26px",
              borderRadius: 22,
              background: "rgba(20,32,58,0.9)",
              border: `1px solid ${C.line}`,
              boxShadow: "0 30px 60px -24px rgba(0,0,0,0.7)",
              opacity: interpolate(t, [0, 8], [0, 1], clamp) * interpolate(frame, [150, 200], [1, 0.25], clamp),
              scale: interpolate(t, [0, 16], [0.85, 1], { ...clamp, easing: Easing.bezier(0.34, 1.56, 0.64, 1) }),
              translate: `0px ${Math.sin((frame + i * 20) / 22) * 6}px`,
              filter: `blur(${interpolate(frame, [150, 200], [0, 6], clamp)}px)`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 24, color: C.muted }}>
              <span style={{ width: 12, height: 12, borderRadius: 4, background: n.tone }} />
              {n.app}
              <span style={{ marginLeft: "auto", fontSize: 22 }}>now</span>
            </div>
            <div style={{ marginTop: 10, fontSize: 32, fontWeight: 500 }}>{n.msg}</div>
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 430,
          textAlign: "center",
          fontSize: 96,
          fontWeight: 600,
          letterSpacing: "-0.04em",
          lineHeight: 1.05,
          opacity: interpolate(frame, [120, 150], [0, 1], clamp),
          translate: interpolate(frame, [120, 160], ["0px 30px", "0px 0px"], {
            ...clamp,
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        Five tools.
        <br />
        <span style={{ color: C.muted }}>None of them talk.</span>
      </div>
    </Scene>
  );
};
