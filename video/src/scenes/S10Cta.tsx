import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
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
            gap: 18,
            marginTop: 30,
            background: "#fff",
            border: `1px solid ${colors.line}`,
            borderRadius: 12,
            padding: 14,
            boxShadow: "0 18px 45px rgba(26,37,47,.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
            }}
          >
            <div
              style={{
                padding: 6,
                border: `1px solid ${colors.line}`,
                borderRadius: 8,
                background: "#fff",
              }}
            >
              <Img
                src={staticFile("images/github-qr.png")}
                style={{ width: 188, height: 188, display: "block" }}
              />
            </div>
            <div style={{ fontSize: 10, color: colors.muted }}>
              Scan untuk buka repo
            </div>
          </div>

          <div style={{ width: 420, textAlign: "left" }}>
            <div
              style={{
                fontSize: 11,
                letterSpacing: 2.4,
                fontWeight: 700,
                color: colors.red,
              }}
            >
              REPO GITHUB
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: colors.ink,
                marginTop: 2,
              }}
            >
              PENITIPAN-MOTOR
            </div>
            <div style={{ fontSize: 14, color: colors.muted, marginTop: 3 }}>
              github.com/malikabdlh/PENITIPAN-MOTOR
            </div>
            <div
              style={{
                fontSize: 12.5,
                color: colors.muted,
                marginTop: 9,
                lineHeight: 1.45,
              }}
            >
              Source code aplikasi dan video Remotion. Jalankan secara lokal
              sesuai panduan di README.
            </div>
            <div style={{ display: "flex", gap: 7, marginTop: 12 }}>
              <div
                style={{
                  background: colors.red,
                  color: "#fff",
                  borderRadius: 6,
                  padding: "8px 14px",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                Buka di GitHub
              </div>
              <div
                style={{
                  border: `1px solid ${colors.line}`,
                  borderRadius: 6,
                  padding: "8px 14px",
                  fontSize: 13,
                  fontWeight: 600,
                  color: colors.ink,
                }}
              >
                PHP · MySQL
              </div>
            </div>
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
