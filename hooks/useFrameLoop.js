"use client";

import { useEffect, useState } from "react";

// Pemutar frame sederhana. `frames` berbentuk [[kunci, durasiMs], ...].
// Mengembalikan kunci frame yang sedang tampil. Jika `playing` false atau frame hanya satu,
// frame pertama ditampilkan diam (dipakai untuk "gerakan mati" dan prefers-reduced-motion).
// `resetKey` mengulang animasi dari frame pertama saat berganti animasi.
export function useFrameLoop(frames, playing, resetKey) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
    if (!playing || frames.length < 2) return undefined;
    let i = 0;
    let id;
    const tick = () => {
      i = (i + 1) % frames.length;
      setIndex(i);
      id = window.setTimeout(tick, frames[i][1]);
    };
    id = window.setTimeout(tick, frames[0][1]);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey, playing]);

  return frames[index % frames.length][0];
}
