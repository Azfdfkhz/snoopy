// Manifest aset karakter + definisi animasi frame-by-frame.
// Semua gambar diambil dari folder /public (PNG transparan), jadi tidak ada lagi Snoopy berbentuk SVG.
//
// Cara kerja:
//  - SPRITES   : daftar PNG (nama file + ukuran asli). Ukuran dipakai agar semua pose tampil dengan skala yang sama.
//  - ANIMATIONS: urutan frame {sprite, ms}. Pemutar (hooks/useFrames di SnoopyAnimator) bergantian menampilkan frame itu.
//                Gerakan tubuh tambahan (naik-turun, miring, melompat) diatur di globals.css lewat data-anim.
//  - Menambah pose baru: taruh PNG di public/animations/snoopy-frames/png, daftarkan di SPRITES,
//    lalu pakai di ANIMATIONS. Tidak perlu mengubah komponen apa pun.

const DIR = "/animations/snoopy-frames/png/";

// Tinggi acuan = tinggi sprite berdiri tertinggi. Pose lain diskalakan relatif terhadap ini.
export const REF_HEIGHT = 736;

export const SPRITES = {
  idle:      { file: "snoopy_01_idle.png", w: 508, h: 676, b: 19 },
  looking:   { file: "snoopy_02_looking.png", w: 480, h: 672, b: 19 },
  walking:   { file: "snoopy_03_walking.png", w: 520, h: 684, b: 11 },
  pointing:  { file: "snoopy_04_pointing.png", w: 520, h: 668, b: 15 },
  happy:     { file: "snoopy_05_happy.png", w: 500, h: 644, b: 15 },
  dance:     { file: "snoopy_06_dance.png", w: 576, h: 704, b: 15 },
  // Versi rapi: ekor yang terlepas di sisi kanan dihapus (muncul-hilang saat pose berganti).
  sit:       { file: "snoopy_07_sit_fixed.png", w: 476, h: 592, b: 11 },
  // Versi yang sudah diperbaiki: badan yang bolong akibat penghapusan latar diisi putih.
  sleep:     { file: "snoopy_08_sleep_fixed.png", w: 660, h: 368, b: 31 },
  surprised: { file: "snoopy_09_surprised.png", w: 520, h: 696, b: 31 },
  thinking:  { file: "snoopy_10_thinking.png", w: 476, h: 656, b: 31 },
  shy:       { file: "snoopy_11_shy.png", w: 468, h: 628, b: 31 },
  wave:      { file: "snoopy_12_wave.png", w: 488, h: 672, b: 31 },
  back:      { file: "snoopy_13_back.png", w: 468, h: 676, b: 31 },
  wink:      { file: "snoopy_14_wink.png", w: 492, h: 616, b: 31 },
  laugh:     { file: "snoopy_15_laugh.png", w: 584, h: 660, b: 19 },
  excited:   { file: "snoopy_16_excited.png", w: 524, h: 736, b: 15 }
};
for (const sprite of Object.values(SPRITES)) sprite.src = DIR + sprite.file;

export const WOODSTOCK = {
  rest:   { src: DIR + "woodstock_01.png", w: 260, h: 332 },
  fly:    { src: DIR + "woodstock_02_flying.png", w: 372, h: 400 },
  happy:  { src: DIR + "woodstock_03_happy.png", w: 308, h: 380 }
};

export const PROP_IMAGES = {
  bomb: DIR + "bomb_cartoon.png",
  butterflyBlue: DIR + "butterfly_blue.png",
  butterflyYellow: DIR + "butterfly_yellow.png",
  heart: DIR + "heart.png"
};

// Setiap animasi = urutan frame. Satu frame saja berarti pose diam (gerakannya dari CSS).
// loop:false → berhenti di frame terakhir.
export const ANIMATIONS = {
  // Diam: sesekali berkedip dan menoleh.
  idle:  { frames: [["idle", 2400], ["wink", 200], ["idle", 1700], ["looking", 1500]] },
  // Berjalan: satu sprite langkah + goyangan tubuh dari CSS, lalu berpindah posisi di scene.
  walk:  { frames: [["walking", 1000]] },
  point: { frames: [["pointing", 1000]] },
  // Menari: bergantian pose tangan terangkat, kecepatan ~4 fps.
  dance: { frames: [["dance", 260], ["excited", 260], ["happy", 260], ["excited", 260]] },
  surprised: { frames: [["surprised", 1000]] },
  // Melambai: sprite lambai bergantian dengan pose senang.
  wave:  { frames: [["wave", 520], ["happy", 300], ["wave", 520], ["excited", 300]] },
  read:  { frames: [["thinking", 1400], ["idle", 900]] },
  sleep: { frames: [["sleep", 1000]] },
  // Versi duduk
  sitIdle: { frames: [["sit", 2800], ["wink", 260], ["sit", 2000], ["wink", 260]] },
  sitWave: { frames: [["wink", 700], ["sit", 500]] }
};

// Memilih animasi dari data adegan (animation + pose). Jika tidak ada, kembali ke "idle".
export function resolveAnimation(animation = "idle", pose = "stand") {
  if (pose === "lie" || animation === "sleep") return "sleep";
  if (pose === "sit") return animation === "wave" ? "sitWave" : "sitIdle";
  return ANIMATIONS[animation] ? animation : "idle";
}
