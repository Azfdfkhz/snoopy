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
    { id: "hai", animation: "sleep", pose: "lie", theme: "meadow", props: ["bird", "zzz"],
      message: "haii indy yang cantik, lucu, imut, gemes, pokoknya banyak banget deh 😭🤏🏻", caption: "Snoopy santai di taman", hint: "Tekan “Lanjutkan” untuk mengikuti cerita.", sound: "chime" },
    { id: "baik", animation: "surprised", pose: "stand", theme: "city", props: ["bird"],
      message: "yess, kamu yang selama ini selalu berusaha baik ke semua orang. bukan cuma ke manusia, tapi ke hewan dan tumbuhan juga.", caption: "Snoopy menyadari sesuatu", hint: "Ada yang ingin Snoopy sampaikan.", sound: "pop" },
    { id: "nitip", animation: "walk", pose: "stand", theme: "bench", backpack: true, props: ["bird"],
      message: "makanya, kali ini snoopy mau nitip sedikit pesan buat kamu.", caption: "Snoopy datang membawa pesan", hint: "Snoopy berjalan sambil membawa pesan.", sound: "step" },
    { id: "feeling", animation: "point", pose: "stand", theme: "sign", backpack: true, props: ["sign"],
      message: "bukan sulap bukan sihir, snoopy punya feeling kalau beberapa hari belakangan ini, mungkin sampai hari ini, kamu lagi ngerasa capek sama keadaan.", caption: "Snoopy menunjuk papan pesan", hint: "Pelan-pelan saja bacanya.", sound: "chime" },
    { id: "entah", animation: "idle", pose: "sit", theme: "fence", props: ["bird"],
      message: "entah karena banyak pikiran, banyak hal yang harus dihadapi, atau cuma lagi pengen istirahat sebentar dari semuanya.", caption: "Snoopy duduk menemani", hint: "Snoopy duduk di sebelahmu.", sound: "chime" },
    { id: "its-okay", animation: "wave", pose: "sit", theme: "flowers", props: ["bird"],
      message: "and hey, it's okay, indy. kamu nggak harus selalu kuat setiap saat, kok. kalau hari ini rasanya berat, nggak apa-apa buat jalan pelan-pelan dulu.", caption: "Snoopy menenangkan", hint: "Nggak apa-apa.", sound: "chime" },
    { id: "manusia", animation: "idle", pose: "sit", theme: "flowers", props: ["bird"],
      message: "kamu juga manusia yang boleh capek, boleh istirahat, dan boleh punya hari yang nggak begitu baik.", caption: "Snoopy duduk tenang", hint: "Kamu boleh istirahat.", sound: "chime" },
    { id: "kind", animation: "point", pose: "stand", theme: "flowers", props: ["bird"],
      message: "snoopy cuma mau kamu inget satu hal, yaa. please be kind to yourself, too. kamu udah berusaha sejauh ini, dan itu juga sesuatu yang patut kamu hargai.", caption: "Snoopy menyampaikan pesan utama", hint: "Satu hal yang paling penting.", sound: "chime" },
    { id: "nanya", animation: "point", pose: "stand", theme: "meadow", props: ["bird"],
      message: "jangan sampai kamu sibuk memastikan semua orang baik-baik aja, tapi malah lupa nanyain diri sendiri, “aku sendiri gimana, ya?”", caption: "Snoopy bertanya pelan", hint: "Coba tanya dirimu sendiri.", sound: "pop" },
    { id: "jaga", animation: "dance", pose: "stand", theme: "meadow", props: ["notes"],
      message: "oh iya, jangan lupa jaga diri baik-baik. jaga kesehatan, jaga uang, jaga gawang, jaga semuanya deh pokoknya 😭☝🏻 jangan sampai semua dijagain, tapi diri sendiri malah kelupaan.", caption: "Snoopy menari lucu", hint: "Jaga gawang juga, ya.", sound: "pop" },
    { id: "istirahat", animation: "idle", pose: "sit", theme: "fence", props: ["bird"],
      message: "kalau lagi capek, istirahat. kalau lagi sedih, nggak perlu pura-pura happy terus. and if things don't go as planned, that's okay too. besok masih ada kesempatan buat mencoba lagi, pelan-pelan aja, nggak usah buru-buru.", caption: "Snoopy mengingatkan istirahat", hint: "Besok masih ada kesempatan.", sound: "chime" },
    { id: "pantas", animation: "point", pose: "stand", theme: "bench", props: ["bird", "bench"],
      message: "snoopy mungkin nggak bisa bantu beresin semua masalah kamu, tapi setidaknya snoopy mau ngingetin kalau kamu juga pantas dapet kebaikan yang selama ini kamu kasih ke orang lain.", caption: "Snoopy bersungguh-sungguh", hint: "Kamu pantas dapat kebaikan.", sound: "chime" },
    { id: "take-care", animation: "wave", pose: "stand", theme: "flowers", props: ["bird"],
      message: "so, take care of yourself, indy. makan yang bener, istirahat yang cukup, jangan terlalu keras sama diri sendiri, and please don't forget to smile when you can. bukan karena kamu harus selalu bahagia, tapi karena kamu juga berhak ngerasain hal-hal baik.", caption: "Snoopy tersenyum", hint: "Senyum kalau bisa, ya.", sound: "chime" },
    { id: "ceramah", animation: "idle", pose: "stand", theme: "meadow", props: ["bird"],
      message: "udah dulu yaa, nanti snoopy malah ceramah panjang banget 😭", caption: "Snoopy garuk-garuk kepala", hint: "Hehe, Snoopy kebanyakan ngomong.", sound: "pop" },
    // Adegan kejutan dari PRD. Hapus dua adegan di bawah (bomb-hint dan boom) jika tidak ingin ada kejutan.
    { id: "bomb-hint", animation: "idle", pose: "stand", theme: "city", held: "bomb", props: ["bird"],
      message: "Nanti bakal ada sesuatu...", caption: "Snoopy membawa sesuatu", hint: "Ssst... apa itu di tangannya?", sound: "step" },
    { id: "boom", animation: "surprised", pose: "stand", theme: "meadow", held: "bombLit", bubble: "boom", props: ["bird"],
      message: "yaitu BOM!", caption: "Snoopy punya kejutan", hint: "Kejutan! 💥", sound: "boom" },
    { id: "stay-safe", animation: "wave", pose: "stand", theme: "flowers", props: ["bird"],
      message: "stay safe, stay healthy, and be happy at your own pace, ody. 🤍", caption: "Snoopy melambaikan tangan", hint: "Satu pesan terakhir.", sound: "chime" },
    { id: "ending", animation: "wave", pose: "stand", theme: "meadow", props: ["bird"],
      message: "dadahhh, jangan nakal-nakal, jangan lupa jaga diri. snoopy pamit duluu 🐾", caption: "Snoopy pamit", hint: "Cerita selesai.", sound: "chime" }
  ],

  // Bagian akhir cerita: popup ajakan menulis pesan, pesawat kertas, dan ucapan terima kasih.
  // Di teks "thanksNamed", {nama} diganti dengan nama yang diisi pengunjung.
  finale: {
    askTitle: "Mau bales pesan Snoopy?",
    askText: "Tulis beberapa kata, nanti pesanmu terbang ke Snoopy pakai pesawat kertas.",
    askYes: "Ya, tulis pesan",
    askNo: "Nanti saja",
    flying: "Eh, ada pesawat kertas datang!",
    reading: "Hmm, hmm... aku baca dulu, ya.",
    thanksNamed: "Terima kasih, {nama}! Pesanmu sudah kubaca dan membuatku senang. ♡",
    thanksAnonymous: "Terima kasih sudah menulis untukku! Pesanmu sudah kubaca dan membuatku senang. ♡",
    declined: "Tidak apa-apa. Kalau berubah pikiran, aku masih di sini. ♡"
  }
};
