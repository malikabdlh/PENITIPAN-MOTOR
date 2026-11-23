import React from "react";
import { useCurrentFrame } from "remotion";
import { colors } from "../theme";
import { AppShell } from "../components/Browser";
import { StatCard, SlotCell } from "../components/Mock";
import { Badge, Panel } from "../components/ui";
import { useEnter, useSlide } from "../lib/motion";
import { rupiah } from "../lib/format";
import { SceneShell } from "../components/SceneShell";

const slots = [
  ...Array.from({ length: 10 }, (_, i) => `A${String(i + 1).padStart(2, "0")}`),
  ...Array.from({ length: 10 }, (_, i) => `B${String(i + 1).padStart(2, "0")}`),
];
const occupied = new Set(["A01", "A04", "B02", "B05", "B07"]);

export const S07Slot: React.FC = () => {
  const frame = useCurrentFrame();
  const header = useEnter(4, 16);
  const grid = useEnter(10, 18);
  const card = useSlide(54, 60, 0);

  return (
    <SceneShell duration={165} background="#E9ECEF" grid>
      <div style={{ position: "absolute", left: 320, top: 165 }}>
        <AppShell url="localhost/pkk alik/slot/index.php" active="Slot parkir">
          <div
            style={{
              ...header,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 12,
            }}
          >
            <div>
              <div style={{ fontSize: 22, fontWeight: 800 }}>Slot parkir</div>
              <div style={{ fontSize: 11, color: colors.muted }}>
                Status diperbarui otomatis saat motor masuk dan keluar
              </div>
            </div>
            <Badge tone="green" size={10}>
              20 slot
            </Badge>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 9 }}>
            <StatCard label="Total slot" value="20" sub="kapasitas" small delay={8} />
            <StatCard label="Tersedia" value="15" sub="siap dipakai" small delay={12} />
            <StatCard label="Terisi" value="5" sub="motor aktif" small delay={16} accent />
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 10, alignItems: "stretch" }}>
            <Panel style={{ ...grid, flex: 1, padding: 13 }}>
              <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 8 }}>
                Denah slot
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: 8,
                }}
              >
                {slots.map((code) => (
                  <SlotCell key={code} code={code} occupied={occupied.has(code)} />
                ))}
              </div>
              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 10.5,
                  color: colors.muted,
                }}
              >
                <Badge tone="green" size={9.5}>tersedia</Badge>
                <Badge tone="red" size={9.5}>terisi</Badge>
                <span>Slot terisi tidak bisa dihapus.</span>
              </div>
            </Panel>

            <div
              style={{
                ...card,
                width: 300,
                flex: "none",
                background: "#fff",
                border: `1px solid ${colors.line}`,
                borderRadius: 10,
                padding: 18,
                boxShadow: "0 18px 45px rgba(26,37,47,.12)",
                alignSelf: "flex-start",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>Tarif aktif</div>
                <Badge tone="dark" size={9.5}>Admin</Badge>
              </div>
              <div style={{ fontSize: 11.5, color: colors.muted, marginTop: 2 }}>
                Reguler · bisa diubah kapan saja
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  marginTop: 16,
                  paddingTop: 14,
                  borderTop: `1px solid #EEF1F3`,
                }}
              >
                <span style={{ fontSize: 11.5, color: colors.muted }}>Per jam</span>
                <span style={{ fontSize: 22, fontWeight: 800, color: colors.red }}>
                  {rupiah(3000)}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  marginTop: 8,
                }}
              >
                <span style={{ fontSize: 11.5, color: colors.muted }}>Per hari</span>
                <span style={{ fontSize: 22, fontWeight: 800, color: colors.ink }}>
                  {rupiah(15000)}
                </span>
              </div>
              <div
                style={{
                  marginTop: 14,
                  background: colors.greenSoft,
                  color: colors.green,
                  borderRadius: 6,
                  padding: "7px 10px",
                  fontSize: 10.5,
                  fontWeight: 600,
                }}
              >
                ≤ 8 jam dihitung per jam · lebih dari itu harian
              </div>
            </div>
          </div>
        </AppShell>
      </div>
    </SceneShell>
  );
};
