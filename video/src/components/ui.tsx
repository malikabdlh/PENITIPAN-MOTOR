import React from "react";
import { colors, font } from "../theme";

export const Logo: React.FC<{
  size?: number;
  light?: boolean;
  compact?: boolean;
}> = ({ size = 34, light = false, compact = false }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.34 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.24,
          background: colors.red,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 800,
          fontSize: size * 0.58,
          letterSpacing: -0.5,
          flex: "none",
        }}
      >
        M
      </div>
      <div style={{ lineHeight: 1.05 }}>
        <div
          style={{
            fontWeight: 800,
            fontSize: size * 0.72,
            letterSpacing: 0.6,
            color: light ? "#fff" : colors.ink,
            fontFamily: font,
          }}
        >
          MOTOR PARK
        </div>
        {!compact ? (
          <div
            style={{
              fontSize: Math.max(10, size * 0.27),
              color: light ? "rgba(255,255,255,.62)" : colors.muted,
              letterSpacing: 0.4,
              marginTop: 2,
              fontFamily: font,
            }}
          >
            Sistem Penitipan Motor
          </div>
        ) : null}
      </div>
    </div>
  );
};

export const Badge: React.FC<{
  children: React.ReactNode;
  tone?: "red" | "green" | "grey" | "dark" | "amber";
  size?: number;
}> = ({ children, tone = "grey", size = 13 }) => {
  const tones: Record<string, { bg: string; fg: string }> = {
    red: { bg: colors.redSoft, fg: colors.redDark },
    green: { bg: colors.greenSoft, fg: colors.green },
    grey: { bg: "#EEF1F3", fg: "#5D6D7E" },
    dark: { bg: colors.ink, fg: "#fff" },
    amber: { bg: colors.amberSoft, fg: colors.amber },
  };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        background: tones[tone].bg,
        color: tones[tone].fg,
        borderRadius: 99,
        padding: `${size * 0.28}px ${size * 0.75}px`,
        fontSize: size,
        fontWeight: 600,
        fontFamily: font,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
};

export const Btn: React.FC<{
  children: React.ReactNode;
  primary?: boolean;
  small?: boolean;
  outline?: boolean;
}> = ({ children, primary = false, small = false, outline = false }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      background: primary ? colors.red : outline ? "#fff" : colors.ink,
      color: primary ? "#fff" : outline ? colors.ink : "#fff",
      border: outline ? `1px solid ${colors.line}` : "1px solid transparent",
      padding: small ? "6px 12px" : "10px 18px",
      borderRadius: 7,
      fontSize: small ? 12.5 : 14,
      fontWeight: 600,
      fontFamily: font,
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </span>
);

export const Panel: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      background: "#fff",
      border: `1px solid ${colors.line}`,
      borderRadius: 10,
      padding: 14,
      fontFamily: font,
      ...style,
    }}
  >
    {children}
  </div>
);

export const SectionLabel: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div
    style={{
      fontSize: 22,
      fontWeight: 700,
      color: colors.ink,
      fontFamily: font,
      marginBottom: 10,
    }}
  >
    {children}
  </div>
);
