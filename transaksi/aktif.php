<?php
$title = 'Sedang Dititip';
$active = 'aktif';
require_once __DIR__ . '/../includes/header.php';

$q = trim($_GET['q'] ?? '');
$sql = "SELECT t.*, k.nopol, k.merek, k.warna, k.nama_pemilik, s.kode_slot,
               GREATEST(0, TIMESTAMPDIFF(SECOND, t.waktu_masuk, NOW())) AS detik_berjalan
        FROM transaksi t JOIN kendaraan k ON k.id=t.kendaraan_id
        JOIN slot_parkir s ON s.id=t.slot_id WHERE t.status='aktif'";
$params = [];
if ($q !== '') { $sql .= " AND (t.no_tiket LIKE ? OR k.nopol LIKE ? OR k.nama_pemilik LIKE ?)"; $like="%$q%"; $params=[$like,$like,$like]; }
$sql .= " ORDER BY t.waktu_masuk DESC";
$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$rows = $stmt->fetchAll();
?>
<div class="panel">
  <h3>Sedang dititip (<?= count($rows) ?>)</h3>
  <p class="durasi-note" style="margin:-6px 0 10px">Durasi berjalan dihitung otomatis sejak waktu masuk dan diperbarui setiap detik.</p>
  <div class="toolbar">
    <form method="get" style="display:flex;gap:8px">
      <input type="text" name="q" placeholder="Cari tiket / nopol / pemilik..." value="<?= e($q) ?>" style="min-width:240px">
      <button class="btn btn-dark btn-small" type="submit">Cari</button>
    </form>
    <a class="btn btn-red btn-small" href="masuk.php">+ Motor masuk</a>
  </div>
  <div style="overflow-x:auto">
  <table>
    <thead><tr><th>Tiket</th><th>Nopol</th><th>Pemilik</th><th>Slot</th><th>Masuk</th><th>Durasi berjalan</th><th></th></tr></thead>
    <tbody>
    <?php if (!$rows): ?><tr><td colspan="7">Tidak ada data.</td></tr><?php endif; ?>
    <?php foreach ($rows as $r): ?>
      <tr>
        <td><b><?= e($r['no_tiket']) ?></b></td>
        <td><?= e($r['nopol']) ?><br><small style="color:#7F8C8D"><?= e($r['merek']) ?> <?= e($r['warna']) ?></small></td>
        <td><?= e($r['nama_pemilik']) ?></td>
        <td><span class="badge b-terisi"><?= e($r['kode_slot']) ?></span></td>
        <td><?= e($r['waktu_masuk']) ?></td>
        <td>
          <span class="durasi-live" data-durasi-live data-detik="<?= (int)$r['detik_berjalan'] ?>" title="Durasi sejak waktu masuk"><?= e(format_durasi_detik($r['detik_berjalan'])) ?></span>
          <span class="durasi-note">sejak waktu masuk</span>
        </td>
        <td><a class="btn btn-grey btn-small" href="keluar.php?tiket=<?= urlencode($r['no_tiket']) ?>">Proses</a></td>
      </tr>
    <?php endforeach; ?>
    </tbody>
  </table>
  </div>
</div>
<?php require_once __DIR__ . '/../includes/footer.php'; ?>
