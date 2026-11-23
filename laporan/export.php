<?php
// Export laporan ke CSV (bisa dibuka dengan Excel)
require_once __DIR__ . '/../config/functions.php';
require_login();

$dari = $_GET['dari'] ?? date('Y-m-d', strtotime('-30 days'));
$sampai = $_GET['sampai'] ?? date('Y-m-d');
$pola = '/^\d{4}-\d{2}-\d{2}$/';
if (!preg_match($pola, $dari))   $dari = date('Y-m-d', strtotime('-30 days'));
if (!preg_match($pola, $sampai)) $sampai = date('Y-m-d');
if ($dari > $sampai) { $tmp = $dari; $dari = $sampai; $sampai = $tmp; }

// Ringkasan
$stmt = $pdo->prepare("SELECT COUNT(*) FROM transaksi WHERE DATE(waktu_masuk) BETWEEN ? AND ?");
$stmt->execute([$dari, $sampai]); $jMasuk = (int)$stmt->fetchColumn();

$stmt = $pdo->prepare("SELECT COUNT(*) FROM transaksi WHERE status='selesai' AND DATE(waktu_keluar) BETWEEN ? AND ?");
$stmt->execute([$dari, $sampai]); $jKeluar = (int)$stmt->fetchColumn();

$stmt = $pdo->prepare("SELECT COALESCE(SUM(jumlah_bayar),0), COUNT(*) FROM pembayaran WHERE status='lunas' AND DATE(waktu_bayar) BETWEEN ? AND ?");
$stmt->execute([$dari, $sampai]);
$ringkas = $stmt->fetch(PDO::FETCH_NUM);
$pendapatan = (int)$ringkas[0];
$jBayar = (int)$ringkas[1];

// Rekap per hari
$rekap = [];
$d1 = new DateTime($dari); $d2 = new DateTime($sampai);
$jumlahHari = min(366, (int)$d1->diff($d2)->days + 1);
for ($i = 0; $i < $jumlahHari; $i++) {
    $tgl = date('Y-m-d', strtotime("$dari +$i days"));
    $s = $pdo->prepare("SELECT COUNT(*) FROM transaksi WHERE DATE(waktu_masuk)=?");
    $s->execute([$tgl]); $m = (int)$s->fetchColumn();
    $s = $pdo->prepare("SELECT COUNT(*) FROM transaksi WHERE status='selesai' AND DATE(waktu_keluar)=?");
    $s->execute([$tgl]); $k = (int)$s->fetchColumn();
    $s = $pdo->prepare("SELECT COALESCE(SUM(jumlah_bayar),0) FROM pembayaran WHERE status='lunas' AND DATE(waktu_bayar)=?");
    $s->execute([$tgl]); $u = (int)$s->fetchColumn();
    $rekap[] = [$tgl, $m, $k, $u];
}

// Detail transaksi
$stmt = $pdo->prepare("
  SELECT t.no_tiket, k.nopol, k.nama_pemilik, s.kode_slot,
         t.waktu_masuk, t.waktu_keluar, t.durasi_menit, t.biaya, t.status, p.metode
  FROM transaksi t
  JOIN kendaraan k ON k.id = t.kendaraan_id
  JOIN slot_parkir s ON s.id = t.slot_id
  LEFT JOIN pembayaran p ON p.transaksi_id = t.id
  WHERE DATE(t.waktu_masuk) BETWEEN ? AND ?
  ORDER BY t.waktu_masuk ASC
");
$stmt->execute([$dari, $sampai]);
$detail = $stmt->fetchAll();

$namaFile = 'laporan-motorpark-' . str_replace('-', '', $dari) . '-' . str_replace('-', '', $sampai) . '.csv';
header('Content-Type: text/csv; charset=UTF-8');
header('Content-Disposition: attachment; filename="' . $namaFile . '"');
header('Pragma: no-cache');

$out = fopen('php://output', 'w');
// BOM UTF-8 + penanda pemisah agar Excel membaca kolom dengan benar
fwrite($out, "\xEF\xBB\xBF");
fwrite($out, "sep=;\r\n");

$tulis = function (array $baris) use ($out) {
    fputcsv($out, $baris, ';');
};

$tulis(['Laporan Motor Park']);
$tulis(['Periode', $dari, 's/d', $sampai]);
$tulis(['Dicetak', date('Y-m-d H:i:s')]);
$tulis([]);

$tulis(['Ringkasan']);
$tulis(['Motor masuk', $jMasuk]);
$tulis(['Motor keluar', $jKeluar]);
$tulis(['Transaksi lunas', $jBayar]);
$tulis(['Total pendapatan (Rp)', $pendapatan]);
$tulis([]);

$tulis(['Rekap per hari']);
$tulis(['Tanggal', 'Masuk', 'Keluar', 'Pendapatan (Rp)']);
foreach ($rekap as $r) $tulis($r);
$tulis([]);

$tulis(['Detail transaksi']);
$tulis(['No. tiket', 'Nopol', 'Pemilik', 'Slot', 'Waktu masuk', 'Waktu keluar', 'Durasi (menit)', 'Biaya (Rp)', 'Status', 'Metode']);
foreach ($detail as $d) {
    $tulis([
        $d['no_tiket'], $d['nopol'], $d['nama_pemilik'], $d['kode_slot'],
        $d['waktu_masuk'], $d['waktu_keluar'] ?? '', $d['durasi_menit'] ?? '',
        $d['biaya'], $d['status'], $d['metode'] ?? ''
    ]);
}

fclose($out);
exit;
