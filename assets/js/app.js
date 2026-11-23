// MOTOR PARK - interaksi ringan
document.addEventListener('DOMContentLoaded', function () {
  // Toggle sidebar (HP)
  var btn = document.getElementById('btnMenu');
  var sidebar = document.getElementById('sidebar');
  if (btn && sidebar) {
    btn.addEventListener('click', function () {
      sidebar.classList.toggle('open');
    });
  }

  // Konfirmasi hapus
  document.querySelectorAll('[data-confirm]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      if (!confirm(el.getAttribute('data-confirm'))) e.preventDefault();
    });
  });

  // Jam live di navbar (jika ada #clock)
  var clock = document.getElementById('clock');
  function tick() {
    if (!clock) return;
    var d = new Date();
    clock.textContent = d.toLocaleDateString('id-ID') + ' ' + d.toLocaleTimeString('id-ID');
  }
  tick(); setInterval(tick, 1000);

  // Durasi penitipan berjalan: elemen dengan data-durasi-live + data-detik
  // (data-detik = durasi awal dari server, lalu ditambah tiap detik di browser)
  var liveDurasi = Array.prototype.slice.call(document.querySelectorAll('[data-durasi-live]'));
  if (liveDurasi.length) {
    var mulaiHalaman = Date.now();
    var detikAwal = liveDurasi.map(function (el) {
      return parseInt(el.getAttribute('data-detik') || '0', 10) || 0;
    });
    var tickDurasi = function () {
      var lewat = Math.floor((Date.now() - mulaiHalaman) / 1000);
      liveDurasi.forEach(function (el, i) {
        el.textContent = formatDurasiDetik(detikAwal[i] + lewat);
      });
    };
    tickDurasi();
    setInterval(tickDurasi, 1000);
  }

  // Filter tabel client-side (input[data-table])
  document.querySelectorAll('input[data-table]').forEach(function (input) {
    input.addEventListener('input', function () {
      var target = document.getElementById(input.getAttribute('data-table'));
      if (!target) return;
      var q = input.value.toLowerCase();
      target.querySelectorAll('tbody tr').forEach(function (tr) {
        tr.style.display = tr.textContent.toLowerCase().includes(q) ? '' : 'none';
      });
    });
  });

  // Auto-uppercase nopol
  document.querySelectorAll('.nopol-input').forEach(function (i) {
    i.addEventListener('input', function () { i.value = i.value.toUpperCase(); });
  });
});

function cetak() { window.print(); }

/* Format durasi live: "0 mnt 05 dtk", "1 jam 2 mnt 09 dtk", "1 hari 2 jam 3 mnt" */
function formatDurasiDetik(totalDetik) {
  totalDetik = Math.max(0, Math.floor(totalDetik));
  var hari = Math.floor(totalDetik / 86400);
  var jam = Math.floor((totalDetik % 86400) / 3600);
  var menit = Math.floor((totalDetik % 3600) / 60);
  var detik = totalDetik % 60;
  var dd = (detik < 10 ? '0' : '') + detik;
  if (hari) {
    var out = [hari + ' hari'];
    if (jam) out.push(jam + ' jam');
    if (menit) out.push(menit + ' mnt');
    if (detik) out.push(dd + ' dtk');
    return out.join(' ');
  }
  if (jam) return jam + ' jam ' + menit + ' mnt ' + dd + ' dtk';
  return menit + ' mnt ' + dd + ' dtk';
}

/* Samakan dengan hitung_biaya() di config/functions.php */
function hitungBiayaParkir(totalDetik, perJam, perHari) {
  var menit = Math.max(1, Math.floor(Math.max(0, totalDetik) / 60));
  var jam = Math.max(1, Math.ceil(menit / 60));
  if (jam <= 8) return jam * perJam;
  var hariPenuh = Math.floor(jam / 24);
  var sisa = jam % 24;
  var biaya = hariPenuh * perHari;
  if (sisa > 0) biaya += (sisa > 8) ? perHari : (sisa * perJam);
  return biaya;
}
