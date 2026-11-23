<?php
$title = 'Motor Masuk';
$active = 'masuk';
require_once __DIR__ . '/../includes/header.php';

$slots = $pdo->query("SELECT * FROM slot_parkir WHERE status='tersedia' ORDER BY kode_slot")->fetchAll();
$existing = $pdo->query("SELECT nopol, merek, warna, nama_pemilik FROM kendaraan ORDER BY nopol LIMIT 500")->fetchAll();

$error = ''; $sukses = null;
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();
    $nopol = strtoupper(preg_replace('/\s+/', '', trim($_POST['nopol'] ?? '')));
    $merek = trim($_POST['merek'] ?? '');
    $warna = trim($_POST['warna'] ?? '');
    $pemilik = trim($_POST['nama_pemilik'] ?? '');
    $telp = trim($_POST['no_telp'] ?? '');
    $catatan = trim($_POST['catatan_kondisi'] ?? '');
    $slot_id = (int)($_POST['slot_id'] ?? 0);

    if ($nopol === '' || $pemilik === '' || !$slot_id) {
        $error = 'Nopol, nama pemilik, dan slot wajib diisi.';
    } else {
        try {
            $pdo->beginTransaction();

            // Pastikan slot masih kosong (dikunci dulu biar tidak rebutan)
            $stmt = $pdo->prepare("SELECT * FROM slot_parkir WHERE id=? FOR UPDATE");
            $stmt->execute([$slot_id]);
            $slot = $stmt->fetch();
            if (!$slot || $slot['status'] !== 'tersedia') {
                throw new Exception('Slot sudah terisi. Pilih slot lain.');
            }

            // Kalau nopol sudah pernah tercatat, pakai datanya
            $stmt = $pdo->prepare("SELECT * FROM kendaraan WHERE nopol=? LIMIT 1");
            $stmt->execute([$nopol]);
            $kend = $stmt->fetch();
            if ($kend) {
                $stmt = $pdo->prepare("SELECT 1 FROM transaksi WHERE kendaraan_id=? AND status='aktif' LIMIT 1");
                $stmt->execute([$kend['id']]);
                if ($stmt->fetch()) throw new Exception("Nopol $nopol masih dititipkan (belum keluar).");
                $kendaraan_id = $kend['id'];
                $stmt = $pdo->prepare("UPDATE kendaraan SET merek=?, warna=?, nama_pemilik=?, no_telp=?, catatan_kondisi=? WHERE id=?");
                $stmt->execute([$merek ?: $kend['merek'], $warna ?: $kend['warna'], $pemilik, $telp ?: $kend['no_telp'], $catatan ?: $kend['catatan_kondisi'], $kendaraan_id]);
            } else {
                $stmt = $pdo->prepare("INSERT INTO kendaraan (nopol, merek, warna, nama_pemilik, no_telp, catatan_kondisi) VALUES (?,?,?,?,?,?)");
                $stmt->execute([$nopol, $merek ?: null, $warna ?: null, $pemilik, $telp ?: null, $catatan ?: null]);
                $kendaraan_id = (int)$pdo->lastInsertId();
            }

            $tiket = generate_no_tiket($pdo);
            $stmt = $pdo->prepare("INSERT INTO transaksi (no_tiket, kendaraan_id, slot_id, waktu_masuk, status, petugas_masuk_id) VALUES (?, ?, ?, NOW(), 'aktif', ?)");
            $stmt->execute([$tiket, $kendaraan_id, $slot_id, $_SESSION['user']['id']]);

            $stmt = $pdo->prepare("UPDATE slot_parkir SET status='terisi' WHERE id=?");
            $stmt->execute([$slot_id]);

            $pdo->commit();
            $sukses = ['tiket' => $tiket, 'nopol' => $nopol, 'slot' => $slot['kode_slot']];
            $slots = $pdo->query("SELECT * FROM slot_parkir WHERE status='tersedia' ORDER BY kode_slot")->fetchAll();
        } catch (Exception $e) {
            if ($pdo->inTransaction()) $pdo->rollBack();
            $error = $e->getMessage();
        }
    }
}
?>

<?php if ($sukses): ?>
<div class="ticket">
  <div style="font-size:13px;color:#7F8C8D">Motor masuk tercatat</div>
  <div class="no"><?= e($sukses['tiket']) ?></div>
  <div style="font-size:13px"><?= e($sukses['nopol']) ?> &middot; Slot <?= e($sukses['slot']) ?> &middot; <?= date('d-m-Y H:i') ?></div>
  <br>
  <a class="btn btn-dark btn-small" href="aktif.php">Lihat daftar titipan</a>
  <button class="btn btn-grey btn-small" onclick="window.print()">Cetak tiket</button>
</div>
<?php endif; ?>

<div class="panel">
  <h3>Catat motor masuk</h3>
  <?php if ($error): ?><div class="alert alert-error"><?= e($error) ?></div><?php endif; ?>
  <?php if (empty($slots) && !$sukses): ?><div class="alert alert-error">Parkiran penuh. Tidak ada slot tersedia.</div><?php endif; ?>
  <form method="post">
    <?= csrf_field() ?>
    <div class="form-grid">
      <div>
        <label>Nomor polisi *</label>
        <input class="nopol-input" name="nopol" required list="listNopol" placeholder="B1234ABC" value="<?= e($_POST['nopol'] ?? '') ?>">
        <datalist id="listNopol"><?php foreach ($existing as $x): ?><option value="<?= e($x['nopol']) ?>"><?= e($x['nopol']) ?> - <?= e($x['nama_pemilik']) ?></option><?php endforeach; ?></datalist>
      </div>
      <div><label>Slot parkir *</label>
        <select name="slot_id" required>
          <option value="">-- pilih slot --</option>
          <?php foreach ($slots as $s): ?><option value="<?= (int)$s['id'] ?>"><?= e($s['kode_slot']) ?> <?= $s['keterangan'] ? '- ' . e($s['keterangan']) : '' ?></option><?php endforeach; ?>
        </select>
      </div>
      <div><label>Merek motor</label><input name="merek" placeholder="Honda Vario" value="<?= e($_POST['merek'] ?? '') ?>"></div>
      <div><label>Warna motor</label><input name="warna" placeholder="Hitam" value="<?= e($_POST['warna'] ?? '') ?>"></div>
      <div><label>Nama pemilik *</label><input name="nama_pemilik" required placeholder="Nama pemilik" value="<?= e($_POST['nama_pemilik'] ?? '') ?>"></div>
      <div><label>No. telepon</label><input name="no_telp" placeholder="08xx" value="<?= e($_POST['no_telp'] ?? '') ?>"></div>
    </div>
    <div style="margin-top:12px"><label>Kondisi kendaraan</label><textarea name="catatan_kondisi" rows="2" placeholder="Contoh: lecet spion kiri, helm dititipkan"><?= e($_POST['catatan_kondisi'] ?? '') ?></textarea></div>
    <br>
    <button class="btn btn-red" type="submit">Simpan</button>
    <span style="font-size:12px;color:#7F8C8D">Waktu masuk dan nomor tiket diisi otomatis.</span>
  </form>
</div>
<?php require_once __DIR__ . '/../includes/footer.php'; ?>
