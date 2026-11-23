<?php
// Layout atas: sidebar + navbar atas
require_once __DIR__ . '/../config/functions.php';
require_login();
$user = current_user();
$flash = get_flash();
?>
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><?= e($title ?? 'Dashboard') ?> - Motor Park</title>
<link rel="stylesheet" href="<?= e(base_url('assets/css/style.css')) ?>?v=<?= (int)@filemtime(__DIR__ . '/../assets/css/style.css') ?>">
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
</head>
<body>
<div class="app">
  <aside class="sidebar" id="sidebar">
    <div class="brand"><span class="mark"></span><span>Motor Park<small>Penitipan motor</small></span></div>
    <nav class="nav">
      <a href="<?= e(base_url('dashboard/index.php')) ?>" class="<?= ($active ?? '') === 'dashboard' ? 'active' : '' ?>">Dashboard</a>
      <div class="sep">Operasional</div>
      <a href="<?= e(base_url('transaksi/masuk.php')) ?>" class="<?= ($active ?? '') === 'masuk' ? 'active' : '' ?>">Motor masuk</a>
      <a href="<?= e(base_url('transaksi/aktif.php')) ?>" class="<?= ($active ?? '') === 'aktif' ? 'active' : '' ?>">Sedang dititip</a>
      <a href="<?= e(base_url('transaksi/keluar.php')) ?>" class="<?= ($active ?? '') === 'keluar' ? 'active' : '' ?>">Motor keluar</a>
      <a href="<?= e(base_url('transaksi/riwayat.php')) ?>" class="<?= ($active ?? '') === 'riwayat' ? 'active' : '' ?>">Riwayat</a>
      <div class="sep">Data</div>
      <a href="<?= e(base_url('kendaraan/index.php')) ?>" class="<?= ($active ?? '') === 'kendaraan' ? 'active' : '' ?>">Kendaraan</a>
      <a href="<?= e(base_url('slot/index.php')) ?>" class="<?= ($active ?? '') === 'slot' ? 'active' : '' ?>">Slot parkir</a>
      <a href="<?= e(base_url('pembayaran/index.php')) ?>" class="<?= ($active ?? '') === 'pembayaran' ? 'active' : '' ?>">Pembayaran</a>
      <?php if (($user['role'] ?? '') === 'admin'): ?>
      <a href="<?= e(base_url('pembayaran/tarif.php')) ?>" class="<?= ($active ?? '') === 'tarif' ? 'active' : '' ?>">Tarif</a>
      <?php endif; ?>
      <a href="<?= e(base_url('laporan/index.php')) ?>" class="<?= ($active ?? '') === 'laporan' ? 'active' : '' ?>">Laporan</a>
    </nav>
    <div class="side-foot">
      <div><?= e($user['nama_lengkap'] ?? '') ?> &middot; <?= e($user['role'] ?? '') ?></div>
      <a href="<?= e(base_url('auth/password.php')) ?>">Ganti password</a>
    </div>
  </aside>

  <div class="main">
    <div class="topbar">
      <button class="hamburger" id="btnMenu">Menu</button>
      <h1><?= e($title ?? 'Dashboard') ?></h1>
      <span class="userbox" id="clock"></span>
      <a class="btn-logout" href="<?= e(base_url('auth/logout.php')) ?>" style="text-decoration:none">Keluar</a>
    </div>
    <div class="content">
      <?php if ($flash): ?>
        <div class="alert alert-<?= e($flash['type']) ?>"><?= e($flash['msg']) ?></div>
      <?php endif; ?>
