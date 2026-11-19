import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { C, Scene } from "../ui";
import { TOOLS, ToolCard } from "../tools";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* Pop-up alerts that keep landing on top of the tools */
const ALERTS = [
  { t: "Guest waiting in the lobby", x: 760, y: 150, at: 330 },
  { t: "Is 214 clean yet?", x: 980, y: 440, at: 372 },
  { t: "Who took the A/C call?", x: 420, y: 470, at: 414 },
  { t: "Missed call · Room 412", x: 1180, y: 860, at: 448 },
];

/* The morning before StayDesk: five tools, a clock that will not slow down, alerts piling up */
export const Chaos: React.FC = () => {
  const frame = useCurrentFrame();
  const minutes = Math.floor(interpolate(frame, [0, 600], [0, 47], clamp));
  const stress = interpolate(frame, [330, 520], [0, 1], clamp);
  return (
    <Scene>
      {/* the clock in the corner keeps running */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 60,
          fontSize: 44,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          fontVariantNumeric: "tabular-nums",
          color: minutes > 30 ? "#FF8A7A" : C.ink,
          opacity: interpolate(frame, [0, 12], [0, 1], clamp),
        }}
      >
        7:{String(minutes).padStart(2, "0")} AM
      </div>

      {TOOLS.map((tool, i) => {
        const t = frame - tool.at;
        const shake = stress * Math.sin((frame + i * 9) / 2.2) * 4;
        return (
          <div
            key={tool.id}
            style={{
              position: "absolute",
              left: tool.chaos.x,
              top: tool.chaos.y,
              transformOrigin: "0 0",
              rotate: `${tool.chaos.r + shake * 0.3}deg`,
              translate: `${shake}px ${Math.sin((frame + i * 30) / 26) * 6}px`,
              opacity: interpolate(t, [0, 8], [0, 1], clamp),
              scale: String(1.2 * interpolate(t, [0, 16], [0.8, 1], { ...clamp, easing: Easing.bezier(0.34, 1.56, 0.64, 1) })),
              filter: `blur(${interpolate(frame, [520, 590], [0, 4], clamp)}px) brightness(${interpolate(frame, [520, 590], [1, 0.32], clamp)})`,
            }}
          >
            <ToolCard tool={tool} frame={frame} badge={Math.max(1, Math.floor(interpolate(frame, [tool.at, 560], [1, 9 + i * 3], clamp)))} />
          </div>
        );
      })}

      {ALERTS.map((a) => (
        <div
          key={a.t}
          style={{
            position: "absolute",
            left: a.x,
            top: a.y,
            padding: "14px 22px",
            borderRadius: 14,
            background: "#C0392B",
            color: "#fff",
            fontSize: 28,
            fontWeight: 500,
            boxShadow: "0 20px 40px -12px rgba(0,0,0,0.6)",
            opacity: interpolate(frame - a.at, [0, 6], [0, 1], clamp) * interpolate(frame, [520, 580], [1, 0], clamp),
            scale: interpolate(frame - a.at, [0, 12], [0.7, 1], { ...clamp, easing: Easing.bezier(0.34, 1.56, 0.64, 1) }),
          }}
        >
          {a.t}
        </div>
      ))}

      {/* the line that sums it up, over the dimmed mess */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 440,
          textAlign: "center",
          fontSize: 100,
          fontWeight: 600,
          letterSpacing: "-0.04em",
          lineHeight: 1.05,
          opacity: interpolate(frame, [528, 556], [0, 1], clamp),
          translate: interpolate(frame, [528, 566], ["0px 30px", "0px 0px"], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) }),
        }}
      >
        Five tools.
        <br />
        <span style={{ color: "#FF8A7A" }}>Nothing connected.</span>
      </div>
    </Scene>
  );
};
