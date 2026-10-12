# Kantor AI by Han HQ

Dashboard kantor AI bergaya 3D voxel (three.js, tanpa CDN). Status karakter dibaca dari `status.json` dan dicek ulang tiap 60 detik.

- `index.html` – versi 3D gedung 4 lantai (Lt 1 kantor, Lt 2 santai, Lt 3 kamar tidur, Lt 4 🎬 bioskop; tombol Semua/Lt 1-4, URL `#lt1`..`#lt4`, preview bioskop `#bioskop`). Rutinitas: staff lab 08:00-17:00 kerja di Lab, 17:00-08:00 bobo di kamar Lt 3. Rin (IG rin_rh_01): meja depan Kantor IG (kiri kursi Babe), kerja 08:00-17:00, posting 11:02, nongkrong grup IG 20:00-21:00, bobo Kamar Rin 21:00-08:00. HR (Hanrin, IG hr_2002_01): meja di Kantor IG (depan meja Ophelia 1), kerja sesuai slot jadwal, 20:00-21:00 nongkrong grup IG Grokbot OpheliaxHR, di luar jadwal jalan-jalan, 22:00-06:19 bobo di Kamar HR Lt 3. Emely (Emily 2, IG emily2.real): meja di Kantor IG (pojok kanan depan dekat Studio Konten), posting 09:55 & 16:55 (+ support grup 10:25 & 17:25), 20:00-21:00 nongkrong grup IG Grokbot OpheliaxHR, di luar jadwal jalan-jalan keliling kantor, 22:00-06:00 bobo di Kamar Emely Lt 3
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
- **📱 Mode Portrait**: tombol di kartu Kualitas / mini **📱 Port** di stage — framing HP fokus kampus/kantor, ambience jauh di-crop (camera.far lebih pendek + clip stage). **Show Near** tetap terpisah (hutan dekat + jalan). Preferensi disimpan di `localStorage` (`kantorPortrait`).
- 🏙️ **Gedung Kantor 2** (model "Office" by SoyMaria, Poly Pizza, CC-BY 3.0) berdiri ±20 m di belakang (utara) Taman Halaman, nyambung lewat 🌉 **jembatan kaca tertutup** (±20 m) dari Lobi Lantai 3 kantor utama ke lantai 2 gedung (lantai jembatan setinggi Lt 3, lampu hangat nyala pas malam). Jembatan cuma tampil kalau Lt 3 ikut kelihatan (Semua / Lt 3 / Lt 4). Tombol **🏙️ Gedung** nyalain/matiin gedung + jembatan.
- 🌆 **Kota latar**: 266 gedung hiasan (+ menara kecil di atap sebagian gedung; gak bisa dimasukin) di sekeliling kampus, di luar hutan Near & jalan raya. Ringan: kotak low-poly + 1 tekstur jendela 2D dari canvas (dipakai bareng), semua digabung jadi 2 mesh (= 2 draw call, ±3.300 segitiga), tanpa GLB, tanpa bayangan, MeshLambertMaterial; susunan acak dengan seed tetap. Jendela nyala pas malam. Ring jauh di-crop di Mode Portrait, dimatiin di mode Bioskop. Tombol **🌆 Kota** (simpan di `localStorage` `kantorKota`). Preview sudut: `#jembatan`.
- 🧪 **Karakter tes wanita Asia** (GLB, sudah di-rig, animasi Idle + Walk): ["Woman Casual" by Quaternius](https://poly.pizza/m/jpKRgGDxhk), Poly Pizza, [CC0 / Public Domain](https://creativecommons.org/publicdomain/zero/1.0/). Dikecilin dari 586 KB → `models/tes-wanita-asia.glb` ±186 KB (9 animasi lain dibuang, prune/dedup/resample, mesh dikuantisasi KHR_mesh_quantization, 2.776 segitiga, tanpa tekstur). Jalan bolak-balik di sisi timur 🌳 Taman Depan (antara air mancur & lampu taman), dimuat 1,5 detik setelah kantor kebuka biar loading awal gak ketambahan. Cuma hiasan tes: gak ikut agents/chat, karakter & ruangan lain gak diubah. Preview: `#tesasia`.
- Preview jam: tambah `#jam=21` (atau `#jam=7.5`) di URL. Sudut kamera: `#langit` (langit rendah), `#atas` (pandangan atas hutan), `#hutan` (lihat hutan seberang jalan). Bisa digabung: `#langit,jam=17.5`.

## 🎬 Bioskop Lt 4 (index.html)
- 📦 **Pindah ke 🏙️ Gedung Kantor 2**: seluruh Lt 4 (Bioskop + ruang 🪜 Tangga & Lift-nya) dipindah **utuh** ke dalam Gedung Kantor 2, di lantai 2-nya (lantai = lantai jembatan kaca, 6,4 m). Yang digeser cuma posisi grup lantainya (`TH_SITE`), jadi isi, ukuran, koordinat logika, kunci kode, gerbang 18+, state & semua fitur Bioskop tetap sama. Jembatan kaca dari Lobi Lt 3 sekarang mendarat persis di area Tangga & Lift Bioskop.
  - Bioskop 32×14 m gak muat di gedung lama (9,7×9,7 m), jadi **badan Gedung Kantor 2 dilebarin** jadi ±33,6×15 m (tinggi tetap ±23 m, muka selatan tetap di y=-20 → jembatan gak berubah). Jalan setapak dari kanopi belok ke timur nyambung ke jalur jembatan.
  - Pas lihat Bioskop (tombol Lt 4, panel/fokus Bioskop, `#bioskop`, POV di Lt 4) kaca gedungnya disembunyiin biar isi Bioskop kelihatan, diganti "podium" lantai bawah + landing jembatan. Di 🏢 Semua Bioskop ada di dalam gedung (ketutup kaca).
  - Bekas Lt 4 di kantor utama sekarang **🌤️ atap datar**: tapak sama kayak Lt 4 lama, pagar atap, rumah tangga/lift yang nutup ujung tangga Lt 3, 2 unit AC. Tangga/lift Lt 3 → **R** tetap naik ke Lt 4 (= Bioskop di Gedung Kantor 2).
- Lantai 4: **🎬 Bioskop Han** — layar besar 16:9 di dinding utara, gorden merah, 4 baris kursi (A–D) dengan lorong tengah, proyektor di belakang, 🔐 Konsol Bioskop dekat pintu. Naik lewat tangga/lift dari Lobi Lantai 3.
- **Kode kunci**: wajib dimasukkan sebelum bisa milih/putar film. Di kode cuma disimpan hash SHA-256-nya (`TH_HASH`, salt `kantor-ai-bioskop:`), bukan kodenya. Sekali kebuka, kebuka sampai tab ditutup atau klik 🔒 Kunci.
  - Ganti kode: buka situs, di Console browser jalankan `kantorBioskopHash('KODEBARU')`, salin hasilnya ke `TH_HASH` di `index.html`.
  - Catatan: ini kunci tampilan di web statis (bukan keamanan server).
- **Cara masuk (Mode POV)**: 🎮 Mode POV → jalan ke 🪜 Tangga & Lift → **R** naik sampai Lt 4 → masuk Bioskop → **T** / tombol 🎬 → kode → pilih film. Shortcut: tombol **🎮 Ke Bioskop (Mode POV)** di kolom info.
- **Film**: daftar "Folder theater/" dari `theater/videos.json` (bikin pakai `python3 tools/theater-list.py`; cadangan: listing folder `theater/` via GitHub API). Video asli **gak di-push** (lihat `.gitignore` & `theater/README.md`); dari web pakai **📂 Putar dari folder komputer** → pilih folder `D:\teather`, semua video di folder itu masuk daftar dan diputar langsung dari PC.
- Di mode Bioskop (Lt 4 / panel / POV di dalam bioskop): **awan dimatiin** biar lebih ringan & layar jelas. **Mode Portrait** tetap tersedia terpisah.
- Kontrol: ⏮ ▶️/⏸ ⏭ ⏹, seek, volume, **⛶ Layar penuh**, **⏭ Auto ON** (auto play next, default nyala, bisa dimatiin; simpan di `localStorage` `kantorThAutoNext`). Duduk & tekan **V** (1st person) biar layar full di depan mata.
- 💞 **Interaksi Ophelia 1**: 🍿 Nonton bareng (Ophelia 1 jalan ke Bioskop & duduk Baris C), 💺 Han duduk di sebelah, 🚶 Selesai (balik ke rutinitas). Tambah interaksi baru: push objek `{id,label,run}` ke `TH_ACTS`.
