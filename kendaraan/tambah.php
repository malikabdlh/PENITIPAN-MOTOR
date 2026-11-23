<?php
$title = 'Tambah Kendaraan';
$active = 'kendaraan';
require_once __DIR__ . '/../includes/header.php';

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
    } elseif (!preg_match('/^[A-Z0-9]{1,12}$/', $nopol)) {
        $error = 'Nomor polisi tidak valid (huruf/angka tanpa spasi, maks 12 karakter). Contoh: B1234ABC.';
    } else {
        try {
            $stmt = $pdo->prepare("INSERT INTO kendaraan (nopol, merek, warna, nama_pemilik, no_telp, catatan_kondisi) VALUES (?,?,?,?,?,?)");
            $stmt->execute([$nopol, $merek ?: null, $warna ?: null, $pemilik, $telp ?: null, $catatan ?: null]);
            set_flash('success', 'Data kendaraan ' . $nopol . ' berhasil ditambahkan.');
            redirect('kendaraan/index.php');
        } catch (PDOException $e) {
            if ($e->getCode() == 23000) $error = 'Nomor polisi sudah terdaftar.';
            else $error = 'Gagal menyimpan: ' . $e->getMessage();
        }
    }
}
?>
<div class="panel">
  <h3>Tambah kendaraan</h3>
  <?php if ($error): ?><div class="alert alert-error"><?= e($error) ?></div><?php endif; ?>
  <form method="post">
    <?= csrf_field() ?>
    <div class="form-grid">
      <div><label>Nomor Polisi *</label><input class="nopol-input" name="nopol" required maxlength="12" placeholder="B1234ABC" value="<?= e($_POST['nopol'] ?? '') ?>"></div>
      <div><label>Merek Motor</label><input name="merek" placeholder="Honda Vario" value="<?= e($_POST['merek'] ?? '') ?>"></div>
      <div><label>Warna Motor</label><input name="warna" placeholder="Hitam" value="<?= e($_POST['warna'] ?? '') ?>"></div>
      <div><label>Nama Pemilik *</label><input name="nama_pemilik" required placeholder="Nama pemilik" value="<?= e($_POST['nama_pemilik'] ?? '') ?>"></div>
      <div><label>No. Telepon</label><input name="no_telp" placeholder="08xx" value="<?= e($_POST['no_telp'] ?? '') ?>"></div>
      <div><label>Catatan Kondisi</label><input name="catatan_kondisi" placeholder="Lecet, helm, dll" value="<?= e($_POST['catatan_kondisi'] ?? '') ?>"></div>
    </div>
    <br>
    <button class="btn btn-red" type="submit">Simpan</button>
    <a class="btn btn-grey" href="index.php">Batal</a>
  </form>
</div>
<?php require_once __DIR__ . '/../includes/footer.php'; ?>
