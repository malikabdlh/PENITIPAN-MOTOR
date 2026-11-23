<?php
$title = 'Struk';
$active = 'pembayaran';
require_once __DIR__ . '/../includes/header.php';

$id = (int)($_GET['id'] ?? 0);
$stmt = $pdo->prepare("
  SELECT t.*, k.nopol, k.merek, k.warna, k.nama_pemilik, s.kode_slot,
         p.jumlah_bayar, p.uang_diterima, p.kembalian, p.metode, p.status AS bayar_status, p.waktu_bayar
  FROM transaksi t
  JOIN kendaraan k ON k.id=t.kendaraan_id
  JOIN slot_parkir s ON s.id=t.slot_id
  LEFT JOIN pembayaran p ON p.transaksi_id=t.id
  WHERE t.id=? LIMIT 1
");
$stmt->execute([$id]);
$d = $stmt->fetch();
if (!$d) { echo '<div class="panel">Transaksi tidak ditemukan.</div>'; require_once __DIR__.'/../includes/footer.php'; exit; }
?>
<div class="panel no-print" style="text-align:center">
  <button class="btn btn-dark" onclick="window.print()">Cetak</button>
  <a class="btn btn-grey" href="<?= e(base_url('transaksi/riwayat.php')) ?>">Riwayat</a>
</div>

<div class="struk">
  <h2>MOTOR PARK</h2>
  <h4>Bukti penitipan motor</h4>
  <hr>
  <table>
    <tr><td>No. tiket</td><td><b><?= e($d['no_tiket']) ?></b></td></tr>
    <tr><td>Nopol</td><td><?= e($d['nopol']) ?> (<?= e($d['merek']) ?> / <?= e($d['warna']) ?>)</td></tr>
    <tr><td>Pemilik</td><td><?= e($d['nama_pemilik']) ?></td></tr>
    <tr><td>Slot</td><td><?= e($d['kode_slot']) ?></td></tr>
    <tr><td>Masuk</td><td><?= e($d['waktu_masuk']) ?></td></tr>
    <tr><td>Keluar</td><td><?= e($d['waktu_keluar'] ?? '-') ?></td></tr>
    <tr><td>Durasi</td><td><?= e(format_durasi($d['durasi_menit'] ?? 0)) ?></td></tr>
    <tr><td>Metode</td><td><?= e($d['metode'] ?? '-') ?><?= (($d['metode'] ?? '') === 'QRIS' ? ' (simulasi)' : '') ?></td></tr>
    <tr><td>Status</td><td><?= e($d['bayar_status'] ?? $d['status']) ?></td></tr>
  </table>
  <hr>
  <table>
    <tr><td>Total</td><td class="total"><?= rupiah($d['jumlah_bayar'] ?? $d['biaya']) ?></td></tr>
    <tr><td>Diterima</td><td><?= rupiah($d['uang_diterima'] ?? 0) ?></td></tr>
    <tr><td>Kembalian</td><td><?= rupiah($d['kembalian'] ?? 0) ?></td></tr>
  </table>
  <hr>
  <p style="text-align:center;font-size:12px">Terima kasih. Simpan struk ini sebagai bukti pengambilan.<br><?= e($d['waktu_bayar'] ?? date('Y-m-d H:i:s')) ?></p>
</div>
<?php require_once __DIR__ . '/../includes/footer.php'; ?>
