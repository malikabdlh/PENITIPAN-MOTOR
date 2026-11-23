import React from "react";
import { colors, font } from "../theme";
import { Logo } from "./ui";

export const BrowserFrame: React.FC<{
  url: string;
  children: React.ReactNode;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}> = ({ url, children, width = 1280, height = 750, style }) => {
  return (
    <div
      style={{
        width,
        height,
        background: "#fff",
        borderRadius: 18,
        border: `1px solid ${colors.line}`,
        boxShadow: "0 24px 70px rgba(26,37,47,.16)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        fontFamily: font,
        ...style,
      }}
    >
      <div
        style={{
          height: 44,
          background: "#F7F8F9",
          borderBottom: `1px solid ${colors.line}`,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 16px",
          flex: "none",
        }}
      >
        <span style={{ width: 10, height: 10, borderRadius: 99, background: "#E5A6A0" }} />
        <span style={{ width: 10, height: 10, borderRadius: 99, background: "#E8D19B" }} />
        <span style={{ width: 10, height: 10, borderRadius: 99, background: "#A9D3B4" }} />
        <div
          style={{
            marginLeft: 12,
            background: "#fff",
            border: `1px solid ${colors.line}`,
            borderRadius: 6,
            padding: "5px 12px",
            fontSize: 12.5,
            color: colors.muted,
            minWidth: 320,
          }}
        >
          {url}
        </div>
      </div>
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>{children}</div>
    </div>
  );
};

export const AppShell: React.FC<{
  url: string;
  active: string;
  children: React.ReactNode;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}> = ({ url, active, children, width = 1280, height = 750, style }) => {
  const nav = [
    "Dashboard",
    "Motor masuk",
    "Sedang dititip",
    "Motor keluar",
    "Riwayat",
    "Kendaraan",
    "Slot parkir",
    "Pembayaran",
    "Tarif",
    "Laporan",
  ];
  return (
    <BrowserFrame url={url} width={width} height={height} style={style}>
      <div style={{ display: "flex", height: "100%", background: colors.bg }}>
        <aside
          style={{
            width: 196,
            background: "#fff",
            borderRight: `1px solid ${colors.line}`,
            padding: "14px 12px",
            flex: "none",
          }}
        >
          <Logo size={22} compact />
          <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 2 }}>
            {nav.map((item) => {
              const isActive = item === active;
              return (
                <div
                  key={item}
                  style={{
                    padding: "7px 9px",
                    borderRadius: 6,
                    fontSize: 12.5,
                    fontWeight: isActive ? 700 : 400,
                    color: isActive ? colors.red : "#5D6D7E",
                    background: isActive ? colors.redSoft : "transparent",
                  }}
                >
                  {item}
                </div>
              );
            })}
          </div>
        </aside>
        <main style={{ flex: 1, padding: 18, overflow: "hidden", position: "relative" }}>
          {children}
        </main>
      </div>
    </BrowserFrame>
  );
};
