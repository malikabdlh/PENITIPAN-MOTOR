<?php
$title = 'Ganti Password';
$active = '';
require_once __DIR__ . '/../includes/header.php';

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();
    $lama  = $_POST['password_lama'] ?? '';
    $baru  = $_POST['password_baru'] ?? '';
    $ulang = $_POST['password_ulang'] ?? '';

    $stmt = $pdo->prepare("SELECT * FROM users WHERE id=? LIMIT 1");
    $stmt->execute([$_SESSION['user']['id']]);
    $row = $stmt->fetch();

    if (!$row || !password_verify($lama, $row['password'])) {
        $error = 'Password lama tidak sesuai.';
    } elseif (strlen($baru) < 8) {
        $error = 'Password baru minimal 8 karakter.';
    } elseif ($baru !== $ulang) {
        $error = 'Konfirmasi password baru tidak sama.';
    } elseif ($baru === $lama) {
        $error = 'Password baru harus berbeda dari password lama.';
    } else {
        $hash = password_hash($baru, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("UPDATE users SET password=? WHERE id=?");
        $stmt->execute([$hash, $_SESSION['user']['id']]);
        set_flash('success', 'Password berhasil diganti. Gunakan password baru saat login berikutnya.');
        redirect('auth/password.php');
    }
}
?>
<div class="panel" style="max-width:480px">
  <h3>Ganti password</h3>
  <p style="font-size:13px;color:#7F8C8D;margin-top:0">Akun: <b><?= e($user['username']) ?></b> (<?= e($user['role']) ?>)</p>
  <?php if ($error): ?><div class="alert alert-error"><?= e($error) ?></div><?php endif; ?>
  <form method="post" autocomplete="off">
    <?= csrf_field() ?>
    <label>Password lama</label>
    <input type="password" name="password_lama" required autocomplete="current-password">
    <br><br>
    <label>Password baru</label>
    <input type="password" name="password_baru" required minlength="8" autocomplete="new-password">
    <span style="font-size:11.5px;color:#7F8C8D">Minimal 8 karakter.</span>
    <br><br>
    <label>Ulangi password baru</label>
    <input type="password" name="password_ulang" required minlength="8" autocomplete="new-password">
    <br><br>
    <button class="btn btn-red" type="submit">Simpan password</button>
    <a class="btn btn-grey" href="<?= e(base_url('dashboard/index.php')) ?>">Batal</a>
  </form>
</div>
<?php require_once __DIR__ . '/../includes/footer.php'; ?>
