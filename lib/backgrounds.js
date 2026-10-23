// Manifest background. Gambar ada di /public, dan dipilih per adegan lewat `theme` di lib/messages.js.
//
// BACKGROUNDS: daftar gambar latar. Menambah latar baru (misalnya suasana sore):
//   1) simpan gambarnya di public/ (mis. public/backgrounds/sore.png, rasio 16:9 disarankan)
//   2) daftarkan di BACKGROUNDS di bawah
//   3) arahkan satu atau lebih theme ke latar itu lewat properti `background`.
//   Pergantian antar-latar memakai crossfade otomatis.
//
// THEMES: "kamera" per adegan. Satu gambar bisa terasa berbeda karena zoom, titik fokus, dan warna.
//   zoom   : 1 = utuh. Lebih besar = mendekat ke titik fokus.
//   ox, oy : titik fokus zoom (persen dari gambar).
//   px     : posisi crop horizontal (persen). Penting di layar HP yang memotong gambar 16:9 menjadi potret.
//   filter : penyesuaian warna ringan (CSS filter).
export const BACKGROUNDS = {
  garden_day: { src: "/background.png", fallback: "#8fd0f6" }
};

export const DEFAULT_THEME = "meadow";

export const THEMES = {
  meadow:  { background: "garden_day", zoom: 1.04, ox: "50%", oy: "65%", px: "55%", filter: "none" },
  city:    { background: "garden_day", zoom: 1.3,  ox: "72%", oy: "64%", px: "66%", filter: "saturate(1.05)" },
  bench:   { background: "garden_day", zoom: 1.26, ox: "14%", oy: "80%", px: "10%", filter: "sepia(.12) saturate(1.05)" },
  sign:    { background: "garden_day", zoom: 1.28, ox: "88%", oy: "72%", px: "92%", filter: "none" },
  flowers: { background: "garden_day", zoom: 1.22, ox: "50%", oy: "100%", px: "50%", filter: "saturate(1.15) brightness(1.03)" },
  fence:   { background: "garden_day", zoom: 1.18, ox: "55%", oy: "74%", px: "50%", filter: "sepia(.2) saturate(1.1) brightness(.98)" }
};
