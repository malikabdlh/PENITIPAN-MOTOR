<?php
$title = 'Detail Kendaraan';
$active = 'kendaraan';
require_once __DIR__ . '/../includes/header.php';

$id = (int)($_GET['id'] ?? 0);
$stmt = $pdo->prepare("SELECT * FROM kendaraan WHERE id=? LIMIT 1");
$stmt->execute([$id]);
$k = $stmt->fetch();
if (!$k) { echo '<div class="panel">Data tidak ditemukan. <a href="index.php">Kembali</a></div>'; require_once __DIR__.'/../includes/footer.php'; exit; }

// 10 transaksi terakhir motor ini
$trx = $pdo->prepare("
  SELECT t.*, s.kode_slot FROM transaksi t
  JOIN slot_parkir s ON s.id=t.slot_id
  WHERE t.kendaraan_id=? ORDER BY t.id DESC LIMIT 10
");
$trx->execute([$id]);
$riwayat = $trx->fetchAll();
?>
<div class="panel">
  <h3><?= e($k['nopol']) ?> &mdash; <?= e($k['nama_pemilik']) ?></h3>
  <table>
    <tr><th width="180">Merek</th><td><?= e($k['merek'] ?: '-') ?></td></tr>
    <tr><th>Warna</th><td><?= e($k['warna'] ?: '-') ?></td></tr>
    <tr><th>Pemilik</th><td><?= e($k['nama_pemilik']) ?></td></tr>
    <tr><th>No. telp</th><td><?= e($k['no_telp'] ?: '-') ?></td></tr>
    <tr><th>Kondisi</th><td><?= e($k['catatan_kondisi'] ?: '-') ?></td></tr>
  </table>
  <br>
  <a class="btn btn-dark btn-small" href="edit.php?id=<?= (int)$k['id'] ?>">Ubah</a>
  <a class="btn btn-grey btn-small" href="index.php">Kembali</a>
  <form method="post" action="hapus.php" style="display:inline" onsubmit="return confirm('Hapus data ini?')">
    <?= csrf_field() ?>
    <input type="hidden" name="id" value="<?= (int)$k['id'] ?>">
    <button class="btn btn-grey btn-small" type="submit">Hapus</button>
  </form>
</div>

<div class="panel">
  <h3>Riwayat penitipan</h3>
  <table>
    <thead><tr><th>Tiket</th><th>Slot</th><th>Masuk</th><th>Keluar</th><th>Status</th><th>Biaya</th></tr></thead>
    <tbody>
    <?php if (!$riwayat): ?><tr><td colspan="6">Belum ada transaksi.</td></tr><?php endif; ?>
    <?php foreach ($riwayat as $t): ?>
      <tr>
        <td><?= e($t['no_tiket']) ?></td><td><?= e($t['kode_slot']) ?></td>
        <td><?= e($t['waktu_masuk']) ?></td><td><?= e($t['waktu_keluar'] ?? '-') ?></td>
        <td><span class="badge b-<?= e($t['status']) ?>"><?= e($t['status']) ?></span></td>
        <td><?= rupiah($t['biaya']) ?></td>
      </tr>
    <?php endforeach; ?>
    </tbody>
  </table>
</div>
<?php require_once __DIR__ . '/../includes/footer.php'; ?>
