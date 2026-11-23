<?php
$title = 'Slot Parkir';
$active = 'slot';
require_once __DIR__ . '/../includes/header.php';

$isAdmin = (($_SESSION['user']['role'] ?? '') === 'admin');
$msg = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();
    if (!$isAdmin) {
        $msg = 'Hanya admin yang boleh mengubah slot.';
    } else {
        $aksi = $_POST['aksi'] ?? '';
        if ($aksi === 'tambah') {
            $kode = strtoupper(preg_replace('/\s+/', '', trim($_POST['kode_slot'] ?? '')));
            $ket = trim($_POST['keterangan'] ?? '');
            if (!preg_match('/^[A-Z0-9]{1,10}$/', $kode)) {
                $msg = 'Kode slot tidak valid. Contoh: C01.';
            } else {
                try {
                    $pdo->prepare("INSERT INTO slot_parkir (kode_slot, status, keterangan) VALUES (?, 'tersedia', ?)")->execute([$kode, $ket ?: null]);
                    set_flash('success', "Slot $kode ditambahkan.");
                    redirect('slot/index.php');
                } catch (PDOException $e) { $msg = 'Kode slot sudah ada.'; }
            }
        } elseif ($aksi === 'hapus') {
            $id = (int)$_POST['id'];
            $s = $pdo->prepare("SELECT * FROM slot_parkir WHERE id=? LIMIT 1"); $s->execute([$id]); $sl = $s->fetch();
            if (!$sl) $msg = 'Slot tidak ditemukan.';
            elseif ($sl['status'] !== 'tersedia') $msg = 'Slot yang sedang terisi tidak bisa dihapus.';
            else { $pdo->prepare("DELETE FROM slot_parkir WHERE id=?")->execute([$id]); set_flash('success','Slot dihapus.'); redirect('slot/index.php'); }
        }
    }
}

$slots = $pdo->query("SELECT s.*, k.nopol FROM slot_parkir s LEFT JOIN transaksi t ON t.slot_id=s.id AND t.status='aktif' LEFT JOIN kendaraan k ON k.id=t.kendaraan_id ORDER BY s.kode_slot")->fetchAll();
$tersedia = count(array_filter($slots, fn($x) => $x['status']==='tersedia'));
?>
<?php if ($msg): ?><div class="alert alert-error"><?= e($msg) ?></div><?php endif; ?>

<div class="cards">
  <div class="card"><div class="label">Total slot</div><div class="value"><?= count($slots) ?></div></div>
  <div class="card"><div class="label">Tersedia</div><div class="value"><?= $tersedia ?></div></div>
  <div class="card"><div class="label">Terisi</div><div class="value"><?= count($slots) - $tersedia ?></div></div>
</div>

<div class="panel">
  <h3>Denah slot</h3>
  <div class="slots">
    <?php foreach ($slots as $s): ?>
      <div class="slot <?= e($s['status']) ?>" title="<?= e($s['nopol'] ?? 'kosong') ?>">
        <?= e($s['kode_slot']) ?><br><small><?= e($s['status']) ?></small>
        <?php if ($s['nopol']): ?><br><small><?= e($s['nopol']) ?></small><?php endif; ?>
      </div>
    <?php endforeach; ?>
  </div>
</div>

<div class="panel">
  <h3>Daftar slot</h3>
  <?php if ($isAdmin): ?>
  <form method="post" class="toolbar">
    <?= csrf_field() ?><input type="hidden" name="aksi" value="tambah">
    <input name="kode_slot" required placeholder="Kode baru (cth: C01)" style="max-width:150px">
    <input name="keterangan" placeholder="Keterangan">
    <button class="btn btn-red btn-small">+ Tambah</button>
  </form>
  <?php else: ?><p style="font-size:13px;color:#7F8C8D">Tambah / hapus slot hanya untuk admin.</p><?php endif; ?>
  <table>
    <thead><tr><th>Kode</th><th>Status</th><th>Terisi oleh</th><th>Keterangan</th><?php if ($isAdmin): ?><th></th><?php endif; ?></tr></thead>
    <tbody>
    <?php foreach ($slots as $s): ?>
      <tr>
        <td><b><?= e($s['kode_slot']) ?></b></td>
        <td><span class="badge b-<?= e($s['status']) ?>"><?= e($s['status']) ?></span></td>
        <td><?= e($s['nopol'] ?? '-') ?></td>
        <td><?= e($s['keterangan'] ?? '-') ?></td>
        <?php if ($isAdmin): ?><td>
          <?php if ($s['status']==='tersedia'): ?>
          <form method="post" style="display:inline" onsubmit="return confirm('Hapus slot <?= e($s['kode_slot']) ?>?')"><?= csrf_field() ?><input type="hidden" name="aksi" value="hapus"><input type="hidden" name="id" value="<?= (int)$s['id'] ?>"><button class="btn btn-grey btn-small">Hapus</button></form>
          <?php else: ?>&mdash;<?php endif; ?>
        </td><?php endif; ?>
      </tr>
    <?php endforeach; ?>
    </tbody>
  </table>
</div>
<?php require_once __DIR__ . '/../includes/footer.php'; ?>
