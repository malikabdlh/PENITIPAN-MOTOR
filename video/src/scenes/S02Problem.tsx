import React from "react";
import { useCurrentFrame } from "remotion";
import { colors } from "../theme";
import { useEnter, useSlide } from "../lib/motion";
import { SceneShell, Kicker } from "../components/SceneShell";

const problems = [
  {
    no: "01",
    title: "Tiket kertas hilang",
    text: "Bukti penitipan mudah rusak, basah, atau tertukar.",
  },
  {
    no: "02",
    title: "Biaya salah hitung",
    text: "Durasi dan tarif dihitung manual, rawan selisih.",
  },
  {
    no: "03",
    title: "Slot tidak terkontrol",
    text: "Petugas tidak tahu pasti slot mana yang masih kosong.",
  },
  {
    no: "04",
    title: "Laporan berantakan",
    text: "Pendapatan harian dan bulanan sulit direkap.",
  },
];

export const S02Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const heading = useEnter(4, 24);
  const sub = useEnter(12, 18);
  const cardStyles = [
    useSlide(18, 0, 26),
    useSlide(27, 0, 26),
    useSlide(36, 0, 26),
    useSlide(45, 0, 26),
  ];

  return (
    <SceneShell duration={270} background={colors.inkDark}>
      <div style={{ position: "absolute", left: 140, top: 118 }}>
        <Kicker light>Masalahnya</Kicker>
        <div
          style={{
            ...heading,
            fontSize: 60,
            lineHeight: 1.12,
            fontWeight: 800,
            color: "#fff",
            marginTop: 14,
            letterSpacing: -1,
          }}
        >
          Kalau masih manual,
          <br />
          <span style={{ color: colors.red }}>ini yang sering terjadi.</span>
        </div>
        <div
          style={{
            ...sub,
            marginTop: 14,
            fontSize: 22,
            color: "rgba(255,255,255,.5)",
          }}
        >
          Kecil, tapi cukup mengganggu operasional setiap hari.
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 140,
          right: 140,
          top: 390,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
        }}
      >
        {problems.map((item, index) => {
          const style = cardStyles[index];
          return (
            <div
              key={item.no}
              style={{
                ...style,
                background: "rgba(255,255,255,.045)",
                border: "1px solid rgba(255,255,255,.1)",
                borderRadius: 10,
                padding: "24px 26px",
                display: "flex",
                gap: 20,
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  fontSize: 34,
                  fontWeight: 800,
                  color: colors.red,
                  lineHeight: 1,
                  minWidth: 56,
                  opacity: 0.9,
                }}
              >
                {item.no}
              </div>
              <div>
                <div style={{ fontSize: 27, fontWeight: 700, color: "#fff" }}>
                  {item.title}
                </div>
                <div
                  style={{
                    fontSize: 18,
                    color: "rgba(255,255,255,.55)",
                    marginTop: 5,
                    lineHeight: 1.4,
                  }}
                >
                  {item.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          left: 140,
          bottom: 76,
          fontSize: 20,
          color: "rgba(255,255,255,.42)",
          letterSpacing: 0.2,
          opacity: frame > 95 ? 1 : 0,
          transition: "opacity .3s",
        }}
      >
        Ada cara yang lebih rapi. <span style={{ color: "#fff" }}>→</span>
      </div>
    </SceneShell>
  );
};
