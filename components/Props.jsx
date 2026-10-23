"use client";

import { WOODSTOCK } from "../lib/animations.js";
import { useFrameLoop } from "../hooks/useFrameLoop.js";

// Properti yang ikut bergerak bersama Snoopy: Woodstock (PNG, berganti frame), not musik, dan "zzz".
// Papan pesan, bangku, dan kotak surat sudah ada di gambar latar, jadi tidak digambar ulang di sini.

const WOODSTOCK_FRAMES = {
  rest: [["rest", 2200], ["happy", 380], ["rest", 1500], ["happy", 380]],
  fly: [["fly", 220], ["happy", 220]]
};
const WS_REF = 400; // tinggi sprite Woodstock terbesar

export function Woodstock({ excited, playing }) {
  const mode = excited ? "fly" : "rest";
  const key = useFrameLoop(WOODSTOCK_FRAMES[mode], playing, mode);
  return (
    <div className={`prop prop-woodstock${excited ? " flying" : ""}`} aria-hidden="true">
      {Object.entries(WOODSTOCK).map(([k, s]) => (
        <img key={k} className={`ws${k === key ? " on" : ""}`} src={s.src} alt="" draggable={false} style={{ height: `${(s.h / WS_REF) * 100}%` }} />
      ))}
    </div>
  );
}

export function Notes() {
  return (
    <div className="prop prop-notes" aria-hidden="true">
      <span className="note n1">♪</span><span className="note n2">♫</span><span className="note n3">♪</span>
    </div>
  );
}

export function Zzz() {
  return (
    <div className="prop prop-zzz" aria-hidden="true">
      <span className="z z1">z</span><span className="z z2">z</span><span className="z z3">Z</span>
    </div>
  );
}

// Dipakai di dalam .snoopy-stage. list: "bird" (Woodstock) | "notes" | "zzz"
export function SceneProps({ list, excited, playing }) {
  const has = (name) => list.includes(name);
  return (
    <>
      {has("bird") && <Woodstock excited={excited} playing={playing} />}
      {has("notes") && <Notes />}
      {has("zzz") && <Zzz />}
    </>
  );
}
