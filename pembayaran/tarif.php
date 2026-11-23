<?php
$title = 'Tarif';
$active = 'tarif';
require_once __DIR__ . '/../includes/header.php';
require_admin();

$msg = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();
    $aksi = $_POST['aksi'] ?? '';
    if ($aksi === 'aktifkan') {
        $id = (int)$_POST['id'];
        $pdo->exec("UPDATE tarif SET is_aktif=0");
        $stmt = $pdo->prepare("UPDATE tarif SET is_aktif=1 WHERE id=?");
        $stmt->execute([$id]);
        set_flash('success', 'Tarif diaktifkan.');
        redirect('pembayaran/tarif.php');
    } elseif ($aksi === 'simpan') {
        $nama = trim($_POST['nama_tarif'] ?? '');
        $jam = max(0, (int)($_POST['tarif_per_jam'] ?? 0));
        $hari = max(0, (int)($_POST['tarif_per_hari'] ?? 0));
        $id = (int)($_POST['id'] ?? 0);
        if ($nama === '' || $jam <= 0 || $hari <= 0) $msg = 'Nama dan nominal tarif harus diisi dengan benar.';
        else {
            if ($id > 0) {
                $stmt = $pdo->prepare("UPDATE tarif SET nama_tarif=?, tarif_per_jam=?, tarif_per_hari=? WHERE id=?");
                $stmt->execute([$nama, $jam, $hari, $id]);
            } else {
                $stmt = $pdo->prepare("INSERT INTO tarif (nama_tarif, tarif_per_jam, tarif_per_hari, is_aktif) VALUES (?,?,?,0)");
                $stmt->execute([$nama, $jam, $hari]);
            }
            set_flash('success', 'Tarif disimpan.');
            redirect('pembayaran/tarif.php');
        }
    } elseif ($aksi === 'hapus') {
        $id = (int)$_POST['id'];
        $cek = $pdo->prepare("SELECT is_aktif FROM tarif WHERE id=?");
        $cek->execute([$id]);
        if ($cek->fetchColumn() == 1) $msg = 'Tarif yang sedang aktif tidak bisa dihapus.';
        else { $pdo->prepare("DELETE FROM tarif WHERE id=?")->execute([$id]); set_flash('success','Tarif dihapus.'); redirect('pembayaran/tarif.php'); }
    }
}

$rows = $pdo->query("SELECT * FROM tarif ORDER BY is_aktif DESC, id DESC")->fetchAll();
$edit = null;
if (isset($_GET['edit'])) {
    $s = $pdo->prepare("SELECT * FROM tarif WHERE id=? LIMIT 1");
    $s->execute([(int)$_GET['edit']]);
    $edit = $s->fetch();
}
?>
<?php if ($msg): ?><div class="alert alert-error"><?= e($msg) ?></div><?php endif; ?>
<div class="grid2">
  <div class="panel">
    <h3>Daftar tarif</h3>
    <table>
      <thead><tr><th>Nama</th><th>Per jam</th><th>Per hari</th><th>Status</th><th></th></tr></thead>
      <tbody>
      <?php foreach ($rows as $t): ?>
        <tr>
          <td><?= e($t['nama_tarif']) ?></td>
          <td><?= rupiah($t['tarif_per_jam']) ?></td>
          <td><?= rupiah($t['tarif_per_hari']) ?></td>
          <td><?= $t['is_aktif'] ? '<span class="badge b-lunas">Aktif</span>' : '<span class="badge">Nonaktif</span>' ?></td>
          <td style="white-space:nowrap">
            <?php if (!$t['is_aktif']): ?>
            <form method="post" style="display:inline"><?= csrf_field() ?><input type="hidden" name="aksi" value="aktifkan"><input type="hidden" name="id" value="<?= (int)$t['id'] ?>"><button class="btn btn-grey btn-small">Aktifkan</button></form>
            <?php endif; ?>
            <a class="btn btn-grey btn-small" href="?edit=<?= (int)$t['id'] ?>">Ubah</a>
          </td>
        </tr>
      <?php endforeach; ?>
      </tbody>
    </table>
    <p style="font-size:12px;color:#7F8C8D">Hitungan: sampai 8 jam bayar per jam (pembulatan ke atas). Lewat dari itu bayar harian.</p>
  </div>
  <div class="panel">
    <h3><?= $edit ? 'Ubah tarif' : 'Tambah tarif' ?></h3>
    <form method="post">
      <?= csrf_field() ?>
      <input type="hidden" name="aksi" value="simpan">
      <input type="hidden" name="id" value="<?= (int)($edit['id'] ?? 0) ?>">
      <label>Nama</label><input name="nama_tarif" required value="<?= e($edit['nama_tarif'] ?? '') ?>" placeholder="Reguler">
      <br><br><label>Per jam (Rp)</label><input type="number" name="tarif_per_jam" required min="500" step="500" value="<?= e($edit['tarif_per_jam'] ?? '3000') ?>">
      <br><br><label>Per hari (Rp)</label><input type="number" name="tarif_per_hari" required min="1000" step="500" value="<?= e($edit['tarif_per_hari'] ?? '15000') ?>">
      <br><br><button class="btn btn-red" type="submit">Simpan</button>
      <?php if ($edit): ?><a class="btn btn-grey" href="tarif.php">Batal</a><?php endif; ?>
    </form>
  </div>
</div>
<?php require_once __DIR__ . '/../includes/footer.php'; ?>
