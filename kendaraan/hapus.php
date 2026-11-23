<?php
require_once __DIR__ . '/../config/functions.php';
require_login();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    set_flash('error', 'Gunakan tombol hapus dari halaman detail.');
    redirect('kendaraan/index.php');
}
verify_csrf();
$id = (int)($_POST['id'] ?? 0);

// Aturan: tidak boleh hapus jika masih ada transaksi aktif
$stmt = $pdo->prepare("SELECT COUNT(*) FROM transaksi WHERE kendaraan_id=? AND status='aktif'");
$stmt->execute([$id]);
if ((int)$stmt->fetchColumn() > 0) {
    set_flash('error', 'Gagal hapus: kendaraan masih dititipkan (transaksi aktif). Selesaikan dulu transaksi keluar.');
    redirect('kendaraan/detail.php?id=' . $id);
}

try {
    // Hapus riwayat transaksi selesai juga akan terhapus? cegah jika ada riwayat pembayaran (lindungi data keuangan)
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM transaksi t JOIN pembayaran p ON p.transaksi_id=t.id WHERE t.kendaraan_id=?");
    $stmt->execute([$id]);
    if ((int)$stmt->fetchColumn() > 0) {
        set_flash('error', 'Gagal hapus: kendaraan memiliki riwayat pembayaran. Data dipertahankan untuk laporan.');
        redirect('kendaraan/detail.php?id=' . $id);
    }
    $stmt = $pdo->prepare("DELETE FROM transaksi WHERE kendaraan_id=? AND status='selesai'");
    $stmt->execute([$id]);
    $stmt = $pdo->prepare("DELETE FROM kendaraan WHERE id=?");
    $stmt->execute([$id]);
    set_flash('success', 'Data kendaraan berhasil dihapus.');
    redirect('kendaraan/index.php');
} catch (PDOException $e) {
    set_flash('error', 'Gagal hapus: ' . $e->getMessage());
    redirect('kendaraan/detail.php?id=' . $id);
}
