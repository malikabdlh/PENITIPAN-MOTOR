<?php
require_once __DIR__ . '/../config/functions.php';

if (is_logged_in()) redirect('dashboard/index.php');

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';

    if ($username === '' || $password === '') {
        $error = 'Username dan password wajib diisi.';
    } else {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ? LIMIT 1");
        $stmt->execute([$username]);
        $user = $stmt->fetch();
        if ($user && password_verify($password, $user['password'])) {
            session_regenerate_id(true);
            $_SESSION['user'] = [
                'id' => $user['id'],
                'username' => $user['username'],
                'nama_lengkap' => $user['nama_lengkap'],
                'role' => $user['role'],
            ];
            redirect('dashboard/index.php');
        } else {
            $error = 'Username atau password salah.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Masuk - Motor Park</title>
<link rel="stylesheet" href="<?= e(base_url('assets/css/style.css')) ?>">
</head>
<body>
<div class="login-wrap">
  <div class="login-box">
    <h2><span class="mark"></span>Motor Park</h2>
    <p>Sistem penitipan motor. Masuk untuk melanjutkan.</p>
    <?php if ($error): ?><div class="alert alert-error"><?= e($error) ?></div><?php endif; ?>
    <form method="post" action="">
      <label>Username</label>
      <input type="text" name="username" required autofocus value="<?= e($_POST['username'] ?? '') ?>">
      <br><br>
      <label>Password</label>
      <input type="password" name="password" required>
      <br><br>
      <button class="btn btn-red" type="submit" style="width:100%">Masuk</button>
    </form>
    <div class="login-demo">
      Akun coba-coba:<br>
      Admin &mdash; <b>admin / admin123</b><br>
      Petugas &mdash; <b>petugas / petugas123</b>
    </div>
  </div>
</div>
</body>
</html>
