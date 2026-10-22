# Snoopy Message Garden (Next.js)

Website interaktif dengan React dan Next.js (App Router). Snoopy menyampaikan pesan per adegan, dan pengunjung bisa mengirim pesan yang diteruskan ke Telegram pemilik website.

## Struktur

```
app/
  layout.jsx            Layout dasar, judul, metadata
  page.jsx              Halaman utama
  globals.css           Semua gaya dan animasi
  api/message/route.js  API: POST kirim pesan, GET cek status
components/
  Story.jsx             Alur cerita dan fase akhir (popup, pesawat kertas, terima kasih)
  Snoopy.jsx            Ilustrasi Snoopy (SVG): pose berdiri, duduk, berbaring; ransel dan bom
  Scenery.jsx           Latar taman bercat air: bukit, pohon, awan, kota, pagar, jalan setapak
  Props.jsx             Burung kecil, papan pesan, easel, bangku, not musik, "zzz"
  PaperPlane.jsx        Pesawat kertas
  Modal.jsx             Dialog dengan fokus keyboard dan tombol Esc
  ComposeForm.jsx       Form pesan di dalam popup
lib/
  messages.js           Isi cerita dan teks bagian akhir (ganti PESAN_1 dan PESAN_2 di sini)
  telegram.js           Validasi, rate limit, kirim ke Telegram (server saja)
check.js                Diagnosa koneksi Telegram (npm run check)
```

## Mengatur adegan

Cerita mengikuti storyboard 13 adegan (santai, menyadari sesuatu, berjalan, papan pesan, pesan semangat, menari, duduk memberi semangat, istirahat, gambar di easel, bangku, bom, "yaitu BOM!", salam perpisahan). Setiap adegan di `lib/messages.js` punya `pose`, `animation`, `theme` (latar), `props`, `backpack`, `held`, dan `bubble`, jadi urutan, teks, dan latarnya bisa diubah tanpa menyentuh kode lain. Bubble `"boom"` menampilkan bentuk bintang bergerigi.

## Alur setelah adegan terakhir

1. Popup "Mau menulis pesan untuk Snoopy?" muncul. Pilihan: **Nanti saja** atau **Ya, tulis pesan**.
2. Jika menulis, pesan dikirim ke Telegram. Setelah server menerima, pesawat kertas terbang ke Snoopy, Snoopy membaca, lalu berterima kasih (menyebut nama jika diisi).
3. Jika pengiriman gagal, pesan error tampil di dalam popup dan tulisannya tidak hilang.
4. Jika memilih "Nanti saja", Snoopy melambai dan tombol "Tulis pesan" tetap tersedia.

Semua teks bagian ini ada di `finale` dalam `lib/messages.js`.

## Menjalankan secara lokal

Butuh Node.js 18.18 atau lebih baru.

1. `npm install`
2. Salin `.env.example` menjadi `.env.local`, lalu isi `TELEGRAM_BOT_TOKEN` dan `TELEGRAM_CHAT_ID`.
3. `npm run dev`, lalu buka `http://localhost:3000`.

Jika pesan tidak terkirim, jalankan `npm run check`. Perintah ini memeriksa versi Node, file env, token, koneksi ke Telegram, dan chat ID, lalu mengirim pesan percobaan serta menjelaskan apa yang salah. Cek juga `http://localhost:3000/api/message`: halaman ini menampilkan apakah token dan chat ID terbaca.

Untuk produksi lokal: `npm run build` lalu `npm start`.

## Menghubungkan bot Telegram

1. Di Telegram, buka `@BotFather`, buat bot dengan `/newbot`, dan simpan tokennya secara privat.
2. Buka chat dengan bot milikmu, tekan **Start**, dan kirim satu pesan.
3. Cari chat ID dengan membuka `https://api.telegram.org/bot<TOKEN>/getUpdates` lalu lihat `message.chat.id`. Jangan membagikan URL itu karena berisi token. `npm run check` juga bisa menampilkan chat ID yang terdeteksi.
4. Untuk grup: tambahkan bot ke grup, kirim pesan di grup, lalu cek `getUpdates` untuk ID grup.

## Deploy ke Vercel

1. Push proyek ke GitHub. `.env.local` tidak ikut ter-commit karena sudah ada di `.gitignore`.
2. Import repo di Vercel. Framework terdeteksi otomatis sebagai **Next.js**, tidak perlu mengubah pengaturan build. Root Directory harus folder yang berisi `package.json`.
3. Di **Settings → Environment Variables**, tambahkan `TELEGRAM_BOT_TOKEN` dan `TELEGRAM_CHAT_ID`.
4. **Redeploy** setelah menambah variabel, karena deployment lama tidak membaca variabel baru.
5. Cek `https://DOMAIN-KAMU.vercel.app/api/message` untuk memastikan token dan chat ID terbaca.

## Mengganti isi cerita

Edit `lib/messages.js`: ganti `PESAN_1` dan `PESAN_2`, serta sesuaikan adegan lain. Setiap adegan punya `animation` (idle, walk, point, dance, surprised, wave) dan `sound` (chime, step, pop, boom).

## Keamanan dan batasan

- Bot token hanya dipakai di server (`lib/telegram.js`) dan tidak pernah dikirim ke browser.
- Validasi pesan 2–1000 karakter, honeypot, batas ukuran body, dan rate limit sederhana (per instance server).
- Untuk trafik besar, tambahkan Vercel Firewall atau CAPTCHA.
- Jangan meminta pengunjung mengirim kata sandi, data finansial, atau informasi pribadi sensitif.

## Integrasi aset PNG Snoopy dan background

- Background utama diambil dari `public/background.png` dan dipasang sebagai layer gambar terpisah.
- Karakter tidak lagi digambar menggunakan SVG buatan komponen. `components/Snoopy.jsx` memakai PNG transparan di `public/animations/snoopy-frames/png/`.
- Pergantian pose PNG mengikuti state cerita (idle, walk, dance, wave, surprised, read, sleep, dan lainnya); gerakan ringan seperti bobbing, dance, wave, serta reaksi ditangani oleh CSS.
- Aset yang belum memiliki pose khusus memakai fallback pose idle. PNG yang digunakan saat ini merupakan pose/ilustrasi terpisah, bukan rangkaian frame penuh untuk setiap animasi.

Jalankan `npm install` lalu `npm run dev` untuk mencoba website secara lokal. Integrasi pengiriman Telegram tetap memerlukan konfigurasi `.env.local` seperti dijelaskan di bagian konfigurasi di atas.
