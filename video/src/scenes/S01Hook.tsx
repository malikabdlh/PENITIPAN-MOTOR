import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { colors, font } from "../theme";
import { clamp, useEnter, usePop } from "../lib/motion";
import { SceneShell, Kicker } from "../components/SceneShell";

const PaperTicket: React.FC<{
  style?: React.CSSProperties;
  manual?: boolean;
}> = ({ style, manual = true }) => (
  <div
    style={{
      width: 380,
      height: 240,
      background: "#F7F2E8",
      borderRadius: 6,
      padding: "22px 24px",
      fontFamily: font,
      color: "#3A3A3A",
      boxShadow: "0 20px 50px rgba(0,0,0,.28)",
      position: "relative",
      overflow: "hidden",
      ...style,
    }}
  >
    <div style={{ fontSize: 11, letterSpacing: 2.6, color: "#8A8175" }}>
      TIKET PARKIR
    </div>
    <div style={{ fontSize: 30, fontWeight: 800, marginTop: 8 }}>
      B 1234 ABC
    </div>
    <div style={{ fontSize: 12, color: "#8A8175", marginTop: 2 }}>
      MOTOR · HITAM
    </div>
    <div
      style={{
        borderTop: "1px dashed #C9BFAE",
        margin: "18px 0 12px",
      }}
    />
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
      <span>Masuk 09.41</span>
      <span>Slot A01</span>
      <span>Rp 3.000</span>
    </div>
    <div
      style={{
        position: "absolute",
        right: 20,
        bottom: 34,
        display: "flex",
        gap: 2,
        alignItems: "flex-end",
        height: 34,
        opacity: 0.55,
      }}
    >
      {[14, 26, 10, 32, 18, 24, 8, 30, 16, 22, 12, 28].map((h, i) => (
        <span key={i} style={{ width: 3, height: h, background: "#3A3A3A" }} />
      ))}
    </div>
    {manual ? (
      <div
        style={{
          position: "absolute",
          right: 26,
          top: 22,
          border: "2px solid #B03A2E",
          color: "#B03A2E",
          padding: "2px 9px",
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: 1.5,
          transform: "rotate(8deg)",
          opacity: 0.85,
        }}
      >
        MANUAL
      </div>
    ) : null}
  </div>
);

export const S01Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const h1 = useEnter(4, 30);
  const h2 = useEnter(11, 30);
  const h3 = useEnter(18, 30);
  const note = useEnter(36, 16);
  const ticket = usePop(10, 0.86);
  const underline = interpolate(frame, [30, 52], [0, 300], clamp);
  const float = Math.sin(frame / 24) * 7;

  return (
    <SceneShell duration={120} background={colors.inkDark}>
      <div
        style={{
          position: "absolute",
          width: 720,
          height: 720,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(192,57,43,.16), transparent 65%)",
          right: 80,
          top: 180,
        }}
      />
      <div style={{ position: "absolute", left: 140, top: 258, width: 900 }}>
        <Kicker light>Penitipan motor</Kicker>
        <div
          style={{
            fontSize: 88,
            lineHeight: 1.03,
            fontWeight: 800,
            color: "#fff",
            marginTop: 20,
            letterSpacing: -1.5,
          }}
        >
          <div style={h1}>Parkir motor</div>
          <div style={h2}>masih pakai</div>
          <div style={{ ...h3, color: colors.red }}>tiket kertas?</div>
        </div>
        <div
          style={{
            width: underline,
            height: 5,
            background: colors.red,
            borderRadius: 4,
            marginTop: 26,
          }}
        />
        <div
          style={{
            ...note,
            marginTop: 22,
            fontSize: 24,
            color: "rgba(255,255,255,.62)",
          }}
        >
          Saatnya pencatatan yang lebih rapi.
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: 150,
          top: 330,
          transform: `translateY(${float}px)`,
        }}
      >
        <PaperTicket
          style={{
            position: "absolute",
            transform: "rotate(10deg) translate(30px, 28px)",
            opacity: 0.28,
          }}
          manual={false}
        />
        <PaperTicket
          style={{
            position: "absolute",
            transform: "rotate(-5deg) translate(-18px, 12px)",
            opacity: 0.5,
          }}
          manual={false}
        />
        <div style={{ ...ticket, position: "relative" }}>
          <PaperTicket style={{ transform: "rotate(-2deg)" }} />
        </div>
      </div>
    </SceneShell>
  );
};
