// Ganti isi pesan di bawah ini kapan saja tanpa mengubah sistem animasi.
// Setiap adegan:
//   animation : idle | walk | point | dance | surprised | wave | sleep
//   pose      : stand | sit | lie
//   theme     : meadow | city | bench | sign | flowers | fence   (latar)
//   props     : bird | sign | easel | notes | zzz | bench       (pelengkap, boleh kosong)
//   backpack  : true/false     held: "bomb" | "bombLit"
//   bubble    : "normal" | "boom"
//   sound     : chime | step | pop | boom
export const STORY_CONFIG = {
  soundEnabled: true,
  scenes: [
    { id: "relax", animation: "sleep", pose: "lie", theme: "meadow", props: ["bird", "zzz"],
      message: "Hari yang tenang di taman... ✿", caption: "Snoopy santai di taman", hint: "Tekan “Lanjutkan” untuk mengikuti cerita.", sound: "chime" },
    { id: "notice", animation: "surprised", pose: "stand", theme: "city", props: ["bird"],
      message: "Hm? Sepertinya aku punya sesuatu untuk disampaikan.", caption: "Snoopy merasa ada sesuatu", hint: "Ada yang ingin Snoopy sampaikan.", sound: "pop" },
    { id: "walk", animation: "walk", pose: "stand", theme: "bench", backpack: true, props: ["bird"],
      message: "Aku bawa pesan khusus untukmu, lho!", caption: "Snoopy mulai berjalan", hint: "Snoopy berjalan sambil membawa pesan.", sound: "step" },
    { id: "sign", animation: "point", pose: "stand", theme: "sign", backpack: true, props: ["sign"],
      message: "Oh, ada papan pesan!", caption: "Snoopy menemui papan pesan", hint: "Sepertinya papan itu untukmu.", sound: "chime" },
    { id: "message-1", animation: "point", pose: "stand", theme: "flowers", props: ["bird"],
      message: "Jangan lupa untuk selalu semangat!", caption: "Snoopy menyampaikan pesan", hint: "Pesan pertama bisa kamu ubah di lib/messages.js.", sound: "chime" },
    { id: "dance", animation: "dance", pose: "stand", theme: "meadow", props: ["notes"],
      message: "Tarian kecil dulu, ya! ♪", caption: "Snoopy menari lucu", hint: "Kadang pesan butuh sedikit tarian.", sound: "pop" },
    { id: "cheer", animation: "wave", pose: "sit", theme: "flowers", props: ["bird"],
      message: "Kamu pasti bisa kok! ♥", caption: "Snoopy memberi semangat", hint: "Pesan kedua bisa kamu ubah di lib/messages.js.", sound: "chime" },
    { id: "rest", animation: "idle", pose: "sit", theme: "fence", props: ["bird"],
      message: "Jangan lupa istirahat juga ya!", caption: "Snoopy mengingatkan istirahat", hint: "Istirahat itu penting.", sound: "chime" },
    { id: "drawing", animation: "point", pose: "stand", theme: "meadow", props: ["easel"],
      message: "Lihat, aku menggambar sesuatu!", caption: "Snoopy menunjukkan gambar kecil", hint: "Gambarnya sederhana tapi tulus.", sound: "pop" },
    { id: "hint", animation: "idle", pose: "sit", theme: "bench", props: ["bird", "bench"],
      message: "Ada satu hal lagi nih...", caption: "Snoopy memberi petunjuk", hint: "Sepertinya ada kejutan.", sound: "chime" },
    { id: "bomb-hint", animation: "idle", pose: "stand", theme: "city", held: "bomb", props: ["bird"],
      message: "Nanti bakal ada sesuatu...", caption: "Snoopy membawa sesuatu", hint: "Ssst... apa itu di tangannya?", sound: "step" },
    { id: "boom", animation: "surprised", pose: "stand", theme: "meadow", held: "bombLit", bubble: "boom", props: ["bird"],
      message: "yaitu BOM!", caption: "Snoopy punya kejutan", hint: "Kejutan! 💥", sound: "boom" },
    { id: "ending", animation: "wave", pose: "stand", theme: "meadow", props: ["bird"],
      message: "Sampai jumpa di pesan berikutnya! ♥", caption: "Snoopy melambaikan tangan", hint: "Cerita selesai.", sound: "chime" }
  ],

  // Bagian akhir cerita: popup ajakan menulis pesan, pesawat kertas, dan ucapan terima kasih.
  // Di teks "thanksNamed", {nama} diganti dengan nama yang diisi pengunjung.
  finale: {
    askTitle: "Mau menulis pesan untuk Snoopy?",
    askText: "Tulis beberapa kata, lalu pesanmu akan terbang ke Snoopy dengan pesawat kertas.",
    askYes: "Ya, tulis pesan",
    askNo: "Nanti saja",
    flying: "Eh, ada pesawat kertas datang!",
    reading: "Hmm, hmm... aku baca dulu, ya.",
    thanksNamed: "Terima kasih, {nama}! Pesanmu sudah kubaca dan membuatku senang. ♡",
    thanksAnonymous: "Terima kasih sudah menulis untukku! Pesanmu sudah kubaca dan membuatku senang. ♡",
    declined: "Tidak apa-apa. Kalau berubah pikiran, aku masih di sini. ♡"
  }
};
