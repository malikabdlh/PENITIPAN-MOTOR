import React from "react";
import { useCurrentFrame } from "remotion";
import { colors, font } from "../theme";
import { AppShell } from "../components/Browser";
import { StatCard } from "../components/Mock";
import { MiniBars, LineChart } from "../components/Charts";
import { Badge, Panel } from "../components/ui";
import { useCountUp, useEnter } from "../lib/motion";
import { rupiah } from "../lib/format";
import { SceneShell } from "../components/SceneShell";

const rows = [
  ["MP-20261116-1B02", "B1234ABC", "Budi Santoso", "A01", "09:41"],
  ["MP-20261116-7C4D", "D5678EF", "Siti Aminah", "B02", "10:05"],
  ["MP-20261116-9D1A", "F1122GH", "Rina Wijaya", "B08", "10:22"],
  ["MP-20261116-2E6B", "B3344JK", "Ahmad Fauzi", "A07", "10:40"],
  ["MP-20261115-3A9F", "B9876XYZ", "Andi Pratama", "A04", "08:12"],
];

export const S04Dashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const header = useEnter(4, 16);
  const active = useCountUp(5, 8);
  const masuk = useCountUp(3, 12);
  const keluar = useCountUp(2, 16);
  const income = useCountUp(15000, 20);
  const slot = useCountUp(15, 24);

  return (
    <SceneShell duration={255} background="#E9ECEF" grid>
      <div style={{ position: "absolute", left: 320, top: 165 }}>
        <AppShell url="localhost/pkk alik/dashboard" active="Dashboard">
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
              <div style={{ fontSize: 22, fontWeight: 800, color: colors.ink }}>
                Dashboard
              </div>
              <div style={{ fontSize: 11, color: colors.muted }}>
                Ringkasan hari ini · 16 November 2026
              </div>
            </div>
            <Badge tone="green" size={10}>
              Data langsung dari MySQL
            </Badge>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 8,
            }}
          >
            <StatCard label="Dititipkan" value={String(active)} sub="motor" small accent delay={6} />
            <StatCard label="Masuk hari ini" value={String(masuk)} sub="transaksi" small delay={10} />
            <StatCard label="Keluar hari ini" value={String(keluar)} sub="selesai" small delay={14} />
            <StatCard label="Pendapatan" value={rupiah(income)} sub="pembayaran lunas" small delay={18} />
            <StatCard label="Slot tersedia" value={`${slot}/20`} sub="5 terisi" small delay={22} />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              marginTop: 10,
            }}
          >
            <Panel style={{ padding: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 6 }}>
                Transaksi 7 hari terakhir
              </div>
              <MiniBars
                data={[1, 3, 2, 4, 3, 5, 4]}
                labels={["10", "11", "12", "13", "14", "15", "16"]}
                height={100}
                delay={22}
              />
            </Panel>
            <Panel style={{ padding: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 6 }}>
                Pendapatan 7 hari terakhir
              </div>
              <LineChart
                data={[3000, 9000, 6000, 12000, 9000, 15000, 12000]}
                width={470}
                height={112}
                delay={24}
              />
            </Panel>
          </div>

          <Panel style={{ padding: 12, marginTop: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 6 }}>
              Motor sedang dititip
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1.2fr .7fr .7fr", gap: 6 }}>
              {["Tiket", "Nopol", "Pemilik", "Slot", "Masuk"].map((h) => (
                <div key={h} style={{ fontSize: 9.5, color: colors.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: .4 }}>
                  {h}
                </div>
              ))}
              {rows.map((r) => (
                <React.Fragment key={r[0]}>
                  <div style={{ fontSize: 10.5, fontWeight: 700 }}>{r[0]}</div>
                  <div style={{ fontSize: 10.5 }}>{r[1]}</div>
                  <div style={{ fontSize: 10.5 }}>{r[2]}</div>
                  <div>
                    <Badge tone="red" size={9.5}>
                      {r[3]}
                    </Badge>
                  </div>
                  <div style={{ fontSize: 10.5, color: colors.muted }}>{r[4]}</div>
                </React.Fragment>
              ))}
            </div>
          </Panel>

          <div
            style={{
              position: "absolute",
              right: 18,
              bottom: 12,
              fontSize: 9.5,
              color: colors.muted,
              fontFamily: font,
              opacity: frame > 60 ? 1 : 0,
            }}
          >
            Diperbarui otomatis · <span style={{ color: colors.green }}>● live</span>
          </div>
        </AppShell>
      </div>
    </SceneShell>
  );
};
