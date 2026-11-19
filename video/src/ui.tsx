import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/* Brand tokens (the website's palette: navy ink, orange accent) */
export const C = {
  bg: "#081226",
  bg2: "#0E2340",
  ink: "#FFFFFF",
  muted: "#A9B4CC",
  accent: "#F7941D",
  line: "rgba(255,255,255,0.12)",
};

export const FONT = "Geist, system-ui, sans-serif";

const fontCss = `@font-face{font-family:Geist;src:url(${staticFile(
  "fonts/Geist-Variable.woff2",
)}) format("woff2");font-weight:100 900;font-display:block;}`;

export const Fonts: React.FC = () => <style>{fontCss}</style>;

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* Calm navy backdrop with a slow light drift; shared by every body scene */
export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(1200px 800px at ${interpolate(frame, [0, 2400], [20, 40])}% 0%, #1A3566 0%, rgba(26,53,102,0) 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(900px 600px at ${interpolate(frame, [0, 2400], [95, 75])}% 110%, rgba(247,148,29,0.16) 0%, rgba(247,148,29,0) 70%)`,
        }}
      />
    </AbsoluteFill>
  );
};

/* Scene wrapper: fades the scene in and out over the shared backdrop */
export const Scene: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill
      style={{
        fontFamily: FONT,
        color: C.ink,
        opacity: interpolate(
          frame,
          [0, 10, durationInFrames - 10, durationInFrames],
          [0, 1, 1, 0],
          clamp,
        ),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/* Kicker + headline at the top-left of a feature scene */
export const Heading: React.FC<{ kicker: string; title: string }> = ({
  kicker,
  title,
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 160, top: 88, right: 160 }}>
      <div
        style={{
          fontSize: 30,
          fontWeight: 500,
          color: C.accent,
          letterSpacing: "0.01em",
          opacity: interpolate(frame, [4, 20], [0, 1], clamp),
          translate: interpolate(frame, [4, 24], ["0px 16px", "0px 0px"], {
            ...clamp,
            easing: ease,
          }),
        }}
      >
        {kicker}
      </div>
      <div
        style={{
          marginTop: 14,
          fontSize: 76,
          fontWeight: 600,
          letterSpacing: "-0.035em",
          lineHeight: 1.02,
          opacity: interpolate(frame, [8, 26], [0, 1], clamp),
          translate: interpolate(frame, [8, 32], ["0px 24px", "0px 0px"], {
            ...clamp,
            easing: ease,
          }),
        }}
      >
        {title}
      </div>
    </div>
  );
};

/* A real app screen in a rounded window that rises in, then pushes in slowly toward a focus point */
export const Screen: React.FC<{
  src: string;
  focus?: [number, number];
  zoom?: number;
  from?: number;
  dim?: number;
  top?: number;
  width?: number;
  rise?: boolean;
}> = ({ src, focus = [50, 30], zoom = 1.12, from = 6, dim = 0, top = 300, width = 1600, rise = true }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const height = (width * 810) / 1440;
  return (
    <div
      style={{
        position: "absolute",
        left: (1920 - width) / 2,
        top,
        width,
        height,
        borderRadius: 24,
        overflow: "hidden",
        border: `1px solid ${C.line}`,
        boxShadow: "0 60px 120px -40px rgba(0,0,0,0.7)",
        opacity: interpolate(frame, [from, from + 14], [0, 1], clamp),
        translate: rise
          ? interpolate(frame, [from, from + 30], ["0px 80px", "0px 0px"], { ...clamp, easing: ease })
          : "0px 0px",
      }}
    >
      <Img
        src={staticFile(`shots/${src}`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "top",
          transformOrigin: `${focus[0]}% ${focus[1]}%`,
          scale: interpolate(frame, [from, durationInFrames], [1, zoom], {
            ...clamp,
            easing: Easing.inOut(Easing.quad),
          }),
          filter: dim ? `brightness(${1 - dim}) blur(${dim * 6}px)` : undefined,
        }}
      />
      {/* the window runs past the frame's bottom: a soft fade into the backdrop */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 220,
          background: `linear-gradient(rgba(8,18,38,0), ${C.bg})`,
        }}
      />
    </div>
  );
};

/* A modal or card taken from the app, floating over the screen */
export const Card: React.FC<{
  src: string;
  width: number;
  left: number;
  top: number;
  from: number;
}> = ({ src, width, left, top, from }) => {
  const frame = useCurrentFrame();
  return (
    <Img
      src={staticFile(`shots/${src}`)}
      style={{
        position: "absolute",
        left,
        top,
        width,
        borderRadius: 18,
        boxShadow: "0 50px 100px -30px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.08)",
        opacity: interpolate(frame, [from, from + 12], [0, 1], clamp),
        translate: interpolate(frame, [from, from + 28], ["0px 60px", "0px 0px"], {
          ...clamp,
          easing: ease,
        }),
        scale: interpolate(frame, [from, from + 28], [0.96, 1], { ...clamp, easing: ease }),
      }}
    />
  );
};

/* An orange-dot label pinned over the window, in sync with the voice */
export const Callout: React.FC<{ text: string; x: number; y: number; from: number }> = ({
  text,
  x,
  y,
  from,
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "16px 26px",
        borderRadius: 999,
        background: "rgba(8,18,38,0.92)",
        border: `1px solid rgba(247,148,29,0.55)`,
        boxShadow: "0 24px 48px -16px rgba(0,0,0,0.6)",
        fontSize: 34,
        fontWeight: 500,
        letterSpacing: "-0.01em",
        whiteSpace: "nowrap",
        opacity: interpolate(frame, [from, from + 10], [0, 1], clamp),
        scale: interpolate(frame, [from, from + 18], [0.9, 1], { ...clamp, easing: ease }),
      }}
    >
      <span
        style={{
          width: 14,
          height: 14,
          borderRadius: 999,
          background: C.accent,
          boxShadow: `0 0 0 ${interpolate((frame - from) % 48, [0, 48], [0, 14], clamp)}px rgba(247,148,29,${interpolate((frame - from) % 48, [0, 48], [0.5, 0], clamp)})`,
        }}
      />
      {text}
    </div>
  );
};
