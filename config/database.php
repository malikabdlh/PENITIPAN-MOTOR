<?php
// config/database.php - Koneksi PDO ke MySQL
// Ubah sesuai setting Laragon / XAMPP kamu

$DB_HOST = 'localhost';
$DB_NAME = 'db_penitipan_motor';
$DB_USER = 'root';
$DB_PASS = ''; // default Laragon/XAMPP kosong
$DB_CHARSET = 'utf8mb4';

$dsn = "mysql:host={$DB_HOST};dbname={$DB_NAME};charset={$DB_CHARSET}";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $DB_USER, $DB_PASS, $options);
} catch (PDOException $e) {
    // Tampilkan pesan ramah (jangan bocorkan detail di production)
    http_response_code(500);
    die(
        "<h2>Koneksi database gagal</h2>" .
        "<p>Pastikan database <b>" . htmlspecialchars($DB_NAME) . "</b> sudah dibuat via phpMyAdmin (import file <code>database/schema.sql</code>).</p>" .
        "<p>Detail: " . htmlspecialchars($e->getMessage()) . "</p>"
    );
}
