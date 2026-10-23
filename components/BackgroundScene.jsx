"use client";

import { useState } from "react";
import { BACKGROUNDS, DEFAULT_THEME, THEMES } from "../lib/backgrounds.js";
import { PROP_IMAGES } from "../lib/animations.js";

// Latar dari gambar di /public (lib/backgrounds.js). Pergantian adegan memindahkan "kamera"
// (zoom dan fokus) dan nuansa warna dengan transisi halus, atau crossfade jika latarnya berbeda.
// Di atas gambar ada dekorasi ringan: daun jatuh dan kupu-kupu (bisa dimatikan lewat tombol Gerakan).

const LEAVES = [
  { l: "12%", s: 13, d: 19, delay: -4 }, { l: "31%", s: 11, d: 23, delay: -13 },
  { l: "52%", s: 14, d: 21, delay: -8 }, { l: "70%", s: 10, d: 25, delay: -17 },
  { l: "88%", s: 12, d: 20, delay: -1 }
];

export default function BackgroundScene({ theme = DEFAULT_THEME }) {
  const cfg = THEMES[theme] || THEMES[DEFAULT_THEME];
  const [failed, setFailed] = useState({});
  const style = {
    "--zoom": cfg.zoom, "--ox": cfg.ox, "--oy": cfg.oy, "--px": cfg.px, "--tone": cfg.filter,
    backgroundColor: BACKGROUNDS[cfg.background]?.fallback
  };

  return (
    <div className="scenery" aria-hidden="true" style={style}>
      <div className="bg-camera">
        <div className="bg-breathe">
          {Object.entries(BACKGROUNDS).map(([id, bg]) =>
            failed[id] ? null : (
              <img
                key={id}
                className={`bg-layer${id === cfg.background ? " on" : ""}`}
                src={bg.src}
                alt=""
                draggable={false}
                onError={() => setFailed((f) => ({ ...f, [id]: true }))}
              />
            )
          )}
        </div>
      </div>
      <div className="sky-glow" />

      <div className="decor">
        {LEAVES.map((leaf, i) => (
          <span key={i} className="leaf-lane" style={{ left: leaf.l, "--s": `${leaf.s}px`, animationDuration: `${leaf.d}s`, animationDelay: `${leaf.delay}s` }}>
            <i className="leaf" style={{ animationDelay: `${leaf.delay}s` }} />
          </span>
        ))}
        <span className="fly-lane fly-a"><span className="fly-bob"><img className="butterfly" src={PROP_IMAGES.butterflyYellow} alt="" draggable={false} /></span></span>
        <span className="fly-lane fly-b"><span className="fly-bob"><img className="butterfly" src={PROP_IMAGES.butterflyBlue} alt="" draggable={false} /></span></span>
      </div>
    </div>
  );
}
