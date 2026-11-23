-- =====================================================
-- MOTOR PARK - Sistem Informasi Penitipan Motor
-- Database: db_penitipan_motor
-- Cara pakai: import file ini via phpMyAdmin > Import
-- =====================================================

CREATE DATABASE IF NOT EXISTS `db_penitipan_motor`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

USE `db_penitipan_motor`;

-- ---------------- users ----------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `password` VARCHAR(255) NOT NULL COMMENT 'hash via password_hash()',
  `nama_lengkap` VARCHAR(100) NOT NULL,
  `role` ENUM('admin','petugas') NOT NULL DEFAULT 'petugas',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_username` (`username`),
  KEY `idx_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------- kendaraan (master) ----------------
CREATE TABLE IF NOT EXISTS `kendaraan` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nopol` VARCHAR(20) NOT NULL COMMENT 'Nomor polisi, huruf besar tanpa spasi ganda',
  `merek` VARCHAR(50) DEFAULT NULL,
  `warna` VARCHAR(30) DEFAULT NULL,
  `nama_pemilik` VARCHAR(100) NOT NULL,
  `no_telp` VARCHAR(20) DEFAULT NULL,
  `catatan_kondisi` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_nopol` (`nopol`),
  KEY `idx_nopol` (`nopol`),
  KEY `idx_pemilik` (`nama_pemilik`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------- slot_parkir ----------------
CREATE TABLE IF NOT EXISTS `slot_parkir` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `kode_slot` VARCHAR(10) NOT NULL,
  `status` ENUM('tersedia','terisi') NOT NULL DEFAULT 'tersedia',
  `keterangan` VARCHAR(100) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_kode` (`kode_slot`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------- tarif ----------------
CREATE TABLE IF NOT EXISTS `tarif` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nama_tarif` VARCHAR(50) NOT NULL,
  `tarif_per_jam` INT UNSIGNED NOT NULL DEFAULT 3000,
  `tarif_per_hari` INT UNSIGNED NOT NULL DEFAULT 15000,
  `is_aktif` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_aktif` (`is_aktif`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------- transaksi ----------------
CREATE TABLE IF NOT EXISTS `transaksi` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `no_tiket` VARCHAR(20) NOT NULL,
  `kendaraan_id` INT UNSIGNED NOT NULL,
  `slot_id` INT UNSIGNED NOT NULL,
  `waktu_masuk` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `waktu_keluar` DATETIME DEFAULT NULL,
  `durasi_menit` INT UNSIGNED DEFAULT NULL,
  `biaya` INT UNSIGNED NOT NULL DEFAULT 0,
  `status` ENUM('aktif','selesai') NOT NULL DEFAULT 'aktif',
  `petugas_masuk_id` INT UNSIGNED DEFAULT NULL,
  `petugas_keluar_id` INT UNSIGNED DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_tiket` (`no_tiket`),
  KEY `idx_status` (`status`),
  KEY `idx_masuk` (`waktu_masuk`),
  KEY `idx_keluar` (`waktu_keluar`),
  KEY `idx_kendaraan` (`kendaraan_id`),
  KEY `idx_slot` (`slot_id`),
  CONSTRAINT `fk_trx_kendaraan` FOREIGN KEY (`kendaraan_id`) REFERENCES `kendaraan` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_trx_slot` FOREIGN KEY (`slot_id`) REFERENCES `slot_parkir` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_trx_masuk` FOREIGN KEY (`petugas_masuk_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT `fk_trx_keluar` FOREIGN KEY (`petugas_keluar_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------- pembayaran ----------------
CREATE TABLE IF NOT EXISTS `pembayaran` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `transaksi_id` INT UNSIGNED NOT NULL,
  `jumlah_bayar` INT UNSIGNED NOT NULL COMMENT 'total tagihan',
  `uang_diterima` INT UNSIGNED NOT NULL DEFAULT 0,
  `kembalian` INT UNSIGNED NOT NULL DEFAULT 0,
  `metode` ENUM('cash','transfer','QRIS') NOT NULL DEFAULT 'cash',
  `status` ENUM('lunas','pending') NOT NULL DEFAULT 'lunas',
  `waktu_bayar` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `petugas_id` INT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_transaksi` (`transaksi_id`),
  KEY `idx_waktu` (`waktu_bayar`),
  KEY `idx_status` (`status`),
  KEY `idx_metode` (`metode`),
  CONSTRAINT `fk_bayar_trx` FOREIGN KEY (`transaksi_id`) REFERENCES `transaksi` (`id`) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `fk_bayar_petugas` FOREIGN KEY (`petugas_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- DATA AWAL (aman untuk pengujian)
-- Login: admin / admin123  (role admin)
-- Login: petugas / petugas123 (role petugas)
-- =====================================================

INSERT INTO `users` (`username`, `password`, `nama_lengkap`, `role`) VALUES
('admin', '$2y$10$PgWng5RWkZdgeDNrAMqV/.70efP91pNM6z2prUQxPYLDGbOSIqkt.', 'Administrator', 'admin'),
('petugas', '$2y$10$M8depx7cPIptFb/ZHEkwz.AOvkq.Wf0gQgvpVYdTx5mIW44N3ZIs.', 'Petugas Parkir', 'petugas')
ON DUPLICATE KEY UPDATE nama_lengkap = VALUES(nama_lengkap);

INSERT INTO `tarif` (`nama_tarif`, `tarif_per_jam`, `tarif_per_hari`, `is_aktif`) VALUES
('Reguler', 3000, 15000, 1),
('Weekend', 5000, 20000, 0)
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO `slot_parkir` (`kode_slot`, `status`, `keterangan`) VALUES
('A01','tersedia','Blok A'),('A02','tersedia','Blok A'),('A03','tersedia','Blok A'),
('A04','tersedia','Blok A'),('A05','tersedia','Blok A'),('A06','tersedia','Blok A'),
('A07','tersedia','Blok A'),('A08','tersedia','Blok A'),('A09','tersedia','Blok A'),
('A10','tersedia','Blok A'),('B01','tersedia','Blok B'),('B02','tersedia','Blok B'),
('B03','tersedia','Blok B'),('B04','tersedia','Blok B'),('B05','tersedia','Blok B'),
('B06','tersedia','Blok B'),('B07','tersedia','Blok B'),('B08','tersedia','Blok B'),
('B09','tersedia','Blok B'),('B10','tersedia','Blok B')
ON DUPLICATE KEY UPDATE keterangan = VALUES(keterangan);

-- Contoh kendaraan (opsional, boleh dihapus)
INSERT INTO `kendaraan` (`nopol`, `merek`, `warna`, `nama_pemilik`, `no_telp`, `catatan_kondisi`) VALUES
('B1234ABC', 'Honda Vario', 'Hitam', 'Budi Santoso', '081234567890', 'Lecet ringan spion kiri'),
('D5678EF', 'Yamaha NMAX', 'Biru', 'Siti Aminah', '081987654321', 'Mulus, helm dititipkan')
ON DUPLICATE KEY UPDATE nama_pemilik = VALUES(nama_pemilik);
