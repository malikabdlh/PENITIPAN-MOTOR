import React from "react";
import { useCurrentFrame } from "remotion";
import { colors } from "../theme";
import { AppShell } from "../components/Browser";
import { Badge, Btn, Panel } from "../components/ui";
import { Field, TicketCard } from "../components/Mock";
import { typed, useEnter, usePop } from "../lib/motion";
import { SceneShell } from "../components/SceneShell";

export const S05Masuk: React.FC = () => {
  const frame = useCurrentFrame();
  const header = useEnter(4, 16);
  const form = useEnter(10, 20);
  const ticket = usePop(110, 0.86);
  const toast = useEnter(136, 12);

  const nopol = typed("B1234ABC", frame, 10, 1.5);
  const pemilik = typed("Budi Santoso", frame, 30, 1.4);
  const merek = typed("Honda Vario", frame, 50, 1.4);
  const warna = typed("Hitam", frame, 64, 1.4);
  const telp = typed("081234567890", frame, 78, 1.5);

  const focusNopol = frame >= 8 && frame < 30;
  const focusPemilik = frame >= 30 && frame < 50;
  const focusSlot = frame >= 92 && frame < 110;
  const slotOccupied = frame >= 110;

  return (
    <SceneShell duration={270} background="#E9ECEF" grid>
      <div style={{ position: "absolute", left: 320, top: 165 }}>
        <AppShell url="localhost/pkk alik/transaksi/masuk.php" active="Motor masuk">
          <div style={{ ...header, marginBottom: 12 }}>
            <div style={{ fontSize: 22, fontWeight: 800 }}>Catat motor masuk</div>
            <div style={{ fontSize: 11, color: colors.muted }}>
              Nomor tiket dan waktu masuk dibuat otomatis
            </div>
          </div>

          <div style={{ display: "flex", gap: 14 }}>
            <div style={{ flex: 1 }}>
              <Panel style={{ ...form, padding: 16 }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 12,
                  }}
                >
                  <Field label="Nomor polisi *" value={nopol} focus={focusNopol} />
                  <Field label="Nama pemilik *" value={pemilik} focus={focusPemilik} />
                  <Field label="Merek motor" value={merek} />
                  <Field label="Warna" value={warna} />
                  <Field label="No. telepon" value={telp} />
                  <Field label="Slot parkir *" value={focusSlot ? "A01" : frame > 88 ? "A01" : ""} focus={focusSlot} />
                </div>

                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, marginBottom: 4 }}>
                    Kondisi kendaraan
                  </div>
                  <div
                    style={{
                      border: `1px solid #D5DADF`,
                      borderRadius: 6,
                      minHeight: 38,
                      padding: "7px 9px",
                      fontSize: 11.5,
                      color: frame > 96 ? colors.ink : "#AEB6BF",
                    }}
                  >
                    {frame > 96 ? "Lecet ringan spion kiri" : "Catatan kondisi kendaraan..."}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 14,
                  }}
                >
                  <Btn primary small>
                    Simpan &amp; cetak tiket
                  </Btn>
                  <span style={{ fontSize: 10, color: colors.muted }}>
                    Slot A01 ·{" "}
                    <span style={{ color: slotOccupied ? colors.red : colors.green, fontWeight: 700 }}>
                      {slotOccupied ? "terisi" : "tersedia"}
                    </span>
                  </span>
                </div>
              </Panel>

              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <Badge tone="green" size={10.5}>
                  Nopol unik
                </Badge>
                <Badge tone="green" size={10.5}>
                  Slot terkunci
                </Badge>
                <Badge tone="grey" size={10.5}>
                  Waktu server
                </Badge>
              </div>

              <Panel style={{ marginTop: 10, padding: 12 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700 }}>
                    Motor terakhir masuk
                  </div>
                  <div style={{ fontSize: 9.5, color: colors.muted }}>Hari ini</div>
                </div>
                {[
                  ["MP-20261116-7C4D", "D5678EF", "B02", "10:05"],
                  ["MP-20261116-9D1A", "F1122GH", "B08", "09:58"],
                  ["MP-20261116-2E6B", "B3344JK", "A07", "09:47"],
                ].map((row) => (
                  <div
                    key={row[0]}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1.4fr 1fr .6fr .6fr",
                      gap: 6,
                      padding: "4px 0",
                      borderTop: `1px solid #EEF1F3`,
                      fontSize: 10.5,
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{row[0]}</span>
                    <span>{row[1]}</span>
                    <span>{row[2]}</span>
                    <span style={{ color: colors.muted, textAlign: "right" }}>
                      {row[3]}
                    </span>
                  </div>
                ))}
              </Panel>
            </div>

            <div
              style={{
                width: 360,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                paddingTop: 36,
                position: "relative",
              }}
            >
              {frame < 110 ? (
                <div
                  style={{
                    width: 310,
                    border: `1px dashed ${colors.line}`,
                    borderRadius: 10,
                    padding: 22,
                    textAlign: "center",
                    color: colors.muted,
                    fontSize: 12,
                    background: "rgba(255,255,255,.55)",
                  }}
                >
                  Tiket penitipan akan muncul di sini
                </div>
              ) : (
                <div style={{ ...ticket, position: "relative" }}>
                  <div
                    style={{
                      position: "absolute",
                      top: -14,
                      right: -14,
                      width: 30,
                      height: 30,
                      borderRadius: 99,
                      background: colors.green,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                      fontWeight: 800,
                    }}
                  >
                    ✓
                  </div>
                  <TicketCard
                    ticket="MP-20261116-1B02"
                    nopol="B1234ABC"
                    slot="A01"
                    time="09:41"
                  />
                </div>
              )}
            </div>
          </div>

          <div
            style={{
              ...toast,
              position: "absolute",
              left: 18,
              bottom: 12,
              background: "#fff",
              border: `1px solid ${colors.line}`,
              borderLeft: `3px solid ${colors.green}`,
              borderRadius: 6,
              padding: "7px 12px",
              fontSize: 10.5,
              color: colors.ink,
              boxShadow: "0 6px 20px rgba(0,0,0,.06)",
            }}
          >
            <b style={{ color: colors.green }}>Tersimpan.</b> Motor masuk tercatat, slot A01
            sekarang terisi.
          </div>
        </AppShell>
      </div>
    </SceneShell>
  );
};
