<?php
// config/functions.php - Helper global (dipakai semua halaman)
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Samakan zona waktu PHP dengan MySQL (server parkir memakai WIB).
// Tanpa ini, selisih waktu PHP (UTC) vs MySQL (lokal) membuat durasi selalu 1 menit.
date_default_timezone_set('Asia/Jakarta');

require_once __DIR__ . '/database.php';

/* ---------- Base URL dinamis (mendukung folder "pkk alik" berisi spasi) ---------- */
function base_url($path = '') {
    // Contoh SCRIPT_NAME: /pkk alik/dashboard/index.php  -> base: /pkk alik
    $script = str_replace('\\', '/', $_SERVER['SCRIPT_NAME'] ?? '');
    $base = preg_replace('#/(auth|dashboard|kendaraan|transaksi|pembayaran|slot|laporan|config|includes|assets)(/.*)?$#', '', $script);
    $base = rtrim($base, '/');
    // Jika index.php di root: /pkk alik/index.php -> dirname = /pkk alik (tetap benar)
    if ($base === '' || preg_match('#\.php$#', $base)) {
        $dir = rtrim(str_replace('\\', '/', dirname($script)), '/');
        // dirname root "/" atau "." -> jadikan ""
        if ($dir === '/' || $dir === '.' || $dir === '\\') $dir = '';
        $base = $dir;
    }
    $path = ltrim($path, '/');
    return $base . ($path ? '/' . $path : '');
}

/* ---------- Escape output (anti XSS) ---------- */
function e($str) {
    return htmlspecialchars((string)($str ?? ''), ENT_QUOTES, 'UTF-8');
}

/* ---------- Format rupiah ---------- */
function rupiah($angka) {
    return 'Rp ' . number_format((int)$angka, 0, ',', '.');
}

/* ---------- Flash message ---------- */
function set_flash($type, $msg) {
    $_SESSION['flash'] = ['type' => $type, 'msg' => $msg];
}
function get_flash() {
    $f = $_SESSION['flash'] ?? null;
    unset($_SESSION['flash']);
    return $f;
}

/* ---------- CSRF ---------- */
function csrf_token() {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}
function csrf_field() {
    return '<input type="hidden" name="csrf_token" value="' . e(csrf_token()) . '">';
}
function verify_csrf() {
    $token = $_POST['csrf_token'] ?? '';
    if (empty($token) || empty($_SESSION['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $token)) {
        http_response_code(403);
        die('Token CSRF tidak valid. Silakan kembali dan coba lagi.');
    }
}

/* ---------- Auth ---------- */
function current_user() {
    return $_SESSION['user'] ?? null;
}
function is_logged_in() {
    return isset($_SESSION['user']);
}
function require_login() {
    if (!is_logged_in()) {
        header('Location: ' . base_url('auth/login.php'));
        exit;
    }
}
function require_admin() {
    require_login();
    if (($_SESSION['user']['role'] ?? '') !== 'admin') {
        http_response_code(403);
        die('Akses ditolak: halaman ini khusus admin.');
    }
}
function redirect($path) {
    header('Location: ' . base_url($path));
    exit;
}

/* ---------- Tarif aktif ---------- */
function get_tarif_aktif($pdo) {
    $stmt = $pdo->query("SELECT * FROM tarif WHERE is_aktif = 1 ORDER BY id DESC LIMIT 1");
    $tarif = $stmt->fetch();
    // fallback jika belum ada tarif
    if (!$tarif) {
        $tarif = ['id' => 0, 'nama_tarif' => 'Default', 'tarif_per_jam' => 3000, 'tarif_per_hari' => 15000];
    }
    return $tarif;
}

/* ----------
 * Hitung biaya penitipan.
 * Aturan (disepakati): per-jam dibulatkan ke atas, <=8 jam = per jam,
 * >8 jam dalam sehari = tarif harian, kelipatan hari untuk durasi panjang.
 */
function hitung_biaya($durasi_menit, $per_jam, $per_hari) {
    $menit = max(1, (int)$durasi_menit);
    $jam = (int)ceil($menit / 60);
    if ($jam <= 0) $jam = 1;

    if ($jam <= 8) {
        return $jam * (int)$per_jam;
    }
    // Lebih dari 8 jam: hitung harian
    $hari_penuh = intdiv($jam, 24);
    $sisa = $jam % 24;
    $biaya = $hari_penuh * (int)$per_hari;
    if ($sisa > 0) {
        $biaya += ($sisa > 8) ? (int)$per_hari : ($sisa * (int)$per_jam);
    }
    // Jika jam 9-23 (hari_penuh=0) maka biaya = 1x tarif harian (dari rumus di atas sudah benar)
    return $biaya;
}

function format_durasi($menit) {
    $menit = (int)$menit;
    if ($menit < 60) return $menit . ' mnt';
    $j = intdiv($menit, 60);
    $s = $menit % 60;
    if ($j < 24) return $j . ' jam' . ($s ? ' ' . $s . ' mnt' : '');
    $h = intdiv($j, 24);
    $sj = $j % 24;
    return $h . ' hari' . ($sj ? ' ' . $sj . ' jam' : '') . ($s && $h < 2 ? ' ' . $s . ' mnt' : '');
}

/* ---------- Tampilkan durasi berjalan (detik) untuk timer live ---------- */
function format_durasi_detik($detik) {
    $detik = max(0, (int)$detik);
    $hari  = intdiv($detik, 86400);
    $jam   = intdiv($detik % 86400, 3600);
    $menit = intdiv($detik % 3600, 60);
    $sisa  = $detik % 60;
    $sisa  = str_pad((string)$sisa, 2, '0', STR_PAD_LEFT);

    if ($hari) {
        $out = [$hari . ' hari'];
        if ($jam)   $out[] = $jam . ' jam';
        if ($menit) $out[] = $menit . ' mnt';
        if ((int)$sisa) $out[] = $sisa . ' dtk';
        return implode(' ', $out);
    }
    if ($jam) return $jam . ' jam ' . $menit . ' mnt ' . $sisa . ' dtk';
    return $menit . ' mnt ' . $sisa . ' dtk';
}

/* ---------- Nomor tiket unik: MP-YYYYMMDD-XXXX ---------- */
function generate_no_tiket($pdo) {
    for ($i = 0; $i < 10; $i++) {
        $rand = strtoupper(substr(bin2hex(random_bytes(3)), 0, 4));
        // Pastikan huruf+angka agar mudah dibaca (ganti 0/O ambigu tidak perlu, biarkan simple)
        $tiket = 'MP-' . date('Ymd') . '-' . $rand;
        $stmt = $pdo->prepare("SELECT 1 FROM transaksi WHERE no_tiket = ? LIMIT 1");
        $stmt->execute([$tiket]);
        if (!$stmt->fetch()) return $tiket;
    }
    // fallback dengan uniqid
    return 'MP-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -4));
}
