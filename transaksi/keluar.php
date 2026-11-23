<?php
$title = 'Motor Keluar';
$active = 'keluar';
require_once __DIR__ . '/../includes/header.php';

$tarif = get_tarif_aktif($pdo);
$q = trim($_GET['tiket'] ?? $_GET['q'] ?? '');
$trx = null; $preview = null;
$error = '';

if ($q !== '') {
    $stmt = $pdo->prepare("
      SELECT t.*, k.nopol, k.merek, k.warna, k.nama_pemilik, k.no_telp, s.kode_slot,
             GREATEST(0, TIMESTAMPDIFF(SECOND, t.waktu_masuk, NOW())) AS detik_berjalan
      FROM transaksi t
      JOIN kendaraan k ON k.id=t.kendaraan_id
      JOIN slot_parkir s ON s.id=t.slot_id
      WHERE (t.no_tiket=? OR k.nopol=?) AND t.status='aktif' LIMIT 1
    ");
    $nopolQ = strtoupper(preg_replace('/\s+/', '', $q));
    $stmt->execute([$q, $nopolQ]);
    $trx = $stmt->fetch();
    if (!$trx) $error = "Tidak ketemu titipan aktif untuk \"$q\". Coba cek di menu Sedang dititip.";
    else {
        $detik = max(0, (int)$trx['detik_berjalan']);
        $menit = max(1, intdiv($detik, 60));
        $biaya = hitung_biaya($menit, $tarif['tarif_per_jam'], $tarif['tarif_per_hari']);
        $preview = ['detik' => $detik, 'menit' => $menit, 'biaya' => $biaya];
    }
}

// Simpan pembayaran + selesaikan transaksi
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['proses_keluar'])) {
    verify_csrf();
    $trx_id = (int)($_POST['transaksi_id'] ?? 0);
    $metode = $_POST['metode'] ?? 'cash';
    $uang = (int)($_POST['uang_diterima'] ?? 0);
    if (!in_array($metode, ['cash','transfer','QRIS'], true)) $error = 'Metode tidak valid.';
    else {
        try {
            $pdo->beginTransaction();
            $stmt = $pdo->prepare("
              SELECT t.*, k.nopol,
                     GREATEST(0, TIMESTAMPDIFF(SECOND, t.waktu_masuk, NOW())) AS detik_berjalan
              FROM transaksi t JOIN kendaraan k ON k.id=t.kendaraan_id
              WHERE t.id=? FOR UPDATE
            ");
            $stmt->execute([$trx_id]);
            $t = $stmt->fetch();
            if (!$t || $t['status'] !== 'aktif') throw new Exception('Transaksi sudah selesai / tidak valid.');

            $menit = max(1, intdiv((int)$t['detik_berjalan'], 60));
            $biaya = hitung_biaya($menit, $tarif['tarif_per_jam'], $tarif['tarif_per_hari']);

            if ($metode === 'cash') {
                if ($uang < $biaya) throw new Exception('Uang kurang dari tagihan (' . rupiah($biaya) . ').');
                $kembalian = $uang - $biaya;
            } else {
                $uang = $biaya; $kembalian = 0; // transfer / QRIS dianggap pas
            }

            $stmt = $pdo->prepare("UPDATE transaksi SET waktu_keluar=NOW(), durasi_menit=?, biaya=?, status='selesai', petugas_keluar_id=? WHERE id=?");
            $stmt->execute([$menit, $biaya, $_SESSION['user']['id'], $trx_id]);

            $stmt = $pdo->prepare("INSERT INTO pembayaran (transaksi_id, jumlah_bayar, uang_diterima, kembalian, metode, status, petugas_id) VALUES (?,?,?,?,?,'lunas',?)");
            $stmt->execute([$trx_id, $biaya, $uang, $kembalian, $metode, $_SESSION['user']['id']]);

            $stmt = $pdo->prepare("UPDATE slot_parkir SET status='tersedia' WHERE id=?");
            $stmt->execute([$t['slot_id']]);

            $pdo->commit();
            $pesan = ($metode === 'QRIS')
                ? 'Pembayaran QRIS (simulasi) berhasil. Transaksi ' . $t['no_tiket'] . ' selesai.'
                : 'Transaksi ' . $t['no_tiket'] . ' selesai. Kembalian: ' . rupiah($kembalian);
            set_flash('success', $pesan);
            redirect('pembayaran/struk.php?id=' . $trx_id);
        } catch (Exception $e) {
            if ($pdo->inTransaction()) $pdo->rollBack();
            $error = $e->getMessage();
        }
    }
}
?>

<div class="panel">
  <h3>Cari kendaraan keluar</h3>
  <form method="get" class="toolbar">
    <input type="text" name="tiket" placeholder="No. tiket / nopol..." value="<?= e($q) ?>" style="min-width:260px">
    <button class="btn btn-dark btn-small" type="submit">Cari</button>
    <a class="btn btn-grey btn-small" href="aktif.php">Titipan aktif</a>
  </form>
  <?php if ($error): ?><div class="alert alert-error"><?= e($error) ?></div><?php endif; ?>
  <p style="font-size:12.5px;color:#7F8C8D;margin:0">Tarif: <b><?= e($tarif['nama_tarif']) ?></b> &mdash; <?= rupiah($tarif['tarif_per_jam']) ?>/jam, <?= rupiah($tarif['tarif_per_hari']) ?>/hari</p>
</div>

<?php if ($trx && $preview): ?>
<div class="grid2">
  <div class="panel">
    <h3>Detail kendaraan</h3>
    <table>
      <tr><th>Tiket</th><td><b><?= e($trx['no_tiket']) ?></b></td></tr>
      <tr><th>Nopol</th><td><?= e($trx['nopol']) ?> (<?= e($trx['merek']) ?> / <?= e($trx['warna']) ?>)</td></tr>
      <tr><th>Pemilik</th><td><?= e($trx['nama_pemilik']) ?> (<?= e($trx['no_telp']) ?>)</td></tr>
      <tr><th>Slot</th><td><?= e($trx['kode_slot']) ?></td></tr>
      <tr><th>Masuk</th><td><?= e($trx['waktu_masuk']) ?></td></tr>
      <tr><th>Durasi berjalan</th><td>
        <span class="durasi-live" id="durasiBerjalan" data-durasi-live data-detik="<?= (int)$preview['detik'] ?>" title="Diperbarui otomatis setiap detik"><?= e(format_durasi_detik($preview['detik'])) ?></span>
        <span class="durasi-note" id="durasiMenit"><?= (int)$preview['menit'] ?> menit berjalan (<?= (int)$preview['detik'] ?> detik)</span>
      </td></tr>
      <tr><th>Biaya</th><td style="font-size:19px;font-weight:700;color:#C0392B">
        <span id="biayaPreview"><?= rupiah($preview['biaya']) ?></span>
        <span class="durasi-note" style="font-weight:400;color:#7F8C8D">estimasi otomatis mengikuti durasi</span>
      </td></tr>
    </table>
  </div>
  <div class="panel">
    <h3>Pembayaran</h3>
    <form method="post" id="formBayar">
      <?= csrf_field() ?>
      <input type="hidden" name="transaksi_id" value="<?= (int)$trx['id'] ?>">
      <input type="hidden" name="proses_keluar" value="1">
      <label>Metode</label>
      <select name="metode" id="metode" required>
        <option value="cash">Cash</option>
        <option value="transfer">Transfer</option>
        <option value="QRIS">QRIS (simulasi)</option>
      </select>
      <br><br>
      <div id="boxCash">
        <label>Uang diterima (Rp)</label>
        <input type="number" name="uang_diterima" id="uang" min="0" step="500" value="<?= (int)$preview['biaya'] ?>">
        <p style="font-size:13px">Kembalian: <b id="kembalian"><?= rupiah(0) ?></b></p>
      </div>
      <div id="boxNonCash" style="display:none;background:#F7F8F9;border:1px solid #E3E6E9;padding:10px;border-radius:8px;font-size:13px">
        Transfer dianggap pas (<span id="nonCashNominal"><?= rupiah($preview['biaya']) ?></span>). Pastikan dana sudah masuk sebelum menyelesaikan.
      </div>
      <div id="boxQris" style="display:none">
        <div class="qris-box">
          <div style="font-size:13px;font-weight:600">Pembayaran QRIS</div>
          <div class="qris-note">Mode simulasi. Tidak terhubung ke payment gateway.</div>
          <div class="qr" id="qrisGambar" aria-label="QR simulasi"></div>
          <div style="font-size:13px">Nominal <b id="qrisNominal"><?= rupiah($preview['biaya']) ?></b></div>
          <div class="qris-note">Sisa waktu simulasi <span class="qris-timer" id="qrisTimer">05:00</span></div>
          <div class="qris-note" id="qrisKedaluwarsa" style="display:none;color:#C0392B">Simulasi kedaluwarsa. Pilih metode lain atau muat ulang halaman.</div>
        </div>
      </div>
      <br>
      <button class="btn btn-red" type="submit" id="btnSubmit">Selesaikan &amp; cetak struk</button>
    </form>
  </div>
</div>
<script>
document.addEventListener('DOMContentLoaded', function () {
  var perJam = <?= (int)$tarif['tarif_per_jam'] ?>;
  var perHari = <?= (int)$tarif['tarif_per_hari'] ?>;
  var detikAwal = <?= (int)$preview['detik'] ?>;
  var mulai = Date.now();
  var biaya = <?= (int)$preview['biaya'] ?>;
  var uangDisentuh = false;

  var metode = document.getElementById('metode');
  var uang = document.getElementById('uang');
  var biayaEl = document.getElementById('biayaPreview');
  var nonCashEl = document.getElementById('nonCashNominal');
  var menitEl = document.getElementById('durasiMenit');
  var kembalianEl = document.getElementById('kembalian');
  var qrisNominalEl = document.getElementById('qrisNominal');
  var btnSubmit = document.getElementById('btnSubmit');
  var qrisMulai = false, qrisSisa = 300;
  var qrSeed = <?= json_encode($trx['no_tiket'] . '|' . $preview['biaya']) ?>;

  function detikSekarang() {
    return detikAwal + Math.floor((Date.now() - mulai) / 1000);
  }

  // Gambar pola QR tiruan (hanya untuk tampilan simulasi, tidak bisa discan)
  function drawQr(seed) {
    var el = document.getElementById('qrisGambar');
    if (!el) return;
    var n = 25, cells = [];
    var h = 2166136261;
    for (var i = 0; i < seed.length; i++) {
      h ^= seed.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    function acak() {
      h ^= h << 13; h >>>= 0;
      h ^= h >> 17;
      h ^= h << 5; h >>>= 0;
      return h;
    }
    for (var y = 0; y < n; y++) {
      for (var x = 0; x < n; x++) cells.push((acak() & 1) ? 1 : 0);
    }
    function finder(ox, oy) {
      for (var fy = 0; fy < 7; fy++) {
        for (var fx = 0; fx < 7; fx++) {
          var on = (fx === 0 || fx === 6 || fy === 0 || fy === 6 || (fx >= 2 && fx <= 4 && fy >= 2 && fy <= 4)) ? 1 : 0;
          cells[(oy + fy) * n + (ox + fx)] = on;
        }
      }
    }
    finder(0, 0); finder(n - 7, 0); finder(0, n - 7);
    var html = '';
    for (var j = 0; j < cells.length; j++) html += '<i class="' + (cells[j] ? 'on' : '') + '"></i>';
    el.innerHTML = html;
  }

  function mulaiQris() {
    if (qrisMulai) return;
    qrisMulai = true;
    var timer = document.getElementById('qrisTimer');
    var habis = document.getElementById('qrisKedaluwarsa');
    var t = setInterval(function () {
      qrisSisa--;
      var m = Math.floor(qrisSisa / 60), s = qrisSisa % 60;
      timer.textContent = (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
      if (qrisSisa <= 0) {
        clearInterval(t);
        habis.style.display = '';
      }
    }, 1000);
  }

  function upd() {
    var m = metode.value;
    document.getElementById('boxCash').style.display = m === 'cash' ? '' : 'none';
    document.getElementById('boxNonCash').style.display = m === 'transfer' ? '' : 'none';
    document.getElementById('boxQris').style.display = m === 'QRIS' ? '' : 'none';
    btnSubmit.textContent = m === 'QRIS' ? 'Simulasikan pembayaran berhasil' : 'Selesaikan & cetak struk';
    if (m === 'QRIS') mulaiQris();
    var k = parseInt(uang.value || 0, 10) - biaya;
    if (isNaN(k)) k = 0;
    kembalianEl.textContent = 'Rp ' + k.toLocaleString('id-ID');
  }

  // Biaya mengikuti durasi berjalan (dihitung ulang tiap detik, berubah tiap jam).
  function tick() {
    var detik = detikSekarang();
    menitEl.textContent = Math.floor(detik / 60) + ' menit berjalan (' + detik + ' detik)';
    var b = hitungBiayaParkir(detik, perJam, perHari);
    if (b !== biaya) {
      biaya = b;
      biayaEl.textContent = 'Rp ' + b.toLocaleString('id-ID');
      nonCashEl.textContent = 'Rp ' + b.toLocaleString('id-ID');
      if (qrisNominalEl) qrisNominalEl.textContent = 'Rp ' + b.toLocaleString('id-ID');
      if (!uangDisentuh) uang.value = b;
      upd();
    }
  }

  drawQr(qrSeed);
  metode.addEventListener('change', upd);
  uang.addEventListener('input', function () { uangDisentuh = true; upd(); });
  upd();
  tick();
  setInterval(tick, 1000);
});
</script>
<?php endif; ?>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
