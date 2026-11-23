import React from "react";
import { useCurrentFrame } from "remotion";
import { colors } from "../theme";
import { AppShell } from "../components/Browser";
import { Badge, Btn, Panel } from "../components/ui";
import { QrPattern, Receipt } from "../components/Mock";
import { formatDuration, rupiah } from "../lib/format";
import { useEnter, usePop } from "../lib/motion";
import { SceneShell } from "../components/SceneShell";

const Row: React.FC<{ label: string; value: React.ReactNode; last?: boolean }> = ({
  label,
  value,
  last,
}) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "7px 0",
      borderBottom: last ? "none" : `1px solid #EEF1F3`,
      fontSize: 12,
    }}
  >
    <span style={{ color: colors.muted }}>{label}</span>
    <span style={{ fontWeight: 600, textAlign: "right" }}>{value}</span>
  </div>
);

export const S06Keluar: React.FC = () => {
  const frame = useCurrentFrame();
  const header = useEnter(4, 16);
  const left = useEnter(10, 20);
  const right = useEnter(16, 20);
  const qrisOn = frame >= 40;
  const receipt = usePop(225, 0.88);
  const check = usePop(243, 0.6);

  const seconds = 2 * 3600 + 14 * 60 + 9 + Math.floor(frame / 30);
  const metode = ["Cash", "Transfer", "QRIS"];

  return (
    <SceneShell duration={360} background="#E9ECEF" grid>
      <div style={{ position: "absolute", left: 320, top: 165 }}>
        <AppShell url="localhost/pkk alik/transaksi/keluar.php" active="Motor keluar">
          <div style={{ ...header, marginBottom: 12 }}>
            <div style={{ fontSize: 22, fontWeight: 800 }}>Motor keluar &amp; pembayaran</div>
            <div style={{ fontSize: 11, color: colors.muted }}>
              Cari tiket atau nopol · durasi dan biaya dihitung otomatis
            </div>
          </div>

          <div style={{ display: "flex", gap: 14 }}>
            <div style={{ ...left, width: 470 }}>
              <Panel style={{ padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>Detail kendaraan</div>
                  <Badge tone="red" size={9.5}>
                    Sedang dititip
                  </Badge>
                </div>
                <Row label="No. tiket" value="MP-20261116-1B02" />
                <Row label="Nopol" value="B1234ABC" />
                <Row label="Pemilik" value="Budi Santoso" />
                <Row label="Slot" value={<Badge tone="red" size={9.5}>A01</Badge>} />
                <Row label="Masuk" value="16 Nov 2026 · 09:41" />
                <Row
                  label="Durasi berjalan"
                  value={
                    <span style={{ color: colors.green, fontVariantNumeric: "tabular-nums" }}>
                      {formatDuration(seconds)}
                    </span>
                  }
                />
                <Row
                  label="Biaya"
                  value={
                    <span style={{ fontSize: 21, fontWeight: 800, color: colors.red }}>
                      {rupiah(9000)}
                    </span>
                  }
                  last
                />
              </Panel>

              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  gap: 8,
                }}
              >
                <Badge tone="grey" size={9.5}>3 jam pertama</Badge>
                <Badge tone="grey" size={9.5}>Rp 3.000 / jam</Badge>
              </div>
            </div>

            <div style={{ ...right, flex: 1 }}>
              <Panel style={{ padding: 16, position: "relative", overflow: "hidden" }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>
                  Pembayaran
                </div>

                <div style={{ display: "flex", gap: 7, marginBottom: 14 }}>
                  {metode.map((m) => {
                    const selected = m === "QRIS" && qrisOn;
                    return (
                      <div
                        key={m}
                        style={{
                          flex: 1,
                          textAlign: "center",
                          border: `1px solid ${selected ? colors.red : colors.line}`,
                          background: selected ? colors.redSoft : "#fff",
                          color: selected ? colors.redDark : colors.ink,
                          borderRadius: 6,
                          padding: "7px 6px",
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                      >
                        {m}
                      </div>
                    );
                  })}
                </div>

                <div
                  style={{
                    opacity: qrisOn ? 1 : 0.25,
                    textAlign: "center",
                    border: `1px dashed ${colors.line}`,
                    borderRadius: 8,
                    background: "#FAFBFB",
                    padding: 10,
                  }}
                >
                  <div style={{ fontSize: 10, color: colors.muted, marginBottom: 6 }}>
                    QRIS · mode simulasi
                  </div>
                  <div
                    style={{
                      display: "inline-block",
                      padding: 6,
                      background: "#fff",
                      border: `1px solid ${colors.line}`,
                      borderRadius: 4,
                    }}
                  >
                    <QrPattern seed="MP-20261116-1B02|9000" size={112} />
                  </div>
                  <div style={{ fontSize: 10.5, marginTop: 6 }}>
                    Nominal <b>{rupiah(9000)}</b>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 14,
                  }}
                >
                  <span style={{ fontSize: 9.5, color: colors.muted, maxWidth: 220 }}>
                    Tidak terhubung payment gateway. Transaksi tetap tercatat lunas.
                  </span>
                  <Btn primary small>
                    Selesaikan
                  </Btn>
                </div>

                {frame >= 225 ? (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(244,245,246,.55)",
                    }}
                  />
                ) : null}
              </Panel>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            {[
              ["Slot kembali tersedia", "A01 otomatis dibuka"],
              ["Struk siap dicetak", "Bukti pembayaran yang lunas"],
              ["Laporan diperbarui", "Pendapatan langsung tercatat"],
            ].map((item) => (
              <div
                key={item[0]}
                style={{
                  flex: 1,
                  background: "#fff",
                  border: `1px solid ${colors.line}`,
                  borderRadius: 8,
                  padding: "9px 12px",
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700 }}>{item[0]}</div>
                <div style={{ fontSize: 9.5, color: colors.muted }}>{item[1]}</div>
              </div>
            ))}
          </div>

          {frame >= 225 ? (
            <div
              style={{
                ...receipt,
                position: "absolute",
                right: 26,
                top: 96,
                transform: `${receipt.transform} rotate(1.5deg)`,
                zIndex: 10,
              }}
            >
              <Receipt
                ticket="MP-20261116-1B02"
                nopol="B1234ABC"
                total={rupiah(9000)}
                duration="2 jam 14 mnt"
              />
              <div
                style={{
                  ...check,
                  position: "absolute",
                  right: -16,
                  top: -16,
                  width: 42,
                  height: 42,
                  borderRadius: 99,
                  background: colors.green,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  fontWeight: 800,
                  boxShadow: "0 8px 20px rgba(30,132,73,.3)",
                }}
              >
                ✓
              </div>
            </div>
          ) : null}

          <div
            style={{
              position: "absolute",
              left: 18,
              bottom: 12,
              fontSize: 9.5,
              color: colors.muted,
              opacity: frame > 120 ? 1 : 0,
            }}
          >
            Slot A01 otomatis kembali <span style={{ color: colors.green, fontWeight: 700 }}>tersedia</span> setelah transaksi selesai.
          </div>
        </AppShell>
      </div>
    </SceneShell>
  );
};
