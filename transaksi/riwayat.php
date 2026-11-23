<?php
$title = 'Riwayat Transaksi';
$active = 'riwayat';
require_once __DIR__ . '/../includes/header.php';

$q = trim($_GET['q'] ?? '');
$tgl = $_GET['tgl'] ?? '';
$sql = "SELECT t.*, k.nopol, k.nama_pemilik, s.kode_slot, p.metode, p.status AS bayar_status
        FROM transaksi t
        JOIN kendaraan k ON k.id=t.kendaraan_id
        JOIN slot_parkir s ON s.id=t.slot_id
        LEFT JOIN pembayaran p ON p.transaksi_id=t.id
        WHERE t.status='selesai'";
$params = [];
if ($q !== '') { $sql .= " AND (t.no_tiket LIKE ? OR k.nopol LIKE ?)"; $like="%$q%"; $params[]=$like; $params[]=$like; }
if ($tgl !== '') { $sql .= " AND DATE(t.waktu_keluar)=?"; $params[]=$tgl; }
$sql .= " ORDER BY t.waktu_keluar DESC LIMIT 200";
$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$rows = $stmt->fetchAll();
?>
<div class="panel">
  <h3>Riwayat transaksi</h3>
  <form method="get" class="toolbar">
    <input type="text" name="q" placeholder="Tiket / nopol..." value="<?= e($q) ?>">
    <input type="date" name="tgl" value="<?= e($tgl) ?>">
    <button class="btn btn-dark btn-small" type="submit">Filter</button>
    <?php if ($q !== '' || $tgl !== ''): ?><a class="btn btn-grey btn-small" href="riwayat.php">Reset</a><?php endif; ?>
  </form>
  <div style="overflow-x:auto">
  <table>
    <thead><tr><th>Tiket</th><th>Nopol</th><th>Slot</th><th>Masuk → Keluar</th><th>Durasi</th><th>Biaya</th><th>Bayar</th><th>Aksi</th></tr></thead>
    <tbody>
    <?php if (!$rows): ?><tr><td colspan="8">Belum ada riwayat.</td></tr><?php endif; ?>
    <?php foreach ($rows as $r): ?>
      <tr>
        <td><b><?= e($r['no_tiket']) ?></b></td>
        <td><?= e($r['nopol']) ?><br><small><?= e($r['nama_pemilik']) ?></small></td>
        <td><?= e($r['kode_slot']) ?></td>
        <td><small><?= e($r['waktu_masuk']) ?><br>→ <?= e($r['waktu_keluar']) ?></small></td>
        <td><?= e(format_durasi($r['durasi_menit'] ?? 0)) ?></td>
        <td><?= rupiah($r['biaya']) ?></td>
        <td><?= e($r['metode'] ?? '-') ?> <span class="badge b-<?= e($r['bayar_status'] ?? 'lunas') ?>"><?= e($r['bayar_status'] ?? '-') ?></span></td>
        <td><a class="btn btn-grey btn-small" href="../pembayaran/struk.php?id=<?= (int)$r['id'] ?>">Struk</a></td>
      </tr>
    <?php endforeach; ?>
    </tbody>
  </table>
  </div>
</div>
<?php require_once __DIR__ . '/../includes/footer.php'; ?>
