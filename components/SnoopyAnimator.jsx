"use client";

import { useState } from "react";
import { ANIMATIONS, PROP_IMAGES, REF_HEIGHT, SPRITES, resolveAnimation } from "../lib/animations.js";
import { useFrameLoop } from "../hooks/useFrameLoop.js";

// Snoopy dari gambar PNG di /public (menggantikan ilustrasi SVG lama).
//
// Animasi dibuat dari dua lapis:
//   1. Frame  : sprite PNG bergantian sesuai urutan di lib/animations.js (berkedip, menari, melambai, ...).
//   2. Gerakan: tubuh naik-turun, miring, melompat, dll. lewat CSS (globals.css, selektor [data-anim]).
//
// Semua sprite dirender sekaligus (hanya satu yang terlihat). Dengan begitu semuanya sudah dimuat
// sebelum dibutuhkan dan pergantian frame tidak berkedip.
//
// Props:
//   animation : idle | walk | point | dance | surprised | wave | read | sleep
//   pose      : stand | sit | lie
//   held      : none | bomb | bombLit
//   moving    : true saat Snoopy sedang berpindah tempat (otomatis memakai animasi berjalan)
//   facing    : 1 menghadap kanan, -1 menghadap kiri
//   playing   : false jika gerakan dimatikan (frame diam di pose pertama)
export default function SnoopyAnimator({ animation, pose = "stand", held = "none", moving = false, facing = 1, playing = true }) {
  const name = moving ? "walk" : resolveAnimation(animation, pose);
  const frameKey = useFrameLoop(ANIMATIONS[name].frames, playing, name);
  const [broken, setBroken] = useState({});

  // Jika sprite gagal dimuat, tampilkan pose idle sebagai cadangan.
  const active = broken[frameKey] ? "idle" : frameKey;

  return (
    <div className="snoopy-figure" role="img" aria-label="Snoopy" data-anim={name} data-pose={pose} style={{ "--face": facing }}>
      <span className="snoopy-shadow" aria-hidden="true" />
      <div className="snoopy-body">
        <div className="snoopy-flip">
          {Object.entries(SPRITES).map(([key, sprite]) => (
            <img
              key={key}
              className={`sprite${key === active ? " on" : ""}`}
              src={sprite.src}
              alt=""
              draggable={false}
              decoding="async"
              // bottom negatif menghapus ruang transparan di bawah kaki, supaya semua pose menapak di garis tanah yang sama.
              style={{ height: `${(sprite.h / REF_HEIGHT) * 100}%`, bottom: `${-((sprite.b || 0) / REF_HEIGHT) * 100}%` }}
              onError={() => setBroken((b) => (b[key] ? b : { ...b, [key]: true }))}
            />
          ))}
          {held !== "none" && !moving && (
            <img className={`held-bomb${held === "bombLit" ? " lit" : ""}`} src={PROP_IMAGES.bomb} alt="" draggable={false} />
          )}
          {name === "read" && <span className="held-paper" aria-hidden="true" />}
        </div>
      </div>
    </div>
  );
}
