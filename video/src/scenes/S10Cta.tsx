import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { colors } from "../theme";
import { Logo, Badge } from "../components/ui";
import { clamp, useEnter, usePop } from "../lib/motion";
import { SceneShell } from "../components/SceneShell";

const benefits = ["Tiket otomatis", "Biaya akurat", "Laporan rapi"];

export const S10Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const logo = usePop(4, 0.9);
  const headline = useEnter(12, 22);
  const sub = useEnter(22, 16);
  const cta = useEnter(34, 16);
  const footer = useEnter(46, 12);
  const chipStyles = [useEnter(34, 10), useEnter(40, 10), useEnter(46, 10)];
  const endOpacity = interpolate(frame, [236, 252], [0, 1], clamp);

  return (
    <SceneShell duration={255} background={colors.bg} grid>
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
        <div style={logo}>
          <Logo size={58} />
        </div>
        <div
          style={{
            ...headline,
            fontSize: 78,
            fontWeight: 800,
            letterSpacing: -1.5,
            color: colors.ink,
            marginTop: 34,
            lineHeight: 1.05,
          }}
        >
          Titip motor, tenang.
        </div>
        <div
          style={{
            ...sub,
            fontSize: 24,
            color: colors.muted,
            marginTop: 14,
            maxWidth: 780,
          }}
        >
          Satu sistem untuk mencatat, menghitung, dan melaporkan
          semua titipan motor.
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 34 }}>
          {benefits.map((b, index) => (
            <div key={b} style={chipStyles[index]}>
              <Badge tone={index === 1 ? "red" : "grey"} size={15}>
                {b}
              </Badge>
            </div>
          ))}
        </div>

        <div
          style={{
            ...cta,
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 38,
          }}
        >
          <div
            style={{
              background: "#fff",
              border: `1px solid ${colors.line}`,
              borderRadius: 7,
              padding: "11px 16px",
              fontSize: 16,
              color: colors.ink,
            }}
          >
            localhost/pkk alik
          </div>
          <div
            style={{
              background: colors.red,
              color: "#fff",
              borderRadius: 7,
              padding: "12px 22px",
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            Coba demo
          </div>
        </div>

        <div
          style={{
            ...footer,
            marginTop: 46,
            fontSize: 14,
            color: colors.muted,
            letterSpacing: 1.5,
            textTransform: "uppercase",
          }}
        >
          Dibuat dengan PHP · MySQL · Chart.js
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: colors.inkDark,
          opacity: endOpacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Logo size={54} light />
        <div
          style={{
            fontSize: 19,
            color: "rgba(255,255,255,.5)",
            marginTop: 26,
            letterSpacing: 0.5,
          }}
        >
          Terima kasih.
        </div>
        <div
          style={{
            display: "block",
            width: 52,
            height: 4,
            background: colors.red,
            borderRadius: 3,
            marginTop: 18,
          }}
        />
      </div>
    </SceneShell>
  );
};
