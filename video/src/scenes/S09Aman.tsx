import React from "react";
import { useCurrentFrame } from "remotion";
import { colors } from "../theme";
import { BrowserFrame } from "../components/Browser";
import { Badge, Logo } from "../components/ui";
import { useEnter, usePop } from "../lib/motion";
import { SceneShell, Kicker } from "../components/SceneShell";

const items = [
  {
    no: "01",
    title: "Password di-hash",
    text: "Tidak ada password yang disimpan sebagai teks biasa.",
  },
  {
    no: "02",
    title: "Form terlindungi",
    text: "Setiap perubahan data membawa token CSRF.",
  },
  {
    no: "03",
    title: "Query aman",
    text: "PDO prepared statements mencegah SQL injection.",
  },
];

export const S09Aman: React.FC = () => {
  const frame = useCurrentFrame();
  const heading = useEnter(4, 24);
  const sub = useEnter(12, 18);
  const card = usePop(18, 0.92);
  const rowStyles = [
    useEnter(26, 18),
    useEnter(36, 18),
    useEnter(46, 18),
  ];

  return (
    <SceneShell duration={180} background={colors.inkDark}>
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(192,57,43,.15), transparent 65%)",
          right: 20,
          top: 150,
        }}
      />
      <div style={{ position: "absolute", left: 140, top: 192, width: 860 }}>
        <Kicker light>Keamanan</Kicker>
        <div
          style={{
            ...heading,
            fontSize: 66,
            fontWeight: 800,
            color: "#fff",
            marginTop: 14,
            letterSpacing: -1,
          }}
        >
          Aman dari dasar.
        </div>
        <div
          style={{
            ...sub,
            fontSize: 22,
            color: "rgba(255,255,255,.55)",
            marginTop: 12,
            lineHeight: 1.5,
            maxWidth: 760,
          }}
        >
          Bukan cuma soal tampilan. Data pemilik dan transaksi dijaga
          dengan praktik keamanan standar.
        </div>

        <div style={{ marginTop: 34, display: "flex", flexDirection: "column", gap: 18 }}>
          {items.map((item, index) => (
            <div
              key={item.no}
              style={{
                ...rowStyles[index],
                display: "flex",
                gap: 18,
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: colors.red,
                  background: "rgba(192,57,43,.14)",
                  border: "1px solid rgba(192,57,43,.3)",
                  borderRadius: 6,
                  padding: "5px 9px",
                }}
              >
                {item.no}
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>
                  {item.title}
                </div>
                <div style={{ fontSize: 16, color: "rgba(255,255,255,.5)", marginTop: 3 }}>
                  {item.text}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: "absolute", right: 150, top: 214, ...card }}>
        <BrowserFrame url="localhost/pkk alik/auth/login.php" width={560} height={470}>
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#EDEFF1",
              padding: 20,
            }}
          >
            <div
              style={{
                width: 350,
                background: "#fff",
                border: `1px solid ${colors.line}`,
                borderRadius: 10,
                padding: 22,
              }}
            >
              <Logo size={26} />
              <div style={{ fontSize: 15, fontWeight: 700, marginTop: 18 }}>
                Masuk ke akun
              </div>
              <div style={{ fontSize: 10.5, color: colors.muted, marginBottom: 14 }}>
                Gunakan akun admin atau petugas.
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, marginBottom: 4 }}>Username</div>
              <div
                style={{
                  border: `1px solid ${colors.line}`,
                  borderRadius: 6,
                  padding: "8px 10px",
                  fontSize: 12,
                  background: "#fff",
                }}
              >
                admin
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, margin: "10px 0 4px" }}>
                Password
              </div>
              <div
                style={{
                  border: `1px solid ${colors.line}`,
                  borderRadius: 6,
                  padding: "8px 10px",
                  fontSize: 12,
                  background: "#fff",
                  letterSpacing: 3,
                }}
              >
                ••••••••
              </div>
              <div
                style={{
                  marginTop: 14,
                  background: colors.red,
                  color: "#fff",
                  borderRadius: 6,
                  padding: "9px 12px",
                  textAlign: "center",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Masuk
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
                <Badge tone="dark" size={9.5}>Admin</Badge>
                <Badge tone="grey" size={9.5}>Petugas</Badge>
              </div>
            </div>
          </div>
        </BrowserFrame>
        <div
          style={{
            position: "absolute",
            left: -28,
            bottom: -18,
            background: "#fff",
            border: `1px solid ${colors.line}`,
            borderLeft: `3px solid ${colors.green}`,
            borderRadius: 7,
            padding: "9px 13px",
            fontSize: 11,
            boxShadow: "0 12px 30px rgba(0,0,0,.18)",
            opacity: frame > 60 ? 1 : 0,
          }}
        >
          <b>Akses sesuai peran</b>
          <div style={{ color: colors.muted, fontSize: 9.5 }}>
            Admin dan petugas punya hak berbeda.
          </div>
        </div>
      </div>
    </SceneShell>
  );
};
