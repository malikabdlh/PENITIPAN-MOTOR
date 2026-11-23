<?php
$title = 'Pembayaran';
$active = 'pembayaran';
require_once __DIR__ . '/../includes/header.php';

$dari = $_GET['dari'] ?? date('Y-m-d', strtotime('-30 days'));
$sampai = $_GET['sampai'] ?? date('Y-m-d');
$metode = $_GET['metode'] ?? '';

$sql = "SELECT p.*, t.no_tiket, t.biaya, k.nopol, k.nama_pemilik
        FROM pembayaran p
        JOIN transaksi t ON t.id=p.transaksi_id
        JOIN kendaraan k ON k.id=t.kendaraan_id
        WHERE DATE(p.waktu_bayar) BETWEEN ? AND ?";
$params = [$dari, $sampai];
if ($metode !== '') { $sql .= " AND p.metode=?"; $params[] = $metode; }
$sql .= " ORDER BY p.waktu_bayar DESC LIMIT 300";
$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$rows = $stmt->fetchAll();

$total = array_sum(array_column($rows, 'jumlah_bayar'));
?>
<div class="panel">
  <h3>Riwayat pembayaran (total: <?= rupiah($total) ?>)</h3>
  <form method="get" class="toolbar">
    <input type="date" name="dari" value="<?= e($dari) ?>"> s/d
    <input type="date" name="sampai" value="<?= e($sampai) ?>">
    <select name="metode">
      <option value="">Semua metode</option>
      <?php foreach (['cash','transfer','QRIS'] as $m): ?>
      <option value="<?= $m ?>" <?= $metode===$m?'selected':'' ?>><?= $m ?></option>
      <?php endforeach; ?>
    </select>
    <button class="btn btn-dark btn-small" type="submit">Filter</button>
  </form>
  <div style="overflow-x:auto">
  <table>
    <thead><tr><th>Waktu</th><th>Tiket</th><th>Nopol / Pemilik</th><th>Tagihan</th><th>Diterima</th><th>Kembali</th><th>Metode</th><th>Status</th><th>Aksi</th></tr></thead>
    <tbody>
    <?php if (!$rows): ?><tr><td colspan="9">Tidak ada pembayaran pada rentang ini.</td></tr><?php endif; ?>
    <?php foreach ($rows as $p): ?>
      <tr>
        <td><small><?= e($p['waktu_bayar']) ?></small></td>
        <td><b><?= e($p['no_tiket']) ?></b></td>
        <td><?= e($p['nopol']) ?><br><small><?= e($p['nama_pemilik']) ?></small></td>
        <td><?= rupiah($p['jumlah_bayar']) ?></td>
        <td><?= rupiah($p['uang_diterima']) ?></td>
        <td><?= rupiah($p['kembalian']) ?></td>
        <td><?= e($p['metode']) ?></td>
        <td><span class="badge b-<?= e($p['status']) ?>"><?= e($p['status']) ?></span></td>
        <td><a class="btn btn-grey btn-small" href="struk.php?id=<?= (int)$p['transaksi_id'] ?>">Struk</a></td>
      </tr>
    <?php endforeach; ?>
    </tbody>
  </table>
  </div>
</div>
<?php require_once __DIR__ . '/../includes/footer.php'; ?>
