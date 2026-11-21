import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { FONT } from "../ui";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* The logo at the centre, fed by fine coloured lines from every edge of the screen,
   light running down each line into it; then it flies straight at the camera and is gone. */
const CX = 960;
const CY = 440;
const COLORS = ["#F7941D", "#F5C04A", "#4A8FE7", "#2EC4B6", "#8E6BD9", "#F7941D", "#6FA8FF"];
const FLY_AT = 175;

type Line = { d: string; color: string; delay: number; speed: number; phase: number; width: number };

const LINES: Line[] = Array.from({ length: 64 }, (_, i) => {
  // start points spread round the frame: left, right and bottom edges, a few from the top corners
  const side = i % 4;
  const r = random(`p${i}`);
  let sx: number;
  let sy: number;
  if (side === 0) {
    sx = -40;
    sy = 60 + r * 1000;
  } else if (side === 1) {
    sx = 1960;
    sy = 60 + r * 1000;
  } else if (side === 2) {
    sx = -100 + r * 2120;
    sy = 1120;
  } else {
    sx = r < 0.5 ? -40 + r * 600 : 1360 + r * 600;
    sy = -40;
  }
  // a gentle bow toward the centre
  const bend = (random(`b${i}`) - 0.5) * 260;
  const mx = (sx + CX) / 2 + bend;
  const my = (sy + CY) / 2 - Math.abs(bend) * 0.4;
  return {
    d: `M ${sx} ${sy} Q ${mx} ${my} ${CX} ${CY}`,
    color: COLORS[i % COLORS.length],
    delay: Math.floor(random(`d${i}`) * 24),
    speed: 34 + Math.floor(random(`s${i}`) * 30),
    phase: random(`f${i}`),
    width: 1 + random(`w${i}`) * 1.2,
  };
});

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const fly = interpolate(frame, [FLY_AT, FLY_AT + 45], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const charge = interpolate(frame, [20, 150], [0.35, 1], clamp); // the glow grows as current arrives
  const beat = 0.5 + 0.5 * Math.sin(frame / 5); // the halo breathes
  const linesOut = interpolate(fly, [0, 0.5], [1, 0], clamp);
  return (
    <AbsoluteFill
      style={{
        fontFamily: FONT,
        background: "radial-gradient(1400px 900px at 50% 40%, #173A6E 0%, #0E2A55 45%, #0A1C3C 100%)",
        opacity: interpolate(frame, [0, 10], [0, 1], clamp),
      }}
    >
      {/* the connectors and the current running down them */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: linesOut }}>
        {LINES.map((l, i) => {
          const draw = interpolate(frame, [l.delay, l.delay + 30], [1, 0], { ...clamp, easing: Easing.out(Easing.quad) });
          const run = ((frame - l.delay + l.phase * l.speed) % l.speed) / l.speed;
          return (
            <g key={i}>
              <path d={l.d} fill="none" stroke={l.color} strokeOpacity={0.55} strokeWidth={l.width} pathLength={1} strokeDasharray="1" strokeDashoffset={draw} />
              {frame > l.delay + 18 && (
                <path
                  d={l.d}
                  fill="none"
                  stroke={l.color}
                  strokeWidth={l.width + 2.5}
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray="0.012 1"
                  strokeDashoffset={-run}
                  style={{ filter: `drop-shadow(0 0 6px ${l.color})` }}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* the warm glow behind the logo */}
      <div
        style={{
          position: "absolute",
          left: CX - 380,
          top: CY - 380,
          width: 760,
          height: 760,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(250,200,80,0.8) 0%, rgba(247,160,40,0.35) 32%, rgba(247,148,29,0) 68%)",
          opacity: charge * (0.8 + 0.2 * beat) * interpolate(fly, [0, 0.6], [1, 0], clamp),
          scale: String(0.9 + 0.1 * beat),
        }}
      />

      {/* the logo with its gold ring; it flies at the camera at the end */}
      <div
        style={{
          position: "absolute",
          left: CX - 130,
          top: CY - 130,
          width: 260,
          height: 260,
          display: "grid",
          placeItems: "center",
          zIndex: 3,
          scale: String(
            interpolate(frame, [4, 30], [0.6, 1], { ...clamp, easing: Easing.bezier(0.34, 1.56, 0.64, 1) }) *
              interpolate(fly, [0, 1], [1, 14]),
          ),
          opacity: interpolate(frame, [4, 16], [0, 1], clamp) * interpolate(fly, [0.6, 1], [1, 0], clamp),
          filter: `blur(${interpolate(fly, [0.45, 1], [0, 16], clamp)}px)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "4px solid #F5C04A",
            boxShadow: `0 0 ${18 + 22 * beat * charge}px rgba(245,192,74,${0.5 + 0.4 * charge}), inset 0 0 18px rgba(245,192,74,0.35)`,
          }}
        />
        <Img
          src={staticFile("shots/logo.png")}
          style={{ width: 190, height: 190, borderRadius: 44, boxShadow: "0 18px 40px -10px rgba(0,0,0,0.6)" }}
        />
      </div>

      {/* the name and the line, under the logo */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: CY + 175,
          textAlign: "center",
          opacity: interpolate(frame, [18, 34], [0, 1], clamp) * interpolate(fly, [0, 0.3], [1, 0], clamp),
          translate: interpolate(frame, [18, 40], ["0px 24px", "0px 0px"], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) }),
        }}
      >
        <div style={{ fontSize: 132, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1 }}>
          <span style={{ color: "#FFFFFF" }}>Stay</span>
          <span style={{ color: "#F7A928" }}>Desk</span>
        </div>
        <div style={{ marginTop: 22, fontSize: 44, color: "#C9D4EA", letterSpacing: "-0.01em" }}>
          Your whole hotel, in one app.
        </div>
      </div>

      {/* a soft white flash as the logo passes the camera */}
      <AbsoluteFill
        style={{ background: "#FFF4E0", opacity: interpolate(fly, [0.8, 0.92, 1], [0, 0.35, 0], clamp), pointerEvents: "none" }}
      />
    </AbsoluteFill>
  );
};
