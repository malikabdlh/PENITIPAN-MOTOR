# MOTOR PARK — Video Marketing

Video promosi aplikasi MOTOR PARK, dibuat sepenuhnya dengan kode memakai
[Remotion](https://www.remotion.dev/). Tidak membutuhkan rekaman layar.

- Durasi: **77 detik**
- Resolusi: **1920 × 1080**
- Frame rate: **30 fps**
- Audio: voice-over Bahasa Indonesia + musik latar + efek suara
- File final: **`out/motor-park.mp4`**
- Poster: **`out/motor-park-poster.png`**
- Subtitle: **`out/motor-park.srt`**

## Alur video

| Waktu | Scene | Isi |
| --- | --- | --- |
| 00:00 | Hook | Tiket kertas dan masalah parkir manual |
| 00:04 | Masalah | Tiket hilang, biaya salah, slot kacau, laporan berantakan |
| 00:13 | Perkenalan | Logo dan tagline MOTOR PARK |
| 00:20 | Dashboard | Statistik, grafik, dan daftar motor yang dititip |
| 00:28 | Motor masuk | Form, tiket otomatis, slot berubah terisi |
| 00:37 | Motor keluar | Durasi live, biaya otomatis, QRIS simulasi, struk |
| 00:49 | Slot & tarif | Denah 20 slot dan pengaturan tarif |
| 00:55 | Laporan | Filter tanggal, grafik, export Excel, cetak PDF |
| 01:02 | Keamanan | Login, role, password hash, CSRF, PDO |
| 01:08 | Penutup | CTA dan alamat demo |

## Menjalankan

```bash
npm install
npm run dev
```

Perintah di atas membuka Remotion Studio untuk preview dan mengubah scene.

Render video:

```bash
npm run render
```

Jika Chrome sudah terpasang dan tidak ingin mengunduh browser Remotion:

```powershell
npx remotion render MotorPark out/motor-park.mp4 --browser-executable="C:\Program Files\Google\Chrome\Application\chrome.exe"
```

## Struktur penting

```
src/
  data/scenes.ts       # durasi & urutan scene (harus total 2310 frame)
  Video.tsx            # komposisi utama + audio
  scenes/              # 10 scene video
  components/          # browser mockup, kartu, grafik, tiket, struk, QR
  lib/                 # animasi, format rupiah, durasi
public/audio/
  vo/                  # voice-over per scene (MP3)
  music/bgm.wav        # musik latar prosedural
  sfx/                 # whoosh, click, success
scripts/
  vo/                  # teks & SRT voice-over
  generate_vo.*        # catatan pembuatan voice-over
  make_audio.mjs       # generator musik & SFX
```

## Mengganti voice-over

Voice-over saat ini memakai **Edge TTS** (`id-ID-ArdiNeural`), bukan ElevenLabs,
karena tidak memerlukan API key. Kualitasnya natural untuk bahasa Indonesia.

Untuk mengganti dengan suara ElevenLabs:

1. Rekam 10 baris naskah di `scripts/vo-script.md`.
2. Simpan sebagai MP3 dengan nama yang sama di `public/audio/vo/`.
3. Sesuaikan durasi scene di `src/data/scenes.ts` bila audio baru lebih panjang.
4. Render ulang.

## Catatan konten

- Angka di dashboard dan laporan adalah data contoh untuk keperluan video.
- QRIS ditampilkan sebagai **simulasi**, bukan payment gateway sungguhan.
- Alamat demo `localhost/pkk alik` dapat diganti di `src/scenes/S10Cta.tsx`.
- Nama, warna, dan logo dapat diubah di `src/theme.ts` dan `src/components/ui.tsx`.
