import React from "react";
import { C } from "./ui";

/* The five tools a hotel juggles today. `chaos` is where each sits in the messy opening,
   `hub` where it lands around StayDesk once the lines connect it. `at` is when it appears (frames). */
export type Tool = {
  id: string;
  title: string;
  chaos: { x: number; y: number; r: number };
  hub: { x: number; y: number };
  at: number;
};

export const TOOLS: Tool[] = [
  { id: "pms", title: "Reservation screen", chaos: { x: 230, y: 250, r: -4 }, hub: { x: 470, y: 300 }, at: 45 },
  { id: "chat", title: "Group chat", chaos: { x: 1250, y: 190, r: 5 }, hub: { x: 1450, y: 300 }, at: 120 },
  { id: "paper", title: "Printed room list", chaos: { x: 690, y: 520, r: -7 }, hub: { x: 360, y: 700 }, at: 195 },
  { id: "notebook", title: "Repair notebook", chaos: { x: 140, y: 640, r: 6 }, hub: { x: 1560, y: 700 }, at: 245 },
  { id: "phone", title: "Front desk phone", chaos: { x: 1330, y: 590, r: -3 }, hub: { x: 960, y: 840 }, at: 290 },
];

export const CARD_W = 400;
export const CARD_H = 250;

const row = (w: string, c = "#C9D2E3") => (
  <div style={{ height: 12, width: w, borderRadius: 6, background: c }} />
);

/* What each tool looks like: drawn in HTML, small and readable */
export const ToolBody: React.FC<{ id: string; frame: number; calm?: boolean }> = ({ id, frame, calm }) => {
  if (id === "pms")
    return (
      <div style={{ display: "grid", gap: 12, padding: 22 }}>
        {[["214", "Checked out"], ["305", "Arrives 3:00"], ["412", "In house"], ["118", "Due out"]].map(([r, s]) => (
          <div key={r} style={{ display: "flex", gap: 16, fontSize: 22, color: "#1F2B4D" }}>
            <b style={{ width: 54 }}>{r}</b>
            <span style={{ color: "#5B6785" }}>{s}</span>
          </div>
        ))}
      </div>
    );
  if (id === "chat")
    return (
      <div style={{ display: "grid", gap: 10, padding: 18 }}>
        {["Who has 214??", "Is 305 ready?", "Need towels 412", "214 ???"].map((m, i) => (
          <div
            key={m}
            style={{
              justifySelf: i % 2 ? "end" : "start",
              padding: "8px 14px",
              borderRadius: 16,
              fontSize: 21,
              background: i % 2 ? "#DCF8C6" : "#FFFFFF",
              color: "#1F2B4D",
              opacity: calm ? 1 : frame > 130 + i * 18 ? 1 : 0,
            }}
          >
            {m}
          </div>
        ))}
      </div>
    );
  if (id === "paper")
    return (
      <div style={{ display: "grid", gap: 12, padding: "22px 26px", fontFamily: "Georgia, serif", color: "#3A3A3A" }}>
        <div style={{ fontSize: 22 }}>Rooms to clean · Tue</div>
        {["202", "214", "305", "318"].map((r, i) => (
          <div key={r} style={{ display: "flex", gap: 14, fontSize: 21, alignItems: "center" }}>
            <span style={{ textDecoration: i === 1 ? "line-through" : "none" }}>Room {r}</span>
            {i === 1 && <span style={{ color: "#C0392B", fontSize: 18 }}>moved?</span>}
          </div>
        ))}
      </div>
    );
  if (id === "notebook")
    return (
      <div
        style={{
          height: "100%",
          padding: "20px 26px",
          backgroundImage: "repeating-linear-gradient(#FFF6C8 0 34px, #E8D99A 34px 35px)",
          fontFamily: "'Comic Sans MS', 'Marker Felt', cursive",
          color: "#2B3A67",
          fontSize: 23,
          display: "grid",
          alignContent: "start",
          gap: 4,
        }}
      >
        <div>A/C 420 — again</div>
        <div>Leak 219, call Mike</div>
        <div style={{ color: "#C0392B" }}>724 lights??</div>
      </div>
    );
  // phone: an incoming call that keeps ringing
  const ring = calm ? 0 : Math.sin(frame / 1.6) * (frame % 40 < 22 ? 3 : 0);
  return (
    <div style={{ display: "grid", placeItems: "center", gap: 10, padding: 20, translate: `${ring}px 0px` }}>
      <div style={{ fontSize: 22, color: "#5B6785" }}>Incoming call</div>
      <div style={{ fontSize: 34, fontWeight: 600, color: "#1F2B4D" }}>Room 412</div>
      <div style={{ display: "flex", gap: 10 }}>
        <span style={{ padding: "6px 16px", borderRadius: 999, background: "#E74C3C", color: "#fff", fontSize: 20 }}>3 on hold</span>
        <span style={{ padding: "6px 16px", borderRadius: 999, background: "#EEF1F6", color: "#1F2B4D", fontSize: 20 }}>2 missed</span>
      </div>
      {row("60%", "#E3E8F0")}
    </div>
  );
};

/* the card frame: a title bar with an unread badge, the body under it */
export const ToolCard: React.FC<{ tool: Tool; frame: number; badge: number; calm?: boolean; done?: number }> = ({
  tool,
  frame,
  badge,
  calm,
  done = 0,
}) => (
  <div
    style={{
      width: CARD_W,
      height: CARD_H,
      borderRadius: 22,
      overflow: "hidden",
      background: tool.id === "paper" ? "#FBFAF6" : tool.id === "chat" ? "#ECE5DD" : "#FFFFFF",
      boxShadow: "0 30px 70px -24px rgba(0,0,0,0.75)",
      border: "1px solid rgba(255,255,255,0.2)",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 18px",
        background: "#1F2B4D",
        color: "#fff",
        fontSize: 21,
        fontWeight: 500,
      }}
    >
      {tool.title}
      <span style={{ marginLeft: "auto", position: "relative", minWidth: 34, height: 34 }}>
        {badge > 0 && done < 0.5 && (
          <span
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              borderRadius: 999,
              background: "#E74C3C",
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            {badge}
          </span>
        )}
        {done > 0 && (
          <span
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              borderRadius: 999,
              background: "#2FA36B",
              fontSize: 20,
              opacity: done,
              scale: String(0.6 + 0.4 * done),
            }}
          >
            ✓
          </span>
        )}
      </span>
    </div>
    <div style={{ flex: 1, minHeight: 0, color: C.bg }}>
      <ToolBody id={tool.id} frame={frame} calm={calm} />
    </div>
  </div>
);
