<?php
$title = 'Ubah Kendaraan';
$active = 'kendaraan';
require_once __DIR__ . '/../includes/header.php';

$id = (int)($_GET['id'] ?? 0);
$stmt = $pdo->prepare("SELECT * FROM kendaraan WHERE id=? LIMIT 1");
$stmt->execute([$id]);
$k = $stmt->fetch();
if (!$k) { set_flash('error', 'Data tidak ditemukan.'); redirect('kendaraan/index.php'); }

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();
    $nopol = strtoupper(preg_replace('/\s+/', '', trim($_POST['nopol'] ?? '')));
    $merek = trim($_POST['merek'] ?? '');
    $warna = trim($_POST['warna'] ?? '');
    $pemilik = trim($_POST['nama_pemilik'] ?? '');
    $telp = trim($_POST['no_telp'] ?? '');
    $catatan = trim($_POST['catatan_kondisi'] ?? '');

    if ($nopol === '' || $pemilik === '') {
        $error = 'Nomor polisi dan nama pemilik wajib diisi.';
    } else {
        try {
            $stmt = $pdo->prepare("UPDATE kendaraan SET nopol=?, merek=?, warna=?, nama_pemilik=?, no_telp=?, catatan_kondisi=? WHERE id=?");
            $stmt->execute([$nopol, $merek ?: null, $warna ?: null, $pemilik, $telp ?: null, $catatan ?: null, $id]);
            set_flash('success', 'Data kendaraan berhasil diubah.');
            redirect('kendaraan/detail.php?id=' . $id);
        } catch (PDOException $e) {
            if ($e->getCode() == 23000) $error = 'Nomor polisi sudah dipakai kendaraan lain.';
            else $error = 'Gagal menyimpan: ' . $e->getMessage();
        }
    }
    // refresh tampilan jika error
    $k = array_merge($k, $_POST);
}
?>
<div class="panel">
  <h3>Ubah kendaraan #<?= (int)$k['id'] ?></h3>
  <?php if ($error): ?><div class="alert alert-error"><?= e($error) ?></div><?php endif; ?>
  <form method="post">
    <?= csrf_field() ?>
    <div class="form-grid">
      <div><label>Nomor Polisi *</label><input class="nopol-input" name="nopol" required value="<?= e($k['nopol']) ?>"></div>
      <div><label>Merek Motor</label><input name="merek" value="<?= e($k['merek']) ?>"></div>
      <div><label>Warna Motor</label><input name="warna" value="<?= e($k['warna']) ?>"></div>
      <div><label>Nama Pemilik *</label><input name="nama_pemilik" required value="<?= e($k['nama_pemilik']) ?>"></div>
      <div><label>No. Telepon</label><input name="no_telp" value="<?= e($k['no_telp']) ?>"></div>
      <div><label>Catatan Kondisi</label><input name="catatan_kondisi" value="<?= e($k['catatan_kondisi']) ?>"></div>
    </div>
    <br>
    <button class="btn btn-red" type="submit">Simpan Perubahan</button>
    <a class="btn btn-grey" href="detail.php?id=<?= (int)$k['id'] ?>">Batal</a>
  </form>
</div>
<?php require_once __DIR__ . '/../includes/footer.php'; ?>
