import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { colors, font } from "../theme";
import { clamp, useEnter, usePop } from "../lib/motion";
import { SceneShell, Kicker } from "../components/SceneShell";
import { Logo, Badge } from "../components/ui";

const SkeletonWindow: React.FC = () => (
  <div
    style={{
      width: 1180,
      height: 640,
      background: "#fff",
      borderRadius: 18,
      border: `1px solid ${colors.line}`,
      boxShadow: "0 30px 80px rgba(26,37,47,.1)",
      overflow: "hidden",
      opacity: 0.58,
    }}
  >
    <div
      style={{
        height: 40,
        borderBottom: `1px solid ${colors.line}`,
        background: "#F7F8F9",
        display: "flex",
        alignItems: "center",
        gap: 7,
        paddingLeft: 16,
      }}
    >
      <span style={{ width: 9, height: 9, borderRadius: 99, background: "#E5A6A0" }} />
      <span style={{ width: 9, height: 9, borderRadius: 99, background: "#E8D19B" }} />
      <span style={{ width: 9, height: 9, borderRadius: 99, background: "#A9D3B4" }} />
    </div>
    <div style={{ display: "flex", height: "calc(100% - 40px)" }}>
      <div
        style={{
          width: 210,
          borderRight: `1px solid ${colors.line}`,
          padding: "18px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {[64, 92, 112, 84, 98, 76, 104, 88].map((w, i) => (
          <div
            key={i}
            style={{
              height: 12,
              width: w,
              borderRadius: 4,
              background: i === 0 ? colors.redSoft : "#EEF1F3",
            }}
          />
        ))}
      </div>
      <div style={{ flex: 1, padding: 24 }}>
        <div style={{ width: 190, height: 16, background: "#EEF1F3", borderRadius: 4 }} />
        <div style={{ display: "flex", gap: 12, marginTop: 22 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 74,
                border: `1px solid ${colors.line}`,
                borderRadius: 8,
              }}
            />
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
          <div
            style={{
              flex: 1,
              height: 210,
              border: `1px solid ${colors.line}`,
              borderRadius: 8,
            }}
          />
          <div
            style={{
              flex: 1,
              height: 210,
              border: `1px solid ${colors.line}`,
              borderRadius: 8,
            }}
          />
        </div>
      </div>
    </div>
  </div>
);

export const S03Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const logo = usePop(8, 0.9);
  const tagline = useEnter(24, 18);
  const line = interpolate(frame, [20, 40], [0, 220], clamp);
  const chips = [
    "Data rapi",
    "Biaya akurat",
    "Slot terkontrol",
  ];
  const chipStyles = [
    useEnter(34, 12),
    useEnter(42, 12),
    useEnter(50, 12),
  ];
  const footer = useEnter(58, 10);

  return (
    <SceneShell duration={210} background={colors.bg} grid>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <SkeletonWindow />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(244,245,246,.74)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <div style={{ ...logo }}>
          <Logo size={74} />
        </div>
        <div
          style={{
            width: line,
            height: 4,
            background: colors.red,
            borderRadius: 3,
            marginTop: 26,
          }}
        />
        <div
          style={{
            ...tagline,
            marginTop: 22,
            fontSize: 30,
            color: colors.muted,
            letterSpacing: 0.2,
          }}
        >
          Sistem penitipan motor yang rapi, cepat, dan akurat.
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 30 }}>
          {chips.map((chip, index) => {
            const style = chipStyles[index];
            return (
              <div key={chip} style={style}>
                <Badge tone={index === 0 ? "red" : "grey"} size={15}>
                  {chip}
                </Badge>
              </div>
            );
          })}
        </div>
        <div
          style={{
            ...footer,
            marginTop: 46,
            fontSize: 15,
            color: colors.muted,
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          HTML · CSS · PHP · MySQL
        </div>
      </div>
    </SceneShell>
  );
};
