import React from "react";
import { Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, Scene } from "../ui";
import { CARD_H, CARD_W, TOOLS, ToolCard } from "../tools";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const HUB = { x: 960, y: 500 };

/* The five tools glide into a ring, StayDesk appears in the middle,
   and a line draws from each tool into it, with light running along every line */
export const Connect: React.FC = () => {
  const frame = useCurrentFrame();
  const move = interpolate(frame, [0, 45], [0, 1], { ...clamp, easing: ease });
  const scale = interpolate(move, [0, 1], [1.2, 0.8]);
  return (
    <Scene>
      {/* lines first, under the cards */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {TOOLS.map((tool, i) => {
          const sx = tool.hub.x;
          const sy = tool.hub.y;
          const mx = (sx + HUB.x) / 2;
          const d = `M ${sx} ${sy} C ${mx} ${sy}, ${mx} ${HUB.y}, ${HUB.x} ${HUB.y}`;
          const start = 60 + i * 10;
          const draw = interpolate(frame, [start, start + 30], [1, 0], { ...clamp, easing: Easing.inOut(Easing.quad) });
          const pulse = ((frame - start - 30) % 60) / 60;
          return (
            <g key={tool.id}>
              <path d={d} fill="none" stroke="rgba(247,148,29,0.25)" strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={draw} />
              <path d={d} fill="none" stroke={C.accent} strokeWidth={3} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={draw} />
              {frame > start + 30 && (
                <path
                  d={d}
                  fill="none"
                  stroke="#FFD9A8"
                  strokeWidth={6}
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray="0.08 1"
                  strokeDashoffset={-pulse}
                  style={{ filter: "drop-shadow(0 0 8px #F7941D)" }}
                />
              )}
            </g>
          );
        })}
      </svg>

      {TOOLS.map((tool, i) => {
        const x = interpolate(move, [0, 1], [tool.chaos.x, tool.hub.x - (CARD_W * 0.8) / 2]);
        const y = interpolate(move, [0, 1], [tool.chaos.y, tool.hub.y - (CARD_H * 0.8) / 2]);
        const done = interpolate(frame, [90 + i * 10, 104 + i * 10], [0, 1], clamp);
        return (
          <div
            key={tool.id}
            style={{
              position: "absolute",
              left: x,
              top: y,
              transformOrigin: "0 0",
              scale: String(scale),
              rotate: `${interpolate(move, [0, 1], [tool.chaos.r, 0])}deg`,
            }}
          >
            <ToolCard tool={tool} frame={frame + 600} badge={9} calm done={done} />
          </div>
        );
      })}

      {/* StayDesk in the middle */}
      <div
        style={{
          position: "absolute",
          left: HUB.x - 110,
          top: HUB.y - 110,
          width: 220,
          height: 220,
          borderRadius: 52,
          overflow: "hidden",
          boxShadow: `0 0 0 ${interpolate(frame % 50, [0, 50], [0, 30])}px rgba(247,148,29,${interpolate(frame % 50, [0, 50], [0.35, 0])}), 0 40px 120px -20px rgba(247,148,29,0.5)`,
          opacity: interpolate(frame, [30, 44], [0, 1], clamp),
          scale: interpolate(frame, [30, 56], [0.5, 1], { ...clamp, easing: Easing.bezier(0.34, 1.56, 0.64, 1) }),
        }}
      >
        <Img src={staticFile("shots/logo.png")} style={{ width: "100%", height: "100%" }} />
      </div>

      {/* the message */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 950,
          textAlign: "center",
          fontSize: 64,
          fontWeight: 600,
          letterSpacing: "-0.03em",
          opacity: interpolate(frame, [150, 170], [0, 1], clamp),
          translate: interpolate(frame, [150, 180], ["0px 20px", "0px 0px"], { ...clamp, easing: ease }),
        }}
      >
        All in one: <span style={{ color: C.accent }}>StayDesk</span>
      </div>
    </Scene>
  );
};
