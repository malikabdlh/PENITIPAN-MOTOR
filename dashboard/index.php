<?php
$title = 'Dashboard';
$active = 'dashboard';
require_once __DIR__ . '/../includes/header.php';

// Angka ringkasan, langsung dari database
$total_aktif   = (int)$pdo->query("SELECT COUNT(*) FROM transaksi WHERE status='aktif'")->fetchColumn();
$masuk_hari    = (int)$pdo->query("SELECT COUNT(*) FROM transaksi WHERE DATE(waktu_masuk)=CURDATE()")->fetchColumn();
$keluar_hari   = (int)$pdo->query("SELECT COUNT(*) FROM transaksi WHERE status='selesai' AND DATE(waktu_keluar)=CURDATE()")->fetchColumn();
$pendapatan    = (int)$pdo->query("SELECT COALESCE(SUM(jumlah_bayar),0) FROM pembayaran WHERE status='lunas' AND DATE(waktu_bayar)=CURDATE()")->fetchColumn();
$slot_tersedia = (int)$pdo->query("SELECT COUNT(*) FROM slot_parkir WHERE status='tersedia'")->fetchColumn();
$slot_total    = (int)$pdo->query("SELECT COUNT(*) FROM slot_parkir")->fetchColumn();

// Motor yang masih diparkir, terbaru dulu
$recent = $pdo->query("
  SELECT t.*, k.nopol, k.nama_pemilik, s.kode_slot,
         GREATEST(0, TIMESTAMPDIFF(SECOND, t.waktu_masuk, NOW())) AS detik_berjalan
  FROM transaksi t
  JOIN kendaraan k ON k.id = t.kendaraan_id
  JOIN slot_parkir s ON s.id = t.slot_id
  WHERE t.status='aktif'
  ORDER BY t.waktu_masuk DESC LIMIT 8
")->fetchAll();

// Data grafik 7 hari terakhir
$labels = []; $dMasuk = []; $dKeluar = []; $dUang = [];
for ($i = 6; $i >= 0; $i--) {
    $tgl = date('Y-m-d', strtotime("-$i days"));
    $labels[] = date('d/m', strtotime($tgl));
    $s = $pdo->prepare("SELECT COUNT(*) FROM transaksi WHERE DATE(waktu_masuk)=?");
    $s->execute([$tgl]); $dMasuk[] = (int)$s->fetchColumn();
    $s = $pdo->prepare("SELECT COUNT(*) FROM transaksi WHERE status='selesai' AND DATE(waktu_keluar)=?");
    $s->execute([$tgl]); $dKeluar[] = (int)$s->fetchColumn();
    $s = $pdo->prepare("SELECT COALESCE(SUM(jumlah_bayar),0) FROM pembayaran WHERE status='lunas' AND DATE(waktu_bayar)=?");
    $s->execute([$tgl]); $dUang[] = (int)$s->fetchColumn();
}
?>

<div class="cards">
  <div class="card"><div class="label">Dititipkan</div><div class="value"><?= $total_aktif ?></div><div class="sub">motor di parkiran</div></div>
  <div class="card"><div class="label">Masuk hari ini</div><div class="value"><?= $masuk_hari ?></div><div class="sub">transaksi masuk</div></div>
  <div class="card"><div class="label">Keluar hari ini</div><div class="value"><?= $keluar_hari ?></div><div class="sub">transaksi selesai</div></div>
  <div class="card"><div class="label">Pendapatan hari ini</div><div class="value" style="font-size:20px"><?= rupiah($pendapatan) ?></div><div class="sub">pembayaran lunas</div></div>
  <div class="card"><div class="label">Slot tersedia</div><div class="value"><?= $slot_tersedia ?><span style="font-size:14px;color:#7F8C8D"> / <?= $slot_total ?></span></div><div class="sub"><?= $slot_total - $slot_tersedia ?> terisi</div></div>
</div>

<div class="grid2">
  <div class="panel">
    <h3>Transaksi 7 hari terakhir</h3>
    <canvas id="chTransaksi" height="220"></canvas>
  </div>
  <div class="panel">
    <h3>Pendapatan 7 hari terakhir</h3>
    <canvas id="chUang" height="220"></canvas>
  </div>
</div>

<div class="panel">
  <h3>Terakhir dititipkan</h3>
  <div class="toolbar">
    <a class="btn btn-red btn-small" href="<?= e(base_url('transaksi/masuk.php')) ?>">+ Motor masuk</a>
    <a class="btn btn-grey btn-small" href="<?= e(base_url('transaksi/aktif.php')) ?>">Lihat semua</a>
  </div>
  <div style="overflow-x:auto">
  <table>
    <thead><tr><th>Tiket</th><th>Nopol</th><th>Pemilik</th><th>Slot</th><th>Masuk</th><th>Durasi berjalan</th><th></th></tr></thead>
    <tbody>
    <?php if (!$recent): ?><tr><td colspan="7">Belum ada motor yang dititipkan.</td></tr><?php endif; ?>
    <?php foreach ($recent as $r): ?>
      <tr>
        <td><b><?= e($r['no_tiket']) ?></b></td>
        <td><?= e($r['nopol']) ?></td>
        <td><?= e($r['nama_pemilik']) ?></td>
        <td><span class="badge b-terisi"><?= e($r['kode_slot']) ?></span></td>
        <td><?= e($r['waktu_masuk']) ?></td>
        <td><span class="durasi-live" data-durasi-live data-detik="<?= (int)$r['detik_berjalan'] ?>"><?= e(format_durasi_detik($r['detik_berjalan'])) ?></span></td>
        <td><a class="btn btn-grey btn-small" href="<?= e(base_url('transaksi/keluar.php?tiket=' . urlencode($r['no_tiket']))) ?>">Proses</a></td>
      </tr>
    <?php endforeach; ?>
    </tbody>
  </table>
  </div>
</div>

<script>
new Chart(document.getElementById('chTransaksi'), {
  type: 'bar',
  data: { labels: <?= json_encode($labels) ?>,
    datasets: [
      {label:'Masuk', data: <?= json_encode($dMasuk) ?>, backgroundColor:'#C0392B'},
      {label:'Keluar', data: <?= json_encode($dKeluar) ?>, backgroundColor:'#BDC3C7'}
    ]},
  options: {responsive:true, plugins:{legend:{position:'bottom'}}}
});
new Chart(document.getElementById('chUang'), {
  type: 'line',
  data: { labels: <?= json_encode($labels) ?>,
    datasets: [{label:'Pendapatan (Rp)', data: <?= json_encode($dUang) ?>, borderColor:'#1E8449', backgroundColor:'rgba(30,132,73,.08)', fill:true, tension:.3}]},
  options: {responsive:true, plugins:{legend:{position:'bottom'}}}
});
</script>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
