# Kantor AI by Han HQ

Dashboard kantor AI bergaya 3D voxel (three.js, tanpa CDN). Status karakter dibaca dari `status.json` dan dicek ulang tiap 60 detik.

- `index.html` – versi 3D gedung 3 lantai (Lt 1 kantor, Lt 2 santai, Lt 3 kamar tidur; tombol Semua/Lt 1-3, URL `#lt1`..`#lt3`). Rutinitas: anak sekolah & Rin/Emely 08:00-17:00 kerja, 17:00-08:00 bobo di kamar Lt 3. HR (Hanrin, IG hr_2002_01): meja di Kantor IG (depan meja Ophelia 1), kerja sesuai slot jadwal, 20:00-21:00 nongkrong grup IG Grokbot OpheliaxHR, di luar jadwal jalan-jalan, 22:00-06:19 bobo di Kamar HR Lt 3
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
