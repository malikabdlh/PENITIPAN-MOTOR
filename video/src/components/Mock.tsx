import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { colors, font } from "../theme";
import { clamp } from "../lib/motion";

export const StatCard: React.FC<{
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
  delay?: number;
  small?: boolean;
}> = ({ label, value, sub, accent = false, delay = 0, small = false }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame - delay, [0, 12], [0, 1], clamp);
  const lift = interpolate(frame - delay, [0, 18], [12, 0], clamp);
  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${colors.line}`,
        borderTop: accent ? `3px solid ${colors.red}` : `1px solid ${colors.line}`,
        borderRadius: 8,
        padding: small ? "10px 12px" : "12px 14px",
        opacity,
        transform: `translateY(${lift}px)`,
        minWidth: 0,
      }}
    >
      <div
        style={{
          fontSize: small ? 10 : 11,
          letterSpacing: 0.6,
          textTransform: "uppercase",
          color: colors.muted,
          fontWeight: 600,
          fontFamily: font,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: small ? 20 : 26,
          fontWeight: 800,
          color: colors.ink,
          marginTop: 4,
          fontFamily: font,
          fontVariantNumeric: "tabular-nums",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </div>
      {sub ? (
        <div style={{ fontSize: 10.5, color: colors.muted, fontFamily: font }}>
          {sub}
        </div>
      ) : null}
    </div>
  );
};

export const QrPattern: React.FC<{ seed: string; size?: number }> = ({
  seed,
  size = 150,
}) => {
  const n = 25;
  const cells: number[] = [];
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  const random = () => {
    h ^= h << 13;
    h >>>= 0;
    h ^= h >> 17;
    h ^= h << 5;
    h >>>= 0;
    return h;
  };
  for (let i = 0; i < n * n; i++) cells.push(random() & 1);
  const finder = (ox: number, oy: number) => {
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        const on =
          x === 0 || x === 6 || y === 0 || y === 6 ||
          (x >= 2 && x <= 4 && y >= 2 && y <= 4)
            ? 1
            : 0;
        cells[(oy + y) * n + (ox + x)] = on;
      }
    }
  };
  finder(0, 0);
  finder(n - 7, 0);
  finder(0, n - 7);
  const unit = size / n;
  return (
    <svg width={size} height={size} style={{ display: "block", background: "#fff" }}>
      {cells.map((on, i) =>
        on ? (
          <rect
            key={i}
            x={(i % n) * unit}
            y={Math.floor(i / n) * unit}
            width={unit + 0.2}
            height={unit + 0.2}
            fill={colors.ink}
          />
        ) : null
      )}
    </svg>
  );
};

export const TicketCard: React.FC<{
  ticket: string;
  nopol: string;
  slot: string;
  time?: string;
}> = ({ ticket, nopol, slot, time = "09:41" }) => (
  <div
    style={{
      width: 330,
      background: "#fff",
      border: `1px solid ${colors.line}`,
      borderLeft: `4px solid ${colors.red}`,
      borderRadius: 10,
      padding: "18px 20px",
      fontFamily: font,
      boxShadow: "0 16px 40px rgba(26,37,47,.14)",
    }}
  >
    <div style={{ fontSize: 11, letterSpacing: 1.4, color: colors.muted, fontWeight: 600 }}>
      TIKET PENITIPAN
    </div>
    <div
      style={{
        fontSize: 25,
        fontWeight: 800,
        letterSpacing: 1.6,
        color: colors.ink,
        margin: "6px 0 2px",
      }}
    >
      {ticket}
    </div>
    <div style={{ fontSize: 12.5, color: colors.muted }}>{nopol}</div>
    <div
      style={{
        borderTop: `1px dashed ${colors.line}`,
        margin: "12px 0",
      }}
    />
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
      <span style={{ color: colors.muted }}>Slot</span>
      <b>{slot}</b>
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginTop: 4 }}>
      <span style={{ color: colors.muted }}>Masuk</span>
      <b>{time}</b>
    </div>
    <div
      style={{
        marginTop: 12,
        background: colors.greenSoft,
        color: colors.green,
        borderRadius: 6,
        padding: "6px 10px",
        fontSize: 11.5,
        fontWeight: 700,
        textAlign: "center",
      }}
    >
      TERCATAT
    </div>
  </div>
);

export const Receipt: React.FC<{
  ticket: string;
  nopol: string;
  total: string;
  duration: string;
}> = ({ ticket, nopol, total, duration }) => (
  <div
    style={{
      width: 300,
      background: "#fff",
      border: `1px solid ${colors.line}`,
      borderRadius: 8,
      padding: "18px 18px 16px",
      fontFamily: font,
      boxShadow: "0 20px 50px rgba(26,37,47,.18)",
      position: "relative",
    }}
  >
    <div style={{ textAlign: "center", fontSize: 15, fontWeight: 800, letterSpacing: 0.5 }}>
      MOTOR PARK
    </div>
    <div style={{ textAlign: "center", fontSize: 10.5, color: colors.muted, marginBottom: 10 }}>
      Bukti penitipan motor
    </div>
    <div style={{ borderTop: `1px dashed ${colors.line}`, paddingTop: 10, fontSize: 11.5 }}>
      <Row label="Tiket" value={ticket} />
      <Row label="Nopol" value={nopol} />
      <Row label="Durasi" value={duration} />
      <Row label="Metode" value="QRIS (simulasi)" />
    </div>
    <div style={{ borderTop: `1px dashed ${colors.line}`, marginTop: 10, paddingTop: 10 }}>
      <Row label="Total" value={total} bold />
    </div>
    <div
      style={{
        position: "absolute",
        right: -18,
        top: 84,
        border: `2px solid ${colors.green}`,
        color: colors.green,
        borderRadius: 4,
        padding: "2px 8px",
        fontSize: 10,
        fontWeight: 800,
        transform: "rotate(-9deg)",
        letterSpacing: 1,
        background: "#fff",
        boxShadow: "0 4px 12px rgba(30,132,73,.12)",
      }}
    >
      LUNAS
    </div>
    <div style={{ textAlign: "center", fontSize: 9.5, color: colors.muted, marginTop: 12 }}>
      Terima kasih. Simpan struk ini sebagai bukti.
    </div>
  </div>
);

const Row: React.FC<{ label: string; value: string; bold?: boolean }> = ({
  label,
  value,
  bold,
}) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      gap: 12,
      marginBottom: 5,
      fontSize: bold ? 13.5 : 11.5,
      fontWeight: bold ? 800 : 400,
    }}
  >
    <span style={{ color: colors.muted }}>{label}</span>
    <span style={{ color: colors.ink, textAlign: "right" }}>{value}</span>
  </div>
);

export const Field: React.FC<{
  label: string;
  value: string;
  focus?: boolean;
  width?: number | string;
}> = ({ label, value, focus = false, width = "100%" }) => (
  <div style={{ width, fontFamily: font }}>
    <div style={{ fontSize: 10.5, fontWeight: 700, marginBottom: 4 }}>{label}</div>
    <div
      style={{
        border: `1px solid ${focus ? colors.red : "#D5DADF"}`,
        boxShadow: focus ? `0 0 0 2px ${colors.redSoft}` : "none",
        borderRadius: 6,
        background: "#fff",
        padding: "7px 9px",
        fontSize: 12,
        color: value ? colors.ink : "#AEB6BF",
        minHeight: 31,
        whiteSpace: "nowrap",
        overflow: "hidden",
      }}
    >
      {value || " "}
    </div>
  </div>
);

export const SlotCell: React.FC<{
  code: string;
  occupied: boolean;
  highlight?: number;
}> = ({ code, occupied, highlight = 1 }) => {
  const frame = useCurrentFrame();
  const pulse = interpolate(frame % 40, [0, 20, 40], [1, 1.06, 1]);
  return (
    <div
      style={{
        border: `1px solid ${occupied ? "#F0C9C4" : "#A9DFBF"}`,
        background: occupied ? colors.redSoft : "#fff",
        color: occupied ? colors.redDark : colors.green,
        borderRadius: 7,
        padding: "8px 6px",
        textAlign: "center",
        fontFamily: font,
        transform: `scale(${highlight > 1 ? pulse * 1.02 : 1})`,
        opacity: highlight,
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 12.5 }}>{code}</div>
      <div style={{ fontSize: 9, color: occupied ? colors.redDark : colors.muted }}>
        {occupied ? "terisi" : "tersedia"}
      </div>
    </div>
  );
};

export const Dots: React.FC<{ n?: number }> = ({ n = 8 }) => (
  <div style={{ display: "flex", gap: 4, alignItems: "center", height: 31 }}>
    {Array.from({ length: n }).map((_, i) => (
      <span
        key={i}
        style={{
          width: 6,
          height: 6,
          borderRadius: 99,
          background: colors.ink,
          opacity: 0.65,
          display: "inline-block",
        }}
      />
    ))}
  </div>
);
