<?php
$title = 'Laporan';
$active = 'laporan';
require_once __DIR__ . '/../includes/header.php';

$dari = $_GET['dari'] ?? date('Y-m-d', strtotime('-30 days'));
$sampai = $_GET['sampai'] ?? date('Y-m-d');

$stmt = $pdo->prepare("SELECT COUNT(*) FROM transaksi WHERE DATE(waktu_masuk) BETWEEN ? AND ?");
$stmt->execute([$dari, $sampai]); $jMasuk = (int)$stmt->fetchColumn();
$stmt = $pdo->prepare("SELECT COUNT(*) FROM transaksi WHERE status='selesai' AND DATE(waktu_keluar) BETWEEN ? AND ?");
$stmt->execute([$dari, $sampai]); $jKeluar = (int)$stmt->fetchColumn();
$stmt = $pdo->prepare("SELECT COALESCE(SUM(jumlah_bayar),0) FROM pembayaran WHERE status='lunas' AND DATE(waktu_bayar) BETWEEN ? AND ?");
$stmt->execute([$dari, $sampai]); $pendapatan = (int)$stmt->fetchColumn();
$stmt = $pdo->prepare("SELECT COUNT(*) FROM pembayaran WHERE status='lunas' AND DATE(waktu_bayar) BETWEEN ? AND ?");
$stmt->execute([$dari, $sampai]); $jBayar = (int)$stmt->fetchColumn();

// Rincian per hari untuk grafik
$labels=[]; $rMasuk=[]; $rUang=[];
$d1 = new DateTime($dari); $d2 = new DateTime($sampai);
$diff = min(62, (int)$d1->diff($d2)->days + 1);
for ($i=0; $i<$diff; $i++) {
    $tgl = date('Y-m-d', strtotime("$dari +$i days"));
    $labels[] = date('d/m', strtotime($tgl));
    $s = $pdo->prepare("SELECT COUNT(*) FROM transaksi WHERE DATE(waktu_masuk)=?"); $s->execute([$tgl]); $rMasuk[]=(int)$s->fetchColumn();
    $s = $pdo->prepare("SELECT COALESCE(SUM(jumlah_bayar),0) FROM pembayaran WHERE status='lunas' AND DATE(waktu_bayar)=?"); $s->execute([$tgl]); $rUang[]=(int)$s->fetchColumn();
}

$stmt = $pdo->prepare("
  SELECT t.*, k.nopol, k.nama_pemilik, s.kode_slot FROM transaksi t
  JOIN kendaraan k ON k.id=t.kendaraan_id JOIN slot_parkir s ON s.id=t.slot_id
  WHERE DATE(t.waktu_masuk) BETWEEN ? AND ? ORDER BY t.waktu_masuk DESC LIMIT 200
");
$stmt->execute([$dari, $sampai]);
$detail = $stmt->fetchAll();
?>

<div class="panel no-print">
  <h3>Filter laporan</h3>
  <form method="get" class="toolbar">
    <input type="date" name="dari" value="<?= e($dari) ?>">
    <span style="color:#7F8C8D">s/d</span>
    <input type="date" name="sampai" value="<?= e($sampai) ?>">
    <button class="btn btn-dark btn-small" type="submit">Tampilkan</button>
    <a class="btn btn-grey btn-small" href="export.php?dari=<?= urlencode($dari) ?>&amp;sampai=<?= urlencode($sampai) ?>">Export Excel</a>
    <button class="btn btn-grey btn-small" type="button" onclick="window.print()">Cetak / Simpan PDF</button>
  </form>
  <p style="font-size:12.5px;color:#7F8C8D;margin:0">Periode <?= e($dari) ?> s/d <?= e($sampai) ?>. Pendapatan dihitung dari pembayaran lunas.</p>
</div>

<div class="cards">
  <div class="card"><div class="label">Masuk</div><div class="value"><?= $jMasuk ?></div><div class="sub">motor</div></div>
  <div class="card"><div class="label">Keluar</div><div class="value"><?= $jKeluar ?></div><div class="sub">selesai</div></div>
  <div class="card"><div class="label">Transaksi lunas</div><div class="value"><?= $jBayar ?></div><div class="sub">pembayaran</div></div>
  <div class="card"><div class="label">Pendapatan</div><div class="value" style="font-size:20px"><?= rupiah($pendapatan) ?></div></div>
</div>

<div class="panel">
  <h3>Grafik periode ini</h3>
  <canvas id="chLap" height="120"></canvas>
</div>

<div class="panel">
  <h3>Detail transaksi (<?= count($detail) ?>)</h3>
  <div style="overflow-x:auto">
  <table>
    <thead><tr><th>Tiket</th><th>Nopol</th><th>Slot</th><th>Masuk</th><th>Keluar</th><th>Status</th><th>Biaya</th></tr></thead>
    <tbody>
    <?php if (!$detail): ?><tr><td colspan="7">Tidak ada data.</td></tr><?php endif; ?>
    <?php foreach ($detail as $t): ?>
      <tr><td><?= e($t['no_tiket']) ?></td><td><?= e($t['nopol']) ?><br><small style="color:#7F8C8D"><?= e($t['nama_pemilik']) ?></small></td>
      <td><?= e($t['kode_slot']) ?></td><td><small><?= e($t['waktu_masuk']) ?></small></td><td><small><?= e($t['waktu_keluar'] ?? '-') ?></small></td>
      <td><span class="badge b-<?= e($t['status']) ?>"><?= e($t['status']) ?></span></td><td><?= rupiah($t['biaya']) ?></td></tr>
    <?php endforeach; ?>
    </tbody>
  </table>
  </div>
</div>

<script>
new Chart(document.getElementById('chLap'), {
  type:'bar',
  data:{labels:<?= json_encode($labels) ?>, datasets:[
    {label:'Masuk', data:<?= json_encode($rMasuk) ?>, backgroundColor:'#C0392B', yAxisID:'y'},
    {label:'Pendapatan (Rp)', data:<?= json_encode($rUang) ?>, type:'line', borderColor:'#1E8449', backgroundColor:'rgba(30,132,73,.08)', fill:true, yAxisID:'y1'}
  ]},
  options:{responsive:true, plugins:{legend:{position:'bottom'}},
    scales:{y:{position:'left'}, y1:{position:'right', grid:{drawOnChartArea:false}}}}
});
</script>
<?php require_once __DIR__ . '/../includes/footer.php'; ?>
