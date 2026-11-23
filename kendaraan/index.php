<?php
$title = 'Data Kendaraan';
$active = 'kendaraan';
require_once __DIR__ . '/../includes/header.php';

$q = trim($_GET['q'] ?? '');
if ($q !== '') {
    $like = "%$q%";
    $stmt = $pdo->prepare("
      SELECT k.*,
        (SELECT no_tiket FROM transaksi t WHERE t.kendaraan_id=k.id ORDER BY t.id DESC LIMIT 1) AS tiket_terakhir,
        (SELECT COUNT(*) FROM transaksi t WHERE t.kendaraan_id=k.id AND t.status='aktif') AS sedang_aktif
      FROM kendaraan k
      WHERE k.nopol LIKE ? OR k.nama_pemilik LIKE ?
         OR k.id IN (SELECT kendaraan_id FROM transaksi WHERE no_tiket LIKE ?)
      ORDER BY k.id DESC LIMIT 200
    ");
    $stmt->execute([$like, $like, $like]);
} else {
    $stmt = $pdo->query("
      SELECT k.*,
        (SELECT no_tiket FROM transaksi t WHERE t.kendaraan_id=k.id ORDER BY t.id DESC LIMIT 1) AS tiket_terakhir,
        (SELECT COUNT(*) FROM transaksi t WHERE t.kendaraan_id=k.id AND t.status='aktif') AS sedang_aktif
      FROM kendaraan k ORDER BY k.id DESC LIMIT 200
    ");
}
$rows = $stmt->fetchAll();
?>
<div class="panel">
  <h3>Data kendaraan</h3>
  <div class="toolbar">
    <form method="get" style="display:flex;gap:8px;flex-wrap:wrap">
      <input type="text" name="q" placeholder="Cari nopol / pemilik / tiket..." value="<?= e($q) ?>" style="min-width:240px">
      <button class="btn btn-dark btn-small" type="submit">Cari</button>
      <?php if ($q !== ''): ?><a class="btn btn-grey btn-small" href="index.php">Reset</a><?php endif; ?>
    </form>
    <a class="btn btn-red btn-small" href="tambah.php">+ Tambah</a>
  </div>
  <div style="overflow-x:auto">
  <table>
    <thead><tr><th>ID</th><th>Nopol</th><th>Merek / Warna</th><th>Pemilik</th><th>Telp</th><th>Status</th><th></th></tr></thead>
    <tbody>
    <?php if (!$rows): ?><tr><td colspan="7">Data tidak ditemukan.</td></tr><?php endif; ?>
    <?php foreach ($rows as $k): ?>
      <tr>
        <td><?= (int)$k['id'] ?></td>
        <td><b><?= e($k['nopol']) ?></b><br><small style="color:#7F8C8D"><?= e($k['tiket_terakhir'] ?? '-') ?></small></td>
        <td><?= e($k['merek'] ?: '-') ?> / <?= e($k['warna'] ?: '-') ?></td>
        <td><?= e($k['nama_pemilik']) ?></td>
        <td><?= e($k['no_telp'] ?: '-') ?></td>
        <td><?= ((int)$k['sedang_aktif'] > 0) ? '<span class="badge b-aktif">Dititipkan</span>' : '<span class="badge">Di luar</span>' ?></td>
        <td style="white-space:nowrap">
          <a class="btn btn-grey btn-small" href="detail.php?id=<?= (int)$k['id'] ?>">Detail</a>
          <a class="btn btn-grey btn-small" href="edit.php?id=<?= (int)$k['id'] ?>">Ubah</a>
        </td>
      </tr>
    <?php endforeach; ?>
    </tbody>
  </table>
  </div>
</div>
<?php require_once __DIR__ . '/../includes/footer.php'; ?>
