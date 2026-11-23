# MOTOR PARK — Sistem Informasi Penitipan Motor

Aplikasi web PHP Native + MySQL untuk mengelola penitipan motor:
kendaraan, motor masuk/keluar, slot, tarif, pembayaran, dan laporan.

## 1. Syarat
- Laragon (disarankan) atau XAMPP — PHP 8+, MySQL/MariaDB, Apache
- phpMyAdmin (bawaan Laragon/XAMPP)
- Browser modern

Folder proyek ini harus berada di document root:
- Laragon: `C:\laragon\www\pkk alik`
- Akses: `http://localhost/pkk%20alik/` atau via Laragon virtual host

## 2. Instalasi

1. **Copy folder** ke `C:\laragon\www\pkk alik` (sudah di sini).
2. **Start** Apache + MySQL dari Laragon / XAMPP.
3. **Buat database:**
   - Buka phpMyAdmin → `http://localhost/phpmyadmin`
   - Tab **Import** → pilih file `database/schema.sql` → **Go**
   - Database `db_penitipan_motor` + 6 tabel + data awal otomatis dibuat.
4. **Cek koneksi** (jika user/pass MySQL kamu bukan root/kosong):
   - Edit `config/database.php` (`$DB_USER`, `$DB_PASS`).
5. **Buka aplikasi:** `http://localhost/pkk%20alik/`
   - Otomatis diarahkan ke login.

## 3. Akun Default (ganti setelah login!)

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Petugas | `petugas` | `petugas123` |

Password disimpan sebagai hash (`password_hash()`), bukan teks biasa.

## 4. Alur Pakai
1. Login → Dashboard (statistik + grafik otomatis dari DB).
2. **Slot:** pastikan ada slot `tersedia` (admin bisa tambah di menu Slot).
3. **Tarif:** admin atur di menu Tarif (default Reguler 3.000/jam, 15.000/hari).
4. **Motor Masuk:** isi nopol + pemilik + pilih slot → dapat No. Tiket (cth `MP-20260101-AB12`).
5. **Sedang Dititip:** pantau motor yang masih diparkir — durasi berjalan (menit & detik) tampil dan diperbarui otomatis.
6. **Motor Keluar:** cari tiket/nopol → durasi + biaya berjalan ikut diperbarui otomatis → pilih cash/transfer/QRIS (simulasi) → Selesaikan → Cetak Struk.
7. **Pembayaran & Laporan:** filter tanggal, lihat total, cetak atau simpan PDF lewat dialog print browser.
8. **Export Excel:** tombol di halaman Laporan mengunduh file CSV (sudah diformat agar terbaca di Excel).
9. **Ganti password:** link di sidebar bawah, isi password lama + baru (minimal 8 karakter).

## 5. Struktur Folder
```
index.php, config/, auth/, dashboard/, kendaraan/, transaksi/,
pembayaran/, slot/, laporan/, includes/, assets/css/, assets/js/, database/
```

## 6. Rumus Biaya
- Durasi dibulatkan ke atas per jam. ≤8 jam = `jam × tarif/jam`.
- >8 jam = tarif harian. Kelipatan 24 jam dihitung harian + sisa.
- Lihat fungsi `hitung_biaya()` di `config/functions.php`.

## 7. Keamanan
- PDO prepared statements (anti SQL injection), validasi server-side,
  `password_hash/verify`, session login, CSRF token di semua form POST,
  hak akses admin vs petugas, escape output `e()`.

## 8. Troubleshooting
- **Koneksi gagal:** pastikan MySQL jalan & `schema.sql` sudah diimport.
- **404 / spasi folder:** akses URL-encode `%20` untuk "pkk alik", atau rename folder jadi `pkk-alik` bila perlu.
- **Chart kosong:** wajar jika belum ada transaksi — coba buat Motor Masuk + Keluar dulu.
- **QRIS:** mode simulasi — halaman menampilkan QR tiruan dan hitungan waktu, tidak terhubung payment gateway. Transaksi tetap tercatat lunas dengan metode QRIS dan diberi label "simulasi" di struk. Untuk integrasi asli (Midtrans/Xendit) dibutuhkan API key tersendiri.
