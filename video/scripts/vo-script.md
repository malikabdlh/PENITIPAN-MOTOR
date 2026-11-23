# Naskah Voice-over

Voice: `id-ID-ArdiNeural` (Edge TTS), rate +3%.
Total audio: ±69,6 detik. Video final: 77 detik.

| # | Mulai | Durasi audio | Naskah |
| --- | --- | --- | --- |
| 1 | 00:00.4 | 3,22 s | Masih mencatat parkir motor pakai tiket kertas? |
| 2 | 00:04.4 | 8,36 s | Tiket hilang, biaya salah hitung, slot tidak terkontrol, dan laporan pendapatan berantakan. Ribet, kan? |
| 3 | 00:13.4 | 6,24 s | Kenalin Motor Park. Sistem penitipan motor yang rapi, cepat, dan akurat. |
| 4 | 00:20.4 | 7,70 s | Semua data penting ada di satu dashboard: motor yang dititip, transaksi hari ini, pendapatan, dan slot tersedia. |
| 5 | 00:28.9 | 8,28 s | Motor masuk? Cukup isi data dan pilih slot. Nomor tiket dibuat otomatis, waktunya tercatat sendiri. |
| 6 | 00:37.9 | 11,38 s | Saat motor keluar, cari tiket atau nopol. Durasi dan biaya dihitung otomatis. Bayar cash, transfer, atau QRIS simulasi, lalu cetak struk. |
| 7 | 00:49.9 | 4,97 s | Slot parkir terlihat real-time, dan tarif bisa diatur kapan saja oleh admin. |
| 8 | 00:55.4 | 6,94 s | Laporan pendapatan harian sampai bulanan tinggal filter tanggal. Bisa dicetak atau diexport ke Excel. |
| 9 | 01:02.9 | 5,43 s | Akses admin dan petugas dipisah, password aman, dan setiap form dilindungi. |
| 10 | 01:08.9 | 7,11 s | Motor Park. Titip motor, tenang. Coba demonya di link yang ada di deskripsi. |

## Perintah Edge TTS

```powershell
python -m edge_tts --voice id-ID-ArdiNeural --rate=+3% ^
  --file scripts/vo/01-hook.txt ^
  --write-media public/audio/vo/01-hook.mp3 ^
  --write-subtitles scripts/vo/01-hook.srt
```

Ulangi untuk 10 file naskah di `scripts/vo/`.
