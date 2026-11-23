import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { colors } from "../theme";
import { AppShell } from "../components/Browser";
import { StatCard } from "../components/Mock";
import { MiniBars, LineChart } from "../components/Charts";
import { Badge, Btn, Panel } from "../components/ui";
import { clamp, useEnter, useSlide } from "../lib/motion";
import { rupiah } from "../lib/format";
import { SceneShell } from "../components/SceneShell";

const rows = [
  ["MP-20261116-1B02", "B1234ABC", "A01", "Rp 9.000", "selesai"],
  ["MP-20261116-7C4D", "D5678EF", "B02", "Rp 3.000", "selesai"],
  ["MP-20261116-9D1A", "F1122GH", "B08", "Rp 3.000", "selesai"],
  ["MP-20261115-3A9F", "B9876XYZ", "A04", "Rp 6.000", "selesai"],
  ["MP-20261115-5F2A", "B5566CD", "A03", "Rp 15.000", "selesai"],
];

export const S08Laporan: React.FC = () => {
  const frame = useCurrentFrame();
  const header = useEnter(4, 16);
  const stats = useEnter(10, 14);
  const charts = useEnter(16, 16);
  const file = useSlide(150, 70, 0);
  const pulse = interpolate(frame, [110, 130, 150], [1, 1.06, 1], clamp);

  return (
    <SceneShell duration={225} background="#E9ECEF" grid>
      <div style={{ position: "absolute", left: 320, top: 165 }}>
        <AppShell url="localhost/pkk alik/laporan/index.php" active="Laporan">
          <div style={{ ...header, marginBottom: 10 }}>
            <div style={{ fontSize: 22, fontWeight: 800 }}>Laporan</div>
            <div style={{ fontSize: 11, color: colors.muted }}>
              Rekap pendapatan dari pembayaran yang valid
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                border: `1px solid ${colors.line}`,
                borderRadius: 6,
                padding: "6px 10px",
                fontSize: 10.5,
                background: "#fff",
              }}
            >
              01/11/2026 – 30/11/2026
            </div>
            <Btn small> Tampilkan</Btn>
            <div style={{ transform: `scale(${pulse})` }}>
              <div
                style={{
                  border: `1px solid ${colors.red}`,
                  color: colors.red,
                  borderRadius: 7,
                  padding: "6px 11px",
                  fontSize: 12,
                  fontWeight: 600,
                  background: "#fff",
                }}
              >
                Export Excel
              </div>
            </div>
            <div
              style={{
                border: `1px solid ${colors.line}`,
                color: colors.ink,
                borderRadius: 7,
                padding: "6px 11px",
                fontSize: 12,
                fontWeight: 600,
                background: "#fff",
              }}
            >
              Cetak / PDF
            </div>
          </div>

          <div style={{ ...stats, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            <StatCard label="Masuk" value="42" sub="motor" small delay={10} />
            <StatCard label="Keluar" value="38" sub="selesai" small delay={14} />
            <StatCard label="Lunas" value="38" sub="pembayaran" small delay={18} />
            <StatCard label="Pendapatan" value={rupiah(114000)} sub="November" small delay={22} accent />
          </div>

          <div style={{ ...charts, display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: 10, marginTop: 10 }}>
            <Panel style={{ padding: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 6 }}>
                Pendapatan harian
              </div>
              <MiniBars
                data={[2, 4, 3, 5, 4, 6, 5, 7, 4, 6]}
                labels={["7", "8", "9", "10", "11", "12", "13", "14", "15", "16"]}
                height={88}
                delay={26}
              />
            </Panel>
            <Panel style={{ padding: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 6 }}>
                Tren pendapatan
              </div>
              <LineChart
                data={[3000, 9000, 6000, 12000, 9000, 15000, 12000, 18000, 15000, 21000]}
                width={440}
                height={104}
                delay={28}
              />
            </Panel>
          </div>

          <Panel style={{ marginTop: 10, padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <div style={{ fontSize: 11, fontWeight: 700 }}>Detail transaksi</div>
              <div style={{ fontSize: 9.5, color: colors.muted }}>10 data terakhir</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr .6fr .8fr .7fr", gap: 6 }}>
              {["Tiket", "Nopol", "Slot", "Biaya", "Status"].map((h) => (
                <div key={h} style={{ fontSize: 9.5, color: colors.muted, fontWeight: 700, textTransform: "uppercase" }}>
                  {h}
                </div>
              ))}
              {rows.map((r) => (
                <React.Fragment key={r[0]}>
                  <div style={{ fontSize: 10.5, fontWeight: 600 }}>{r[0]}</div>
                  <div style={{ fontSize: 10.5 }}>{r[1]}</div>
                  <div style={{ fontSize: 10.5 }}>{r[2]}</div>
                  <div style={{ fontSize: 10.5 }}>{r[3]}</div>
                  <div>
                    <Badge tone="green" size={9}>{r[4]}</Badge>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </Panel>

          {frame >= 150 ? (
            <div
              style={{
                ...file,
                position: "absolute",
                right: 22,
                bottom: 22,
                background: "#fff",
                border: `1px solid ${colors.line}`,
                borderLeft: `3px solid ${colors.green}`,
                borderRadius: 7,
                padding: "9px 13px",
                boxShadow: "0 12px 30px rgba(26,37,47,.12)",
                fontSize: 10.5,
                zIndex: 6,
              }}
            >
              <b>laporan-motorpark-202611.csv</b>
              <div style={{ color: colors.green, fontSize: 9.5 }}>File siap diunduh</div>
            </div>
          ) : null}
        </AppShell>
      </div>
    </SceneShell>
  );
};
