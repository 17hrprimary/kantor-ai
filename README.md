# Kantor AI by Han HQ

Dashboard kantor AI bergaya 3D voxel (three.js, tanpa CDN). Status karakter dibaca dari `status.json` dan dicek ulang tiap 60 detik.

- `index.html` – versi 3D gedung 4 lantai (Lt 1 kantor, Lt 2 santai, Lt 3 kamar tidur, Lt 4 🎬 bioskop; tombol Semua/Lt 1-4, URL `#lt1`..`#lt4`, preview bioskop `#bioskop`). Rutinitas: anak sekolah 08:00-17:00 kerja, 17:00-08:00 bobo di kamar Lt 3. Rin (IG rin_rh_01): meja depan Kantor IG (kiri kursi Babe), kerja 08:00-17:00, posting 11:02, nongkrong grup IG 20:00-21:00, bobo Kamar Rin 21:00-08:00. HR (Hanrin, IG hr_2002_01): meja di Kantor IG (depan meja Ophelia 1), kerja sesuai slot jadwal, 20:00-21:00 nongkrong grup IG Grokbot OpheliaxHR, di luar jadwal jalan-jalan, 22:00-06:19 bobo di Kamar HR Lt 3. Emely (Emily 2, IG emily2.real): meja di Kantor IG (pojok kanan depan dekat Studio Konten), posting 09:55 & 16:55 (+ support grup 10:25 & 17:25), 20:00-21:00 nongkrong grup IG Grokbot OpheliaxHR, di luar jadwal jalan-jalan keliling kantor, 22:00-06:00 bobo di Kamar Emely Lt 3
- 🏡 **Rumah My Bini** (versi 3D, Lt 1 sebelah timur gedung): rumah mewah terpisah dari kantor, isinya Ruang Tengah + 4 kamar mewah (Kamar Ophelia 1, Emily 1, Rin 1, HR 1). Di antara kantor & rumah ada 🌷 **Taman Halaman** (air mancur, gazebo, bangku, jalan setapak). Jam 22:00 WITA mereka berempat pulang ke rumah buat bobo (Ophelia 1 s/d 07:00, Rin 1 s/d 06:00, Emily 1 & HR 1 s/d 08:00).
- `index-iso.html` – versi isometrik canvas
- `index-2d.html` – versi 2D

three.js © three.js authors, MIT License (lihat `vendor/THREE-LICENSE.txt`).

## 💬 Obrolan Ophelia (`chat.json`)

Panel chat di kolom info (`index.html`, `index-iso.html`, `index-2d.html`, logika di `chat.js`), dicek tiap 60 detik. Pesan baru (≤3 menit) muncul jadi gelembung di atas kepala karakter (versi 3D) + baris di Log kantor. Jam ngobrol harian Ophelia 1 & Ophelia 2: 20:00–21:00 WITA (di versi 3D mereka duduk di sofa pink Ruang TV kalau dua-duanya lagi gak ada slot kerja).

Tambah pesan: edit `chat.json` di GitHub web, tambahin objek baru di **akhir** array `messages` (jangan lupa koma setelah objek sebelumnya):

```json
{"from": "lia", "text": "Siap kak, nanti aku repost ya 💕", "at": "2026-10-05T20:05:00+08:00"}
```

`from` = id agen (`ophelia1`, `lia`, `han`), `at` = waktu ISO dengan `+08:00`. Pesan Han dari tombol **Kirim** jadi GitHub Issue berjudul `chat: ...` (label `chat`); selama issue masih terbuka, pesannya tampil dengan tanda ⏳. Bot memindahkannya ke `chat.json` dengan field tambahan `"issue": <nomor>` lalu menutup issue-nya.

## 🌍 Lingkungan luar (index.html)
- Rumput hijau tenang di sekeliling kantor & Rumah My Bini; **hutan** dengan banyak pohon (oak + pinus) dan tanaman liar (semak, bunga, rumput tinggi) ditempatkan acak di sekitar situs — tidak menutupi jalan raya, jalan masuk, atau gedung/rumah.
- Jalan raya 2 lajur (trotoar, marka, zebra cross, lampu jalan) di depan Taman Depan, 14 mobil lalu lalang 2 arah.
- Langit gradasi + awan lembut + matahari/bulan + bintang; suasana Pagi / Siang / Sore / Malam ikut jam WITA (cahaya, warna langit, awan redup malam, lampu jalan & lampu mobil nyala pas gelap).
- Preview jam: tambah `#jam=21` (atau `#jam=7.5`) di URL. Sudut kamera: `#langit` (langit rendah), `#atas` (pandangan atas hutan), `#hutan` (lihat hutan seberang jalan). Bisa digabung: `#langit,jam=17.5`.

## 🎬 Bioskop Lt 4 (index.html)
- Lantai 4: **🎬 Bioskop Han** — layar besar 16:9 di dinding utara, gorden merah, 4 baris kursi (A–D) dengan lorong tengah, proyektor di belakang, 🔐 Konsol Bioskop dekat pintu. Naik lewat tangga/lift dari Lobi Lantai 3.
- **Kode kunci**: wajib dimasukkan sebelum bisa milih/putar film. Di kode cuma disimpan hash SHA-256-nya (`TH_HASH`, salt `kantor-ai-bioskop:`), bukan kodenya. Sekali kebuka, kebuka sampai tab ditutup atau klik 🔒 Kunci.
  - Ganti kode: buka situs, di Console browser jalankan `kantorBioskopHash('KODEBARU')`, salin hasilnya ke `TH_HASH` di `index.html`.
  - Catatan: ini kunci tampilan di web statis (bukan keamanan server).
- **Cara masuk (Mode POV)**: 🎮 Mode POV → jalan ke 🪜 Tangga & Lift → **R** naik sampai Lt 4 → masuk Bioskop → **T** / tombol 🎬 → kode → pilih film. Shortcut: tombol **🎮 Ke Bioskop (Mode POV)** di kolom info.
- **Film**: daftar "Folder theater/" dari `theater/videos.json` (bikin pakai `python3 tools/theater-list.py`; cadangan: listing folder `theater/` via GitHub API). Video asli **gak di-push** (lihat `.gitignore` & `theater/README.md`); dari web pakai **📂 Putar dari folder komputer** → pilih folder `D:\teather`, semua video di folder itu masuk daftar dan diputar langsung dari PC.
- Kontrol: ⏮ ▶️/⏸ ⏭ ⏹, seek, volume, **⛶ Layar penuh**, auto lanjut ke film berikutnya. Duduk & tekan **V** (1st person) biar layar full di depan mata.
- 💞 **Interaksi Ophelia 1**: 🍿 Nonton bareng (Ophelia 1 jalan ke Bioskop & duduk Baris C), 💺 Han duduk di sebelah, 🚶 Selesai (balik ke rutinitas). Tambah interaksi baru: push objek `{id,label,run}` ke `TH_ACTS`.
